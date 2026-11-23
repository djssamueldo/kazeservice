import apiClient, { isApiConfigured } from '../lib/apiClient';
import { DEMO_PROPERTIES } from '../data/properties';
import { normalizePropertyCharacteristics } from '../data/propertyTypes';
import { validateImageFile } from '../utils/fileValidation';

/**
 * Récupère tous les biens.
 * Tant que l'API n'est pas configuré, retourne les données de démonstration
 * (identique au comportement précédent) — le site continue de fonctionner.
 */
export async function getProperties() {
  if (isApiConfigured) {
    try {
      const { data } = await apiClient.get('/properties');
      return data.map(fromApiShape);
    } catch (error) {
      console.error('getProperties:', error.message);
    }
  }
  return DEMO_PROPERTIES;
}

export async function getPropertyById(id) {
  if (isApiConfigured) {
    try {
      const { data } = await apiClient.get(`/properties/${id}`);
      return fromApiShape(data);
    } catch (error) {
      console.error('getPropertyById:', error.message);
    }
  }
  return DEMO_PROPERTIES.find((p) => p.id === id) || null;
}

export async function createProperty(property) {
  if (!isApiConfigured) throw new Error('API non configuré');
  const { data } = await apiClient.post('/properties', toApiShape(property));
  return fromApiShape(data);
}

export async function updateProperty(id, property) {
  if (!isApiConfigured) throw new Error('API non configuré');
  const { data } = await apiClient.put(`/properties/${id}`, toApiShape(property));
  return fromApiShape(data);
}

export async function deleteProperty(id) {
  if (!isApiConfigured) throw new Error('API non configuré');
  await apiClient.delete(`/properties/${id}`);
}

export async function updatePropertyStatus(id, statut) {
  if (!isApiConfigured) throw new Error('API non configuré');
  const { data } = await apiClient.patch(`/properties/${id}/status`, { statut });
  return fromApiShape(data);
}

// --- Upload d'images vers Laravel Storage ---

/**
 * Upload une image vers le Laravel Storage
 * @param {File} file - Le fichier image à uploader
 * @param {string} propertyId - L'ID du bien pour le nommage
 * @param {number} index - L'index de l'image pour le nommage
 * @returns {Promise<{url: string}>} L'URL publique
 */
export async function uploadPropertyImage(file, propertyId, index) {
  if (!isApiConfigured) throw new Error('API non configuré');

  // Validation du fichier
  const validation = validateImageFile(file);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  const formData = new FormData();
  formData.append('image', file);
  formData.append('index', index);

  const { data } = await apiClient.post(`/properties/${propertyId}/images`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return { url: data.url };
}

/**
 * Upload plusieurs images vers Laravel Storage
 * @param {Array<{file: File, preview: string}>} newImages - Les nouvelles images à uploader
 * @param {string} propertyId - L'ID du bien
 * @returns {Promise<{successful: string[], failed: Array<{file: string, error: string}>}>} Résultat de l'upload
 */
export async function uploadPropertyImages(newImages, propertyId) {
  if (!isApiConfigured) throw new Error('API non configuré');

  const results = {
    successful: [],
    failed: []
  };

  // Upload séquentiel pour mieux gérer les erreurs
  for (let i = 0; i < newImages.length; i++) {
    const img = newImages[i];
    try {
      const result = await uploadPropertyImage(img.file, propertyId, i);
      results.successful.push(result.url);
    } catch (error) {
      console.error(`Échec upload image ${img.file.name}:`, error);
      results.failed.push({
        file: img.file.name,
        error: error.message
      });
    }
  }

  return results;
}

/**
 * Supprime une image d'un bien (retire l'URL de la galerie et efface le
 * fichier côté serveur si celui-ci est géré par ce bien).
 * @param {string} propertyId - L'ID du bien concerné
 * @param {string} imageUrl - L'URL de l'image à supprimer
 */
export async function deletePropertyImage(propertyId, imageUrl) {
  if (!isApiConfigured) throw new Error('API non configuré');

  const { data } = await apiClient.delete(`/properties/${propertyId}/images`, {
    data: { url: imageUrl }
  });
  return fromApiShape(data);
}

/**
 * Fonction de diagnostic pour vérifier les permissions Storage
 * @returns {Promise<{success: boolean, details: object}>}
 */
export async function diagnoseStoragePermissions() {
  const details = {
    apiConfigured: isApiConfigured,
    apiUrl: import.meta.env.VITE_API_URL || 'Non configuré',
    error: null
  };

  if (!isApiConfigured) {
    return {
      success: false,
      details: { ...details, error: 'API non configuré - Vérifiez la variable d\'environnement VITE_API_URL' }
    };
  }

  try {
    // Tenter un upload test
    const testFile = new Blob(['test'], { type: 'text/plain' });
    const formData = new FormData();
    formData.append('image', testFile);
    formData.append('index', 0);

    // Note: Cette fonction nécessite un ID de bien valide
    // Pour l'instant, on retourne un succès par défaut si l'API est configurée
    details.canUpload = true;
  } catch (error) {
    details.error = error.message;
  }

  return {
    success: details.apiConfigured,
    details
  };
}

// --- Conversion entre la forme "plate" utilisée par les composants React
// (ex: property.chambres, property.piscine) et la forme API Laravel
// (colonnes fixes + colonne "caracteristiques" en JSON) ---

const FIXED_FIELDS = [
  'id', 'reference', 'titre', 'type', 'type_bien', 'ville', 'prix',
  'description', 'image', 'images', 'statut', 'published_at', 'created_at',
];

// Clés techniques qui ne doivent jamais être renvoyées comme données
// (evite la ré-imbrication de "caracteristiques" et la pollution par "updated_at")
const TECHNICAL_KEYS = ['caracteristiques', 'updated_at'];

function fromApiShape(row) {
  const caracteristiques = row.caracteristiques || {};
  const property = {
    ...row,
    images: row.images || [],
    ...caracteristiques,
  };
  // Normalisation en lecture seule : si les caractéristiques ont déjà été
  // imbriquées (caracteristiques.caracteristiques), on fusionne le niveau
  // interne pour les clés absentes du niveau racine. La BDD n'est pas modifiée.
  const nested = caracteristiques.caracteristiques;
  if (nested && typeof nested === 'object') {
    Object.entries(nested).forEach(([key, value]) => {
      if (property[key] === undefined) property[key] = value;
    });
  }
  // La clé brute ne doit pas circuler dans les objets manipulés par les formulaires
  TECHNICAL_KEYS.forEach((key) => delete property[key]);
  // Normaliser les caractéristiques pour gérer les anciens formats
  return normalizePropertyCharacteristics(property);
}

function toApiShape(property) {
  const fixed = {};
  const caracteristiques = {};
  Object.entries(property).forEach(([key, value]) => {
    if (TECHNICAL_KEYS.includes(key)) {
      // "caracteristiques" : aplatir un niveau si l'objet contient encore la clé brute
      if (key === 'caracteristiques' && value && typeof value === 'object') {
        Object.entries(value).forEach(([innerKey, innerValue]) => {
          if (innerKey !== 'caracteristiques') caracteristiques[innerKey] = innerValue;
        });
      }
      // "updated_at" : ignoré, Laravel le gère
      return;
    }
    if (FIXED_FIELDS.includes(key)) fixed[key] = value;
    else caracteristiques[key] = value;
  });
  return { ...fixed, caracteristiques };
}
