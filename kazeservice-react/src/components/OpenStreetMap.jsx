import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix pour les icônes Leaflet par défaut
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const OpenStreetMap = ({ latitude, longitude, zoom = 15, height = '300px' }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [isMapActive, setIsMapActive] = useState(false);
  const [showMapsButton, setShowMapsButton] = useState(false);
  const buttonTimeoutRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || !latitude || !longitude) return;

    // Initialiser la carte si elle n'existe pas encore
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current, {
        scrollWheelZoom: false, // Désactiver le zoom par molette par défaut
        doubleClickZoom: true   // Garder le zoom par double-clic activé
      }).setView([latitude, longitude], zoom);

      // Tuiles OpenStreetMap standard (gratuites, sans clé API)
      // L'attribution est obligatoire selon la politique d'utilisation d'OSM
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(mapInstanceRef.current);

      // Ajouter un marqueur
      L.marker([latitude, longitude]).addTo(mapInstanceRef.current);

      // Activer le zoom et afficher le bouton après clic sur la carte
      mapInstanceRef.current.on('click', () => {
        if (!isMapActive) {
          setIsMapActive(true);
          mapInstanceRef.current.scrollWheelZoom.enable();
        }

        // Afficher le bouton
        setShowMapsButton(true);

        // Réinitialiser le timer si existant
        if (buttonTimeoutRef.current) {
          clearTimeout(buttonTimeoutRef.current);
        }

        // Faire disparaître le bouton après 4 secondes
        buttonTimeoutRef.current = setTimeout(() => {
          setShowMapsButton(false);
        }, 4000);
      });
    } else {
      // Si la carte existe déjà, mettre à jour la vue
      mapInstanceRef.current.setView([latitude, longitude], zoom);

      // Mettre à jour le marqueur
      mapInstanceRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          layer.setLatLng([latitude, longitude]);
        }
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      if (buttonTimeoutRef.current) {
        clearTimeout(buttonTimeoutRef.current);
      }
    };
  }, [latitude, longitude, zoom, isMapActive]);

  const openInMaps = () => {
    if (latitude && longitude) {
      // Ouvrir dans Google Maps ou l'application de carte par défaut
      window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_blank');
    }
  };

  if (!latitude || !longitude) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
        <p style={{ color: '#666', fontSize: '0.9rem' }}>Coordonnées non disponibles</p>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div
        ref={mapRef}
        style={{ height, width: '100%', borderRadius: '8px', zIndex: 1, cursor: isMapActive ? 'grab' : 'pointer' }}
        title={isMapActive ? 'Carte active - zoom activé' : 'Cliquez pour activer le zoom'}
      />
      {showMapsButton && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            openInMaps();
          }}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 12px',
            fontSize: '0.8rem',
            fontWeight: '500',
            color: '#0d3f63',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            zIndex: 10,
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            opacity: '0.95'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f8f8'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#ffffff'}
        >
          Ouvrir dans Maps
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </button>
      )}
    </div>
  );
};

export default OpenStreetMap;
