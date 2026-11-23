// Définition des caractéristiques par type de bien immobilier
export const PROPERTY_TYPES = {
  maison: {
    labelKey: 'propertyTypes.maison',
    label: 'Maison',
    icon: 'home',
    // Caractéristiques essentielles pour les cartes (max 4)
    essentialFeatures: ['chambres', 'surface', 'sdb', 'garage'],
    // Toutes les caractéristiques pour la page détail
    allFeatures: ['surface', 'terrain', 'chambres', 'salons', 'sdb', 'cuisines', 'garage', 'parking', 'piscine', 'terrasse', 'jardin', 'etages', 'climatisation', 'chauffage', 'cuisine_equipee', 'balcon', 'vue_mer', 'vue_montagne']
  },
  villa: {
    labelKey: 'propertyTypes.villa',
    label: 'Villa',
    icon: 'home',
    essentialFeatures: ['chambres', 'surface', 'sdb', 'garage'],
    allFeatures: ['surface', 'terrain', 'chambres', 'salons', 'sdb', 'cuisines', 'garage', 'parking', 'piscine', 'terrasse', 'jardin', 'etages', 'climatisation', 'chauffage', 'cuisine_equipee', 'balcon', 'vue_mer', 'vue_montagne']
  },
  appartement: {
    labelKey: 'propertyTypes.appartement',
    label: 'Appartement',
    icon: 'building',
    essentialFeatures: ['chambres', 'surface', 'sdb', 'etage'],
    allFeatures: ['surface', 'chambres', 'sdb', 'etage', 'ascenseur', 'balcon', 'parking', 'cave', 'charges', 'climatisation', 'cuisine_equipee', 'meuble']
  },
  terrain: {
    labelKey: 'propertyTypes.terrain',
    label: 'Terrain',
    icon: 'map',
    essentialFeatures: ['surface', 'constructible', 'viabilise', 'titre_foncier'],
    allFeatures: ['surface', 'facade', 'profondeur', 'constructible', 'viabilise', 'acces', 'eau', 'electricite', 'titre_foncier', 'zone', 'forme_terrain', 'pente']
  },
  bureau: {
    labelKey: 'propertyTypes.bureau',
    label: 'Bureau',
    icon: 'briefcase',
    essentialFeatures: ['surface', 'nb_bureaux', 'sanitaires', 'parking'],
    allFeatures: ['surface', 'nb_bureaux', 'salle_reunion', 'sanitaires', 'parking', 'climatisation', 'etage', 'ascenseur', 'cuisine', 'securite']
  },
  local_commercial: {
    labelKey: 'propertyTypes.localCommercial',
    label: 'Local commercial',
    icon: 'store',
    essentialFeatures: ['surface', 'vitrine', 'sanitaires', 'parking'],
    allFeatures: ['surface', 'facade', 'reserve', 'vitrine', 'parking', 'emplacement', 'sanitaires', 'climatisation', 'acces_handicape']
  },
  entrepot: {
    labelKey: 'propertyTypes.entrepot',
    label: 'Entrepôt',
    icon: 'warehouse',
    essentialFeatures: ['surface', 'hauteur', 'quai_chargement', 'acces_poids_lourds'],
    allFeatures: ['surface', 'hauteur', 'quai_chargement', 'acces_poids_lourds', 'parking', 'securite', 'climatisation']
  },
  immeuble: {
    labelKey: 'propertyTypes.immeuble',
    label: 'Immeuble',
    icon: 'building',
    essentialFeatures: ['surface', 'nb_etages', 'nb_appartements', 'parking'],
    allFeatures: ['surface', 'nb_etages', 'nb_appartements', 'ascenseur', 'parking', 'climatisation', 'securite']
  },
  programme_neuf: {
    labelKey: 'propertyTypes.programmeNeuf',
    label: 'Programme neuf',
    icon: 'building',
    essentialFeatures: ['surface', 'nb_logements', 'livraison', 'garage'],
    allFeatures: ['surface', 'nb_logements', 'livraison', 'garage', 'piscine', 'terrasse', 'jardin', 'climatisation', 'ascenseur']
  }
};

