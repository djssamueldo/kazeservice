// Configuration centralisée pour éviter la redondance
// Ce fichier contient toutes les constantes et configurations utilisées dans l'application

export const API_CONFIG = {
  // URL de l'API (définie dans .env)
  get apiUrl() {
    return import.meta.env.VITE_API_URL || 'http://localhost:8000';
  },

  // Timeout des requêtes API (en millisecondes)
  timeout: 30000,

  // Nombre de tentatives de retry
  maxRetries: 3,
};

export const STORAGE_CONFIG = {
  // Configuration du stockage des images
  maxFileSize: 20 * 1024 * 1024, // 20MB
  allowedExtensions: ['jpg', 'jpeg', 'png', 'avif'],
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/avif'],

  // Chemins de stockage
  paths: {
    properties: 'properties',
    partners: 'partners',
    formations: 'formations',
  },
};

export const VALIDATION_CONFIG = {
  // Validation des formulaires
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    maxLength: 255,
  },
  telephone: {
    pattern: /^[+]?[0-9\s\-()]{8,20}$/,
    maxLength: 20,
  },
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
  },
};

export const STATUS_CONFIG = {
  // Statuts des biens
  property: {
    disponible: 'disponible',
    vendu: 'vendu',
    loue: 'loué',
    reserve: 'réservé',
  },

  // Statuts des partenaires
  partner: {
    brouillon: 'brouillon',
    publie: 'publie',
    archive: 'archive',
  },

  // Statuts des messages
  message: {
    nouveau: 'nouveau',
    lu: 'lu',
    traite: 'traite',
    archive: 'archive',
  },

  // Statuts des rendez-vous
  appointment: {
    nouveau: 'nouveau',
    confirme: 'confirmé',
    annule: 'annulé',
    termine: 'terminé',
  },
};

export const DATE_CONFIG = {
  // Configuration des dates
  locale: 'fr-FR',
  dateFormat: 'dd/MM/yyyy',
  dateTimeFormat: 'dd/MM/yyyy HH:mm',

  // Options de formatage
  formatDateOptions: {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  },
};

export const UI_CONFIG = {
  // Configuration de l'interface utilisateur
  pagination: {
    defaultPageSize: 12,
    pageSizeOptions: [12, 24, 48, 96],
  },

  debounceDelay: 300, // Délai pour les recherches en temps réel

  toastDuration: 5000, // Durée d'affichage des notifications
};

export const FEATURE_FLAGS = {
  // Fonctionnalités activées/désactivées
  enableRealTimeUpdates: false,
  enableDarkMode: false,
  enableMultiLanguage: false,
};
