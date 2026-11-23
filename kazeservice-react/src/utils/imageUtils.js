/**
 * Utilitaires pour la normalisation et la validation des URLs d'images
 * Spécifiquement pour les formations
 */

import { convertImageUrl } from './propertyImages';

/**
 * Normalise une URL d'image de formation
 * Gère différents types d'URLs (absolues, relatives, locales)
 * @param {string} url - URL à normaliser
 * @param {string} fallback - URL de secours
 * @returns {string} URL normalisée
 */
export function normalizeFormationImageUrl(url, fallback = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop') {
  if (!url) return fallback;

  // Utiliser la fonction mutualisée pour la conversion
  const converted = convertImageUrl(url);

  // Si c'est une URL absolue (http/https), la retourner telle quelle
  if (converted.startsWith('http://') || converted.startsWith('https://')) {
    return converted;
  }

  // Si c'est un chemin local temporaire (upload en cours)
  if (converted.startsWith('blob:')) {
    return converted;
  }

  // Sinon, retourner le fallback
  return fallback;
}

/**
 * Vérifie si une URL est valide pour l'upload
 * Exclut les chemins locaux temporaires
 * @param {string} imageUrl - L'URL de l'image à vérifier
 * @returns {boolean} True si l'URL est valide pour l'upload
 */
export const isValidImageUrlForUpload = (imageUrl) => {
  if (!imageUrl) return false;
  if (imageUrl.startsWith('C:\\') || imageUrl.includes('Temp') || imageUrl.includes('tmp')) {
    return false;
  }
  return true;
};
