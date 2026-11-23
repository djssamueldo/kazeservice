/**
 * Utilitaires pour les chaînes de caractères
 * Fonctions communes pour le formatage et la transformation de textes
 */

/**
 * Convertit un texte en slug (URL-friendly)
 * @param {string} text - Le texte à convertir
 * @returns {string} Le slug généré
 */
export function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // enlève les accents
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Convertit un texte en slug (alias pour slugify)
 * @param {string} text - Le texte à convertir
 * @returns {string} Le slug généré
 */
export function generateSlug(text) {
  return slugify(text);
}
