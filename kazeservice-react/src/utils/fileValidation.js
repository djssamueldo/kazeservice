/**
 * Utilitaires pour la validation de fichiers
 * Fonctions communes pour valider les fichiers uploadés
 */

import { STORAGE_CONFIG } from '../lib/config';

/**
 * Valide un fichier image pour upload
 * @param {File} file - Le fichier à valider
 * @returns {object} { isValid: boolean, error: string }
 */
export function validateImageFile(file) {
  if (!file) {
    return { isValid: false, error: 'Fichier requis' };
  }

  if (file.size > STORAGE_CONFIG.maxFileSize) {
    return { isValid: false, error: `Fichier trop grand (max ${STORAGE_CONFIG.maxFileSize / 1024 / 1024}MB)` };
  }

  const extension = file.name.split('.').pop().toLowerCase();
  if (!STORAGE_CONFIG.allowedExtensions.includes(extension)) {
    return { isValid: false, error: `Extension non autorisée. Extensions acceptées: ${STORAGE_CONFIG.allowedExtensions.join(', ')}` };
  }

  return { isValid: true };
}
