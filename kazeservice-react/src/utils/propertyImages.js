/**
 * Utilitaire centralisé pour la gestion des images des biens
 * Centralise la logique de récupération, validation et fallback des images
 */

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop';

/**
 * Convertit une URL relative en URL complète
 * @param {string} url - URL à convertir
 * @returns {string} URL complète
 */
export function convertImageUrl(url) {
  if (!url) return url;
  if (typeof url === 'object' && url.preview) {
    return url.preview;
  }
  if (typeof url === 'string' && url.startsWith('/storage/')) {
    return import.meta.env.VITE_API_URL?.replace('/api', '') + url;
  }
  return url;
}

/**
 * Récupère le tableau d'images d'un bien avec fallback
 * @param {Object} property - Le bien immobilier
 * @returns {string[]} Tableau d'images valides
 */
export function getPropertyImages(property) {
  if (!property) return [FALLBACK_IMAGE];

  // Si images existe et contient des éléments valides
  if (property.images && Array.isArray(property.images) && property.images.length > 0) {
    const validImages = property.images.filter(img => img && typeof img === 'string' && img.trim() !== '');
    if (validImages.length > 0) {
      // Convertir les chemins relatifs en URLs complètes
      return validImages.map(convertImageUrl);
    }
  }

  // Sinon, utiliser l'image unique si elle existe
  if (property.image && typeof property.image === 'string' && property.image.trim() !== '') {
    return [convertImageUrl(property.image)];
  }

  // Fallback
  return [FALLBACK_IMAGE];
}

/**
 * Récupère les images existantes d'un bien pour l'édition dans l'admin.
 * Fusionne images[] et image (image principale), déduplique en préservant
 * l'ordre (image principale en premier), et exclut les URLs de démonstration
 * (Unsplash) et l'image de fallback — celles-ci ne doivent jamais entrer
 * dans la galerie réelle gérée par l'administration.
 * @param {Object} property - Le bien immobilier
 * @returns {string[]} Tableau d'URLs d'images existantes
 */
export function getEditablePropertyImages(property) {
  if (!property) return [];

  const seen = new Set();
  const result = [];

  // image (principale) d'abord pour préserver son statut, puis la galerie
  const candidates = [property.image, ...(Array.isArray(property.images) ? property.images : [])];

  candidates.forEach((url) => {
    if (typeof url !== 'string' || url.trim() === '') return;
    // Exclure les images de démonstration / fallback
    if (url.includes('images.unsplash.com')) return;
    if (seen.has(url)) return;
    seen.add(url);
    result.push(url);
  });

  return result;
}

/**
 * Récupère l'image principale d'un bien
 * @param {Object} property - Le bien immobilier
 * @returns {string} URL de l'image principale
 */
export function getMainImage(property) {
  const images = getPropertyImages(property);
  return images[0] || FALLBACK_IMAGE;
}

/**
 * Gestionnaire d'erreur pour les images (fallback)
 * @param {Event} e - Event de l'erreur
 */
export function handleImageError(e) {
  // Éviter la boucle infinie
  if (e.target.src === FALLBACK_IMAGE) return;

  e.target.onerror = null;
  e.target.src = FALLBACK_IMAGE;
}

/**
 * Valide si une URL d'image est valide
 * @param {string} url - URL de l'image
 * @returns {boolean}
 */
export function isValidImageUrl(url) {
  if (!url || typeof url !== 'string') return false;
  return url.trim() !== '' && (url.startsWith('http://') || url.startsWith('https://'));
}

/**
 * Nettoie un ID de bien pour l'utiliser dans les chemins de fichiers
 * @param {string} id - ID du bien
 * @returns {string} ID nettoyé
 */
export function sanitizePropertyId(id) {
  if (!id) return 'unknown';
  // Remplacer les caractères invalides pour les chemins de fichiers
  return id.replace(/[^a-zA-Z0-9-_]/g, '_');
}

/**
 * Génère un nom de fichier unique pour l'upload
 * @param {string} propertyId - ID du bien
 * @param {number} index - Index de l'image
 * @param {string} extension - Extension du fichier
 * @returns {string} Nom de fichier
 */
export function generateFileName(propertyId, index, extension) {
  const sanitizedId = sanitizePropertyId(propertyId);
  const timestamp = Date.now();
  return `${sanitizedId}/${timestamp}-${index}.${extension}`;
}

/**
 * Extrait le chemin du fichier depuis une URL publique Supabase Storage
 * @param {string} imageUrl - URL publique de l'image
 * @returns {string|null} Chemin du fichier ou null
 */
export function extractFilePath(imageUrl) {
  try {
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/biens-photos/');
    if (pathParts.length < 2) return null;
    return pathParts[1];
  } catch (e) {
    return null;
  }
}
