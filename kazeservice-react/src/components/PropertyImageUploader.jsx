import { useState, useEffect, useRef } from 'react';
import './PropertyImageUploader.css';
import { convertImageUrl } from '../utils/propertyImages';

const PropertyImageUploader = ({ images = [], onChange, existingImages = [], newImages = [] }) => {
  const [dragActive, setDragActive] = useState(false);
  const [localAllImages, setLocalAllImages] = useState([...existingImages, ...newImages]);
  const isInternalChange = useRef(false);

  // Synchroniser avec les props mais seulement si pas en cours de mouvement
  useEffect(() => {
    if (!isInternalChange.current) {
      setLocalAllImages([...existingImages, ...newImages]);
    }
    isInternalChange.current = false;
  }, [existingImages, newImages]);

  // Utiliser l'état local pour l'affichage
  const allImages = localAllImages;

  // Séparer les images en existing et new pour le parent
  const separateImages = (images) => {
    const existing = [];
    const previews = [];
    images.forEach(img => {
      if (img && typeof img === 'object' && img.file) {
        previews.push(img);
      } else if (typeof img === 'string') {
        existing.push(img);
      } else {
        previews.push(img);
      }
    });
    return { existing, previews };
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files).filter(file =>
      file.type.startsWith('image/')
    );

    if (files.length > 0) {
      processFiles(files);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      processFiles(files);
    }
  };

  const processFiles = (files) => {
    const promises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({ file, preview: reader.result });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then((newPreviews) => {
      onChange(existingImages, [...newImages, ...newPreviews]);
    });
  };

  const removeImage = (index) => {
    const newAllImages = [...allImages];
    newAllImages.splice(index, 1);
    const { existing, previews } = separateImages(newAllImages);
    isInternalChange.current = true;
    setLocalAllImages(newAllImages);
    onChange(existing, previews);
  };

  const moveImage = (fromIndex, toIndex) => {
    const newAllImages = [...allImages];
    const [movedImage] = newAllImages.splice(fromIndex, 1);
    newAllImages.splice(toIndex, 0, movedImage);
    const { existing, previews } = separateImages(newAllImages);
    isInternalChange.current = true;
    setLocalAllImages(newAllImages);
    onChange(existing, previews);
  };

  const moveLeft = (index) => {
    if (index > 0) {
      moveImage(index, index - 1);
    }
  };

  const moveRight = (index) => {
    if (index < allImages.length - 1) {
      moveImage(index, index + 1);
    }
  };

  const setMainImage = (index) => {
    if (index > 0) {
      moveImage(index, 0);
    }
  };

  const isExistingImage = (img) => {
    return typeof img === 'string';
  };

  return (
    <div className="property-image-uploader">
      <div className="image-upload-zone">
        <input
          type="file"
          id="image-upload"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        <label
          htmlFor="image-upload"
          className={`upload-dropzone ${dragActive ? 'active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
          <span>Choisir les images</span>
          <span className="upload-hint">ou glisser-déposer ici</span>
        </label>
      </div>

      {allImages.length > 0 && (
        <div className="image-previews">
          <p className="image-count">
            {allImages.length} image{allImages.length > 1 ? 's' : ''}
            {allImages.length > 0 && ' (la première est la photo principale)'}
          </p>
          <div className="image-grid">
            {allImages.map((img, index) => {
              const isExisting = typeof img === 'string';
              const displaySrc = isExisting ? convertImageUrl(img) : img.preview;

              return (
                <div key={index} className={`image-preview-item ${index === 0 ? 'main' : ''}`}>
                  <img src={displaySrc} alt={`Aperçu ${index + 1}`} />
                  <div className="image-actions">
                    <button
                      type="button"
                      className="image-action-btn move-left"
                      onClick={() => moveLeft(index)}
                      disabled={index === 0}
                      title="Déplacer à gauche"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="image-action-btn move-right"
                      onClick={() => moveRight(index)}
                      disabled={index === allImages.length - 1}
                      title="Déplacer à droite"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="image-action-btn set-main"
                      onClick={() => setMainImage(index)}
                      disabled={index === 0}
                      title="Définir comme image principale"
                    >
                      <svg viewBox="0 0 24 24" fill={index === 0 ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="image-action-btn delete"
                      onClick={() => removeImage(index, isExisting)}
                      title="Supprimer"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                  {index === 0 && <span className="main-badge">Principale</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyImageUploader;