// Icônes SVG pour chaque caractéristique
export const FEATURE_SVG_ICONS = {
  chambres: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>',
  salons: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>',
  sdb: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line>',
  cuisines: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path><line x1="7" y1="2" x2="7" y2="22"></line><line x1="3" y1="10" x2="21" y2="10"></line>',
  garage: '<rect x="2" y="5" width="20" height="14" rx="2"></rect><path d="M6 5v14"></path><path d="M18 5v14"></path>',
  parking: '<rect x="2" y="5" width="20" height="14" rx="2"></rect><circle cx="7" cy="12" r="2"></circle><circle cx="17" cy="12" r="2"></circle>',
  nb_bureaux: '<rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>',
  etage: '<path d="M3 3h18v18H3z"></path><path d="M3 9h18"></path><path d="M9 3v18"></path>',
  nb_etages: '<path d="M3 3h18v18H3z"></path><path d="M3 9h18"></path><path d="M3 15h18"></path><path d="M9 3v18"></path><path d="M15 3v18"></path>',
  nb_appartements: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>',
  nb_logements: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>',
  piscine: '<path d="M2 12h20"></path><path d="M2 12c0 5 4 9 9 9s9-4 9-9"></path><path d="M2 12c0-5 4-9 9-9s9 4 9 9"></path>',
  terrasse: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>',
  jardin: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>',
  climatisation: '<path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"></path>',
  chauffage: '<path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path>',
  cuisine_equipee: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path><line x1="7" y1="2" x2="7" y2="22"></line><line x1="3" y1="10" x2="21" y2="10"></line>',
  balcon: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>',
  vue_mer: '<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 1.3 0 1.9-.5 2.5-1"></path><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 1.3 0 1.9-.5 2.5-1"></path><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 1.3 0 1.9-.5 2.5-1"></path>',
  vue_montagne: '<path d="m8 3 4 8 5-5 5 15H2L8 3z"></path>',
  ascenseur: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline><path d="M12 2v20"></path><path d="M8 6h8"></path>',
  meuble: '<path d="M2 2v20"></path><path d="M22 2v20"></path><path d="M2 10h20"></path><path d="M2 16h20"></path>',
  constructible: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>',
  viabilise: '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>',
  securite: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>'
};

// Fonction pour déterminer si une caractéristique doit afficher une icône
export const shouldShowIcon = (key, value) => {
  // Booléens : toujours afficher l'icône (garder le ✓ + ajouter icône)
  if (typeof value === 'boolean') return true;

  // Valeurs numériques seules : afficher l'icône (ex: 3 chambres)
  if (typeof value === 'number') return true;

  // Chaînes de caractères : PAS d'icône pour les textes longs (ex: "320 m²", "Charges")
  if (typeof value === 'string') return false;

  return false;
};

