// Fonctions de validation centralisées pour la sécurité des données
import { VALIDATION_CONFIG, STORAGE_CONFIG } from './config';

/**
 * Valide un email
 * @param {string} email - L'email à valider
 * @returns {object} { isValid: boolean, error: string }
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email requis' };
  }

  if (email.length > VALIDATION_CONFIG.email.maxLength) {
    return { isValid: false, error: `Email trop long (max ${VALIDATION_CONFIG.email.maxLength} caractères)` };
  }

  if (!VALIDATION_CONFIG.email.pattern.test(email)) {
    return { isValid: false, error: 'Format d\'email invalide' };
  }

  return { isValid: true };
}

/**
 * Valide un numéro de téléphone
 * @param {string} telephone - Le téléphone à valider
 * @returns {object} { isValid: boolean, error: string }
 */
export function validateTelephone(telephone) {
  if (!telephone || typeof telephone !== 'string') {
    return { isValid: false, error: 'Téléphone requis' };
  }

  if (telephone.length > VALIDATION_CONFIG.telephone.maxLength) {
    return { isValid: false, error: `Téléphone trop long (max ${VALIDATION_CONFIG.telephone.maxLength} caractères)` };
  }

  if (!VALIDATION_CONFIG.telephone.pattern.test(telephone)) {
    return { isValid: false, error: 'Format de téléphone invalide' };
  }

  return { isValid: true };
}

/**
 * Valide un mot de passe
 * @param {string} password - Le mot de passe à valider
 * @returns {object} { isValid: boolean, error: string }
 */
export function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return { isValid: false, error: 'Mot de passe requis' };
  }

  if (password.length < VALIDATION_CONFIG.password.minLength) {
    return { isValid: false, error: `Mot de passe trop court (min ${VALIDATION_CONFIG.password.minLength} caractères)` };
  }

  if (VALIDATION_CONFIG.password.requireUppercase && !/[A-Z]/.test(password)) {
    return { isValid: false, error: 'Le mot de passe doit contenir au moins une majuscule' };
  }

  if (VALIDATION_CONFIG.password.requireLowercase && !/[a-z]/.test(password)) {
    return { isValid: false, error: 'Le mot de passe doit contenir au moins une minuscule' };
  }

  if (VALIDATION_CONFIG.password.requireNumber && !/[0-9]/.test(password)) {
    return { isValid: false, error: 'Le mot de passe doit contenir au moins un chiffre' };
  }

  return { isValid: true };
}

/**
 * Valide un fichier image
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
    return { isValid: false, error: `Extension non autorisée: ${extension}` };
  }

  if (!STORAGE_CONFIG.allowedMimeTypes.includes(file.type)) {
    return { isValid: false, error: `Type MIME non autorisé: ${file.type}` };
  }

  return { isValid: true };
}

/**
 * Valide un texte (nom, description, etc.)
 * @param {string} text - Le texte à valider
 * @param {object} options - Options de validation
 * @returns {object} { isValid: boolean, error: string }
 */
export function validateText(text, options = {}) {
  const {
    required = true,
    minLength = 0,
    maxLength = 1000,
    fieldName = 'Champ'
  } = options;

  if (required && (!text || typeof text !== 'string' || text.trim() === '')) {
    return { isValid: false, error: `${fieldName} requis` };
  }

  if (text && text.length < minLength) {
    return { isValid: false, error: `${fieldName} trop court (min ${minLength} caractères)` };
  }

  if (text && text.length > maxLength) {
    return { isValid: false, error: `${fieldName} trop long (max ${maxLength} caractères)` };
  }

  return { isValid: true };
}

/**
 * Valide un nombre (prix, surface, etc.)
 * @param {number|string} value - La valeur à valider
 * @param {object} options - Options de validation
 * @returns {object} { isValid: boolean, error: string }
 */
export function validateNumber(value, options = {}) {
  const {
    required = true,
    min = 0,
    max = Infinity,
    fieldName = 'Champ'
  } = options;

  if (required && (value === null || value === undefined || value === '')) {
    return { isValid: false, error: `${fieldName} requis` };
  }

  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    return { isValid: false, error: `${fieldName} doit être un nombre` };
  }

  if (numValue < min) {
    return { isValid: false, error: `${fieldName} doit être supérieur à ${min}` };
  }

  if (numValue > max) {
    return { isValid: false, error: `${fieldName} doit être inférieur à ${max}` };
  }

  return { isValid: true };
}

/**
 * Valide un formulaire complet
 * @param {object} formData - Les données du formulaire
 * @param {object} validationRules - Les règles de validation
 * @returns {object} { isValid: boolean, errors: object }
 */
export function validateForm(formData, validationRules) {
  const errors = {};
  let isValid = true;

  for (const [field, rules] of Object.entries(validationRules)) {
    const value = formData[field];

    if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      errors[field] = rules.requiredMessage || `${field} est requis`;
      isValid = false;
      continue;
    }

    if (rules.email && value) {
      const emailValidation = validateEmail(value);
      if (!emailValidation.isValid) {
        errors[field] = emailValidation.error;
        isValid = false;
      }
    }

    if (rules.telephone && value) {
      const phoneValidation = validateTelephone(value);
      if (!phoneValidation.isValid) {
        errors[field] = phoneValidation.error;
        isValid = false;
      }
    }

    if (rules.minLength && value && value.length < rules.minLength) {
      errors[field] = rules.minLengthMessage || `${field} trop court (min ${rules.minLength} caractères)`;
      isValid = false;
    }

    if (rules.maxLength && value && value.length > rules.maxLength) {
      errors[field] = rules.maxLengthMessage || `${field} trop long (max ${rules.maxLength} caractères)`;
      isValid = false;
    }

    if (rules.pattern && value && !rules.pattern.test(value)) {
      errors[field] = rules.patternMessage || `${field} format invalide`;
      isValid = false;
    }
  }

  return { isValid, errors };
}

/**
 * Sanitize une chaîne de caractères pour éviter les injections XSS
 * @param {string} str - La chaîne à sanitize
 * @returns {string} La chaîne sanitize
 */
export function sanitizeString(str) {
  if (!str || typeof str !== 'string') return '';

  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}
