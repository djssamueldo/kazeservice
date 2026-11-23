import { useState, useEffect } from 'react';
import { PROPERTY_TYPES, FEATURE_ICONS, FEATURE_SVG_ICONS, getAllFeaturesForType } from '../data/propertyTypes';
import './PropertyCharacteristicEditor.css';

const PropertyCharacteristicEditor = ({ typeBien, characteristics, onChange }) => {
  const [customCharacteristic, setCustomCharacteristic] = useState({ name: '', value: '', icon: '' });
  const [showCustomForm, setShowCustomForm] = useState(false);

  // Obtenir les caractéristiques pour le type de bien actuel
  const typeConfig = PROPERTY_TYPES[typeBien] || PROPERTY_TYPES.maison;
  const features = getAllFeaturesForType(typeBien);

  // Définir le type d'input pour chaque caractéristique
  const getInputType = (key) => {
    // Caractéristiques numériques
    const numericFeatures = [
      'surface', 'terrain', 'chambres', 'salons', 'sdb', 'cuisines', 'garage',
      'parking', 'nb_bureaux', 'salle_reunion', 'sanitaires', 'etage', 'etages',
      'nb_etages', 'nb_appartements', 'nb_logements', 'hauteur', 'facade', 'profondeur'
    ];

    if (numericFeatures.includes(key)) return 'number';

    // Caractéristiques booléennes
    const booleanFeatures = [
      'piscine', 'terrasse', 'jardin', 'climatisation', 'chauffage', 'cuisine_equipee',
      'balcon', 'vue_mer', 'vue_montagne', 'ascenseur', 'cave', 'meuble',
      'constructible', 'viabilise', 'titre_foncier', 'securite', 'reserve',
      'vitrine', 'acces_handicape', 'quai_chargement', 'acces_poids_lourds', 'eau', 'electricite'
    ];

    if (booleanFeatures.includes(key)) return 'boolean';

    // Caractéristiques textuelles
    return 'text';
  };

  const handleCharacteristicChange = (key, value) => {
    const inputType = getInputType(key);

    let processedValue;
    if (inputType === 'number') {
      processedValue = value === '' ? '' : parseFloat(value);
    } else if (inputType === 'boolean') {
      processedValue = value;
    } else {
      processedValue = value;
    }

    onChange({
      ...characteristics,
      [key]: processedValue
    });
  };

  const handleAddCustomCharacteristic = () => {
    if (!customCharacteristic.name.trim()) return;

    const key = customCharacteristic.name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    const value = customCharacteristic.value;

    // Déterminer le type de valeur
    let processedValue;
    const trimmedValue = value.trim().toLowerCase();

    // Reconnaître les variantes de "oui" pour les convertir en booléen
    if (trimmedValue === 'true' || trimmedValue === 'oui' || trimmedValue === 'yes') {
      processedValue = true;
    } else if (trimmedValue === 'false' || trimmedValue === 'non' || trimmedValue === 'no') {
      processedValue = false;
    } else if (!isNaN(parseFloat(value)) && isFinite(value)) {
      processedValue = parseFloat(value);
    } else {
      processedValue = value;
    }

    // Stocker avec l'icône si choisie
    const characteristicData = {
      value: processedValue
    };

    if (customCharacteristic.icon) {
      characteristicData.icon = customCharacteristic.icon;
    }

    onChange({
      ...characteristics,
      [key]: characteristicData
    });

    // Réinitialiser le formulaire
    setCustomCharacteristic({ name: '', value: '', icon: '' });
    setShowCustomForm(false);
  };

  const handleRemoveCharacteristic = (key) => {
    const newCharacteristics = { ...characteristics };
    delete newCharacteristics[key];
    onChange(newCharacteristics);
  };

  // Obtenir le label pour une caractéristique
  const getLabel = (key) => {
    const iconConfig = FEATURE_ICONS[key];
    if (iconConfig) return iconConfig.label;

    // Pour les caractéristiques personnalisées
    return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Obtenir l'unité pour les caractéristiques numériques
  const getUnit = (key) => {
    const units = {
      surface: 'm²',
      terrain: 'm²',
      facade: 'm',
      profondeur: 'm',
      hauteur: 'm'
    };
    return units[key] || '';
  };

  return (
    <div className="property-characteristic-editor">
      <h4>Caractéristiques - {typeConfig.label}</h4>

      <div className="characteristics-grid">
        {features.map(key => {
          const inputType = getInputType(key);
          const value = characteristics[key];
          const label = getLabel(key);
          const unit = getUnit(key);

          return (
            <div key={key} className="characteristic-field">
              <label>{label}</label>

              {inputType === 'boolean' ? (
                <div className="boolean-toggle">
                  <button
                    type="button"
                    className={`toggle-btn ${value === true ? 'active' : ''}`}
                    onClick={() => handleCharacteristicChange(key, true)}
                  >
                    Oui
                  </button>
                  <button
                    type="button"
                    className={`toggle-btn ${value === false ? 'active' : ''}`}
                    onClick={() => handleCharacteristicChange(key, false)}
                  >
                    Non
                  </button>
                </div>
              ) : inputType === 'number' ? (
                <div className="number-input">
                  <input
                    type="number"
                    value={value || ''}
                    onChange={(e) => handleCharacteristicChange(key, e.target.value)}
                    placeholder="0"
                    step="0.1"
                  />
                  {unit && <span className="unit">{unit}</span>}
                </div>
              ) : (
                <input
                  type="text"
                  value={value || ''}
                  onChange={(e) => handleCharacteristicChange(key, e.target.value)}
                  placeholder={label}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Caractéristiques personnalisées (uniquement celles qui ne sont pas dans features) */}
      {Object.entries(characteristics).filter(([key]) =>
        !features.includes(key) &&
        key !== 'updated_at' &&
        key !== 'id' &&
        key !== 'titre' &&
        key !== 'type' &&
        key !== 'type_bien' &&
        key !== 'ville' &&
        key !== 'prix' &&
        key !== 'description' &&
        key !== 'statut' &&
        key !== 'image' &&
        key !== 'images' &&
        key !== 'created_at' &&
        key !== 'published_at' &&
        key !== 'reference' &&
        key !== 'caracteristiques'
      ).map(([key, value]) => {
        // Extraire la valeur réelle si c'est un objet { value, icon }
        let actualValue = value;
        let customIcon = null;

        if (typeof value === 'object' && value !== null) {
          actualValue = value.value;
          customIcon = value.icon;
        }

        return (
          <div key={key} className="characteristic-field custom">
            <label>{getLabel(key)}</label>
            <div className="custom-characteristic">
              <input
                type="text"
                value={actualValue || ''}
                onChange={(e) => handleCharacteristicChange(key, e.target.value)}
              />
              <button
                type="button"
                className="remove-custom-btn"
                onClick={() => handleRemoveCharacteristic(key)}
                title="Supprimer"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
        );
      })}

      <button
        type="button"
        className="add-custom-btn"
        onClick={() => setShowCustomForm(!showCustomForm)}
      >
        {showCustomForm ? '− Annuler' : '+ Ajouter une caractéristique'}
      </button>

      {showCustomForm && (
        <div className="custom-characteristic-form">
          <div className="field-row">
            <div className="field">
              <label>Nom de la caractéristique</label>
              <input
                type="text"
                value={customCharacteristic.name}
                onChange={(e) => setCustomCharacteristic({ ...customCharacteristic, name: e.target.value })}
                placeholder="Ex: Piscine, Distance plage..."
              />
            </div>
            <div className="field">
              <label>Valeur</label>
              <input
                type="text"
                value={customCharacteristic.value}
                onChange={(e) => setCustomCharacteristic({ ...customCharacteristic, value: e.target.value })}
                placeholder="Ex: Oui, 500 m, 3..."
              />
            </div>
          </div>
          <div className="field">
            <label>Icône (optionnel)</label>
            <select
              value={customCharacteristic.icon}
              onChange={(e) => setCustomCharacteristic({ ...customCharacteristic, icon: e.target.value })}
            >
              <option value="">Sans icône</option>
              {Object.entries(FEATURE_SVG_ICONS).map(([key, svg]) => (
                <option key={key} value={key}>{FEATURE_ICONS[key]?.label || key}</option>
              ))}
            </select>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-small"
            onClick={handleAddCustomCharacteristic}
          >
            Ajouter
          </button>
        </div>
      )}
    </div>
  );
};

export default PropertyCharacteristicEditor;