// Icônes pour chaque caractéristique
export const FEATURE_ICONS = {
  surface: { icon: 'square', labelKey: 'features.surface', label: 'Surface' },
  terrain: { icon: 'map', labelKey: 'features.terrain', label: 'Terrain' },
  chambres: { icon: 'bed', labelKey: 'features.chambres', label: 'Chambres' },
  salons: { icon: 'sofa', labelKey: 'features.salons', label: 'Salons' },
  sdb: { icon: 'bath', labelKey: 'features.sdb', label: 'Salles de bain' },
  cuisines: { icon: 'utensils', labelKey: 'features.cuisines', label: 'Cuisines' },
  garage: { icon: 'car', labelKey: 'features.garage', label: 'Garage' },
  piscine: { icon: 'water', labelKey: 'features.piscine', label: 'Piscine' },
  terrasse: { icon: 'sun', labelKey: 'features.terrasse', label: 'Terrasse' },
  jardin: { icon: 'leaf', labelKey: 'features.jardin', label: 'Jardin' },
  etages: { icon: 'layers', labelKey: 'features.etages', label: 'Étages' },
  etage: { icon: 'layer', labelKey: 'features.etage', label: 'Étage' },
  climatisation: { icon: 'wind', labelKey: 'features.climatisation', label: 'Climatisation' },
  chauffage: { icon: 'thermometer', labelKey: 'features.chauffage', label: 'Chauffage' },
  cuisine_equipee: { icon: 'chef-hat', labelKey: 'features.cuisineEquipee', label: 'Cuisine équipée' },
  balcon: { icon: 'sun', labelKey: 'features.balcon', label: 'Balcon' },
  vue_mer: { icon: 'waves', labelKey: 'features.vueMer', label: 'Vue mer' },
  vue_montagne: { icon: 'mountain', labelKey: 'features.vueMontagne', label: 'Vue montagne' },
  ascenseur: { icon: 'arrow-up', labelKey: 'features.ascenseur', label: 'Ascenseur' },
  parking: { icon: 'parking', labelKey: 'features.parking', label: 'Parking' },
  cave: { icon: 'box', labelKey: 'features.cave', label: 'Cave' },
  charges: { icon: 'euro', labelKey: 'features.charges', label: 'Charges' },
  meuble: { icon: 'couch', labelKey: 'features.meuble', label: 'Meublé' },
  constructible: { icon: 'hammer', labelKey: 'features.constructible', label: 'Constructible' },
  viabilise: { icon: 'plug', labelKey: 'features.viabilise', label: 'Viabilisé' },
  facade: { icon: 'ruler', labelKey: 'features.facade', label: 'Façade' },
  profondeur: { icon: 'ruler', labelKey: 'features.profondeur', label: 'Profondeur' },
  acces: { icon: 'road', labelKey: 'features.acces', label: 'Accès' },
  eau: { icon: 'droplet', labelKey: 'features.eau', label: 'Eau' },
  electricite: { icon: 'zap', labelKey: 'features.electricite', label: 'Électricité' },
  localisation: { icon: 'map-pin', labelKey: 'features.localisation', label: 'Localisation' },
  titre_foncier: { icon: 'file-text', labelKey: 'features.titreFoncier', label: 'Titre foncier' },
  zone: { icon: 'map', labelKey: 'features.zone', label: 'Zone' },
  forme_terrain: { icon: 'shape', labelKey: 'features.formeTerrain', label: 'Forme du terrain' },
  pente: { icon: 'trending-up', labelKey: 'features.pente', label: 'Pente' },
  nb_bureaux: { icon: 'briefcase', labelKey: 'features.nbBureaux', label: 'Nombre de bureaux' },
  salle_reunion: { icon: 'users', labelKey: 'features.salleReunion', label: 'Salle de réunion' },
  sanitaires: { icon: 'bath', labelKey: 'features.sanitaires', label: 'Sanitaires' },
  cuisine: { icon: 'utensils', labelKey: 'features.cuisine', label: 'Cuisine' },
  securite: { icon: 'shield', labelKey: 'features.securite', label: 'Sécurité' },
  reserve: { icon: 'box', labelKey: 'features.reserve', label: 'Réserve' },
  vitrine: { icon: 'eye', labelKey: 'features.vitrine', label: 'Vitrine' },
  emplacement: { icon: 'map-pin', labelKey: 'features.emplacement', label: 'Emplacement' },
  acces_handicape: { icon: 'wheelchair', labelKey: 'features.accesHandicape', label: 'Accès handicapé' },
  hauteur: { icon: 'arrow-up', labelKey: 'features.hauteur', label: 'Hauteur' },
  quai_chargement: { icon: 'truck', labelKey: 'features.quaiChargement', label: 'Quai de chargement' },
  acces_poids_lourds: { icon: 'truck', labelKey: 'features.accesPoidsLourds', label: 'Accès poids lourds' },
  nb_etages: { icon: 'layers', labelKey: 'features.nbEtages', label: 'Nombre d\'étages' },
  nb_appartements: { icon: 'building', labelKey: 'features.nbAppartements', label: 'Nombre d\'appartements' },
  nb_logements: { icon: 'home', labelKey: 'features.nbLogements', label: 'Nombre de logements' },
  livraison: { icon: 'calendar', labelKey: 'features.livraison', label: 'Livraison' }
};

// Fonction pour obtenir les caractéristiques essentielles pour les cartes (max 4)
export const getEssentialFeaturesForType = (typeBien) => {
  const typeConfig = PROPERTY_TYPES[typeBien];
  return typeConfig ? typeConfig.essentialFeatures : [];
};

// Fonction pour obtenir toutes les caractéristiques pour la page détail
export const getAllFeaturesForType = (typeBien) => {
  const typeConfig = PROPERTY_TYPES[typeBien];
  return typeConfig ? typeConfig.allFeatures : [];
};

// Fonction obsolète, conservée pour compatibilité
export const getFeaturesForType = (typeBien) => {
  const typeConfig = PROPERTY_TYPES[typeBien];
  return typeConfig ? typeConfig.allFeatures : [];
};

// Fonction pour formater les dates de manière relative
export const formatDateRelative = (dateString) => {
  if (!dateString) return 'Date non renseignée';

  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Aujourd\'hui';
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `Il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`;
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `Il y a ${months} mois`;
  }

  const years = Math.floor(diffDays / 365);
  return `Il y a ${years} an${years > 1 ? 's' : ''}`;
};

