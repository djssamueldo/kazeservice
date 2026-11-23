import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FEATURE_ICONS, FEATURE_SVG_ICONS, formatDateRelative, getEssentialFeaturesForType, formatCharacteristicValue, formatPrice } from '../data/propertyTypes';
import { getMainImage, handleImageError } from '../utils/propertyImages';

const PropertyListCard = ({ property, index }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const mainImage = getMainImage(property);

  // Vérifier si le bien est dans les favoris au chargement
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favorites.includes(property.id));
  }, [property.id]);

  // Basculer le favori
  const toggleFavorite = (e) => {
    e.preventDefault();
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const index = favorites.indexOf(property.id);

    if (index > -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push(property.id);
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
    setIsFavorite(favorites.includes(property.id));
  };

  // Partager le bien
  const handleShare = (e) => {
    e.preventDefault();
    if (navigator.share) {
      navigator.share({
        title: property.titre,
        text: property.description || 'Découvrez ce bien immobilier sur Kazeservices',
        url: window.location.origin + `/bien/${property.id}`
      }).catch((error) => console.log('Erreur de partage:', error));
    } else {
      // Fallback: copier l'URL dans le presse-papier
      navigator.clipboard.writeText(window.location.origin + `/bien/${property.id}`)
        .then(() => alert('Lien copié dans le presse-papier !'))
        .catch(() => alert('Impossible de copier le lien'));
    }
  };

  // Formatage de la date
  const publicationDate = formatDateRelative(property.created_at || property.published_at);

  // Fonction pour afficher les caractéristiques essentielles selon le type de bien
  const renderFeatures = () => {
    const type = property.type_bien || 'maison';
    const essentialFeatures = getEssentialFeaturesForType(type);
    const features = [];

    // Icônes SVG
    const icons = {
      chambres: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>',
      sdb: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line>',
      surface: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>',
      terrain: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>',
      garage: '<rect x="2" y="5" width="20" height="14" rx="2"></rect><path d="M6 5v14"></path><path d="M18 5v14"></path>',
      parking: '<rect x="2" y="5" width="20" height="14" rx="2"></rect><circle cx="7" cy="12" r="2"></circle><circle cx="17" cy="12" r="2"></circle>',
      nb_bureaux: '<rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>',
      etage: '<path d="M3 3h18v18H3z"></path><path d="M3 9h18"></path><path d="M9 3v18"></path>',
      constructible: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>',
      viabilise: '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>',
      titre_foncier: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>',
      vitrine: '<rect x="2" y="3" width="20" height="14" rx="2"></rect><path d="M8 21h8"></path><path d="M12 17v4"></path>',
      sanitaires: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line>',
      hauteur: '<line x1="12" y1="20" x2="12" y2="4"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="4"></line>',
      quai_chargement: '<rect x="2" y="7" width="20" height="14" rx="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>',
      acces_poids_lourds: '<rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle>',
      nb_etages: '<path d="M3 3h18v18H3z"></path><path d="M3 9h18"></path><path d="M3 15h18"></path><path d="M9 3v18"></path><path d="M15 3v18"></path>',
      nb_appartements: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>',
      nb_logements: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>',
      livraison: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>'
    };

    const addFeature = (key, value, label) => {
      if (value === undefined || value === null || value === '' || value === false) return '';

      // Gérer les caractéristiques personnalisées avec structure { value, icon }
      let actualValue = value;
      let customIcon = null;

      if (typeof value === 'object' && value !== null) {
        actualValue = value.value;
        customIcon = value.icon;
      }

      if (actualValue === undefined || actualValue === null || actualValue === '' || actualValue === false) return '';

      const iconSvg = customIcon ? (FEATURE_SVG_ICONS[customIcon] || icons.surface) : (icons[key] || icons.surface);
      const formattedValue = formatCharacteristicValue(key, actualValue);
      let displayValue;

      if (typeof actualValue === 'boolean') {
        // Pour les booléens, afficher uniquement le label (pas "Oui")
        displayValue = label;
      } else {
        // Pour les autres types, afficher la valeur formatée + le label
        displayValue = `${formattedValue} ${label}`;
      }

      features.push(
        <span key={key} className="feature">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: iconSvg }} />
          {displayValue}
        </span>
      );
    };

    // Labels courts pour les cartes (2-5 caractères max pour tenir sur une ligne)
    const shortLabels = {
      chambres: 'ch.',
      sdb: 'sdb',
      garage: 'gar.',
      parking: 'park.',
      nb_bureaux: 'bur.',
      etage: 'étg.',
      constructible: 'cst.',
      viabilise: 'viab',
      titre_foncier: 'titr',
      vitrine: 'vitr',
      sanitaires: 'san.',
      hauteur: 'haut',
      quai_chargement: 'quai',
      acces_poids_lourds: 'p.l.',
      nb_etages: 'étg',
      nb_appartements: 'app.',
      nb_logements: 'log.',
      livraison: 'livr'
    };

    // Parcourir les caractéristiques essentielles définies pour ce type de bien
    essentialFeatures.forEach(key => {
      const value = property[key];
      const label = shortLabels[key] || '';
      addFeature(key, value, label);
    });

    // Limiter à 6 caractéristiques pour l'affichage liste
    return features.slice(0, 6);
  };

  return (
    <div className="property-card-list" data-index={index}>
      <div className="property-list-image">
        <img
          src={mainImage}
          alt={property.titre}
          loading="lazy"
          onError={handleImageError}
        />
        <span className={`property-card-badge ${property.type}`}>
          {property.type === 'vente' ? 'Vente' : 'Location'}
        </span>
      </div>
      <div className="property-list-content">
        <div className="property-list-header">
          <h3 className="property-list-title">{property.titre}</h3>
          <div className="property-list-price">{formatPrice(property.prix)}</div>
        </div>
        <div className="property-list-location">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          {property.ville}
        </div>
        <p className="property-list-description">{property.description || 'Description non disponible'}</p>
        <div className="property-list-features">
          {renderFeatures()}
        </div>
        <div className="property-list-actions">
          <Link to={`/bien/${property.id}`} className="btn btn-primary btn-small">Voir le bien</Link>
          <div className="property-list-buttons">
            <button
              className={`property-card-favorite ${isFavorite ? 'active' : ''}`}
              data-property-id={property.id}
              aria-label="Ajouter aux favoris"
              onClick={toggleFavorite}
            >
              <svg viewBox="0 0 24 24" fill={isFavorite ? 'var(--brique)' : 'none'} stroke={isFavorite ? 'var(--brique)' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
            <button className="property-card-share" aria-label="Partager" onClick={handleShare}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyListCard;