// Fonction pour trier les biens par date de publication
export const sortPropertiesByDate = (properties, order = 'desc') => {
  return [...properties].sort((a, b) => {
    const dateA = new Date(a.created_at || a.published_at || 0);
    const dateB = new Date(b.created_at || b.published_at || 0);
    // S'assurer que les dates invalides sont traitées comme 0
    const validDateA = isNaN(dateA.getTime()) ? 0 : dateA.getTime();
    const validDateB = isNaN(dateB.getTime()) ? 0 : dateB.getTime();
    return order === 'desc' ? validDateB - validDateA : validDateA - validDateB;
  });
};

// Fonction pour formater les prix avec FCFA
export const formatPrice = (price) => {
  if (!price) return '';
  // Convertir en nombre si c'est une chaîne
  const numericPrice = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.-]/g, '')) : price;
  if (isNaN(numericPrice)) return price;
  // Formater avec séparateurs de milliers et ajouter l'unité de devise
  return `${numericPrice.toLocaleString('fr-FR')} FCFA`;
};

// Fonction pour formater la valeur d'une caractéristique avec son unité
export const formatCharacteristicValue = (key, value) => {
  if (value === undefined || value === null || value === '' || value === false) return '';

  // Caractéristiques booléennes
  if (typeof value === 'boolean') {
    return value ? '✓' : '';
  }

  // Caractéristiques textuelles qui sont des variantes de "oui"
  if (typeof value === 'string') {
    const trimmedValue = value.trim().toLowerCase();
    if (trimmedValue === 'oui' || trimmedValue === 'yes') {
      return '✓';
    }
  }

  // Caractéristiques de surface (m²)
  const surfaceFeatures = ['surface', 'terrain', 'surface_habitable', 'surface_construite'];
  if (surfaceFeatures.includes(key) && typeof value === 'number') {
    return `${value} m²`;
  }

  // Caractéristiques de dimension linéaire (m)
  const linearFeatures = ['facade', 'profondeur', 'hauteur'];
  if (linearFeatures.includes(key) && typeof value === 'number') {
    return `${value} m`;
  }

  // Caractéristiques numériques simples (sans unité)
  if (typeof value === 'number') {
    return value.toString();
  }

  // Caractéristiques textuelles
  return value.toString();
};

// Fonction pour normaliser les caractéristiques d'un bien (gérer les anciens formats)
export const normalizePropertyCharacteristics = (property) => {
  if (!property) return property;

  const normalized = { ...property };
  const excludedKeys = ['id', 'titre', 'type', 'type_bien', 'ville', 'prix', 'description', 'statut', 'image', 'images', 'created_at', 'published_at', 'reference'];

  Object.keys(normalized).forEach(key => {
    // Ignorer les champs qui ne sont pas des caractéristiques
    if (excludedKeys.includes(key)) return;

    const value = normalized[key];

    // Si la valeur est déjà un objet { value, icon }, normaliser la valeur interne
    if (typeof value === 'object' && value !== null && 'value' in value) {
      const innerValue = value.value;
      if (typeof innerValue === 'string') {
        const trimmedValue = innerValue.trim().toLowerCase();
        if (trimmedValue === 'oui' || trimmedValue === 'yes' || trimmedValue === 'true') {
          normalized[key] = { ...value, value: true };
        } else if (trimmedValue === 'non' || trimmedValue === 'no' || trimmedValue === 'false') {
          normalized[key] = { ...value, value: false };
        } else if (!isNaN(parseFloat(innerValue)) && isFinite(innerValue)) {
          normalized[key] = { ...value, value: parseFloat(innerValue) };
        }
      }
      return;
    }

    // Si la valeur est une chaîne "true"/"false"/"oui"/"non", la convertir en booléen
    if (typeof value === 'string') {
      const trimmedValue = value.trim().toLowerCase();
      if (trimmedValue === 'true' || trimmedValue === 'oui' || trimmedValue === 'yes') {
        normalized[key] = true;
      } else if (trimmedValue === 'false' || trimmedValue === 'non' || trimmedValue === 'no') {
        normalized[key] = false;
      }
      // Si la valeur est une chaîne numérique, la convertir en nombre
      else if (!isNaN(parseFloat(value)) && isFinite(value)) {
        normalized[key] = parseFloat(value);
      }
    }
  });

  return normalized;
};
