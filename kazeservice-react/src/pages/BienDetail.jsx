import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { formatDateRelative, getAllFeaturesForType, FEATURE_ICONS, FEATURE_SVG_ICONS, shouldShowIcon, formatCharacteristicValue, formatPrice } from '../data/propertyTypes';
import { getPropertyById } from '../api/properties';
import { createAppointment } from '../api/appointments';
import { getPropertyImages, handleImageError } from '../utils/propertyImages';
import '../styles/style.css';
import WhatsAppFloat from '../components/WhatsAppFloat';

const BienDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isRdvModalOpen, setIsRdvModalOpen] = useState(false);
  const [rdvFormData, setRdvFormData] = useState({
    nom: '',
    email: '',
    motif: '',
    date: '',
    creneau: '',
    telephone: '',
    bien: '',
    message: ''
  });
  const [rdvFormMsg, setRdvFormMsg] = useState('');


  useEffect(() => {
    setLoading(true);
    getPropertyById(id).then((found) => {
      setProperty(found);
      setLoading(false);
    });
  }, [id]);

  // Réinitialiser l'index quand le bien change
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [property]);

  const images = getPropertyImages(property);
  const currentImage = images[currentImageIndex] || images[0];

  const goToPreviousImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  const openRdvModal = (bienTitre = '') => {
    setRdvFormData({ ...rdvFormData, bien: bienTitre });
    setIsRdvModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeRdvModal = () => {
    setIsRdvModalOpen(false);
    document.body.style.overflow = '';
  };

  const handleRdvFormChange = (e) => {
    setRdvFormData({
      ...rdvFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleRdvFormSubmit = async (e) => {
    e.preventDefault();
    setRdvFormMsg('Envoi en cours...');

    try {
      await createAppointment({
        nom: rdvFormData.nom,
        email: rdvFormData.email,
        motif: rdvFormData.motif,
        date: rdvFormData.date,
        creneau: rdvFormData.creneau,
        telephone: rdvFormData.telephone,
        bien_id: property?.id || null,
        message: `Bien concerné : ${rdvFormData.bien || property?.titre || '—'}\n${rdvFormData.message || ''}`,
      });
      setRdvFormMsg("Votre demande de rendez-vous a été envoyée avec succès. Un conseiller vous contactera bientôt.");
      setRdvFormData({
        nom: '',
        email: '',
        motif: '',
        date: '',
        creneau: '',
        telephone: '',
        bien: '',
        message: ''
      });
      setTimeout(closeRdvModal, 2000);
    } catch (error) {
      setRdvFormMsg("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isRdvModalOpen) {
        closeRdvModal();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isRdvModalOpen]);

  if (loading) {
    return (
      <div>
        <Header />
        <section className="section" id="content">
          <div className="container">
            <p style={{ color: 'var(--encre-douce)' }}>Chargement...</p>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div>
        <Header />
        <section className="section" id="content">
          <div className="container text-center" style={{ maxWidth: '480px' }}>
            <h1>Bien non trouvé</h1>
            <p style={{ color: 'var(--encre-douce)' }}>Le bien demandé n'existe pas ou a été supprimé.</p>
            <Link to="/nos-offres" className="btn btn-primary">Retour aux offres</Link>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header onRdvClick={openRdvModal} />

      <style>
        {`
          .detail-grid{ display:grid; grid-template-columns: 1.1fr .9fr; gap: 48px; align-items:start; }
          .detail-meta{ display:flex; gap: 12px; margin: 12px 0 16px; flex-wrap:wrap; }
          .detail-meta div{ background: var(--ivoire-carte); border:1px solid var(--ligne); border-radius: 8px; padding: 8px 12px; font-size:.75rem; }
          .detail-meta strong{ display:block; font-family:'Fraunces',serif; font-size:1rem; color:var(--brique); }
          @media (max-width: 900px){ .detail-grid{ grid-template-columns:1fr; } }

          /* Carrousel d'images */
          .property-image-carousel {
            position: relative;
          }

          .carousel-btn {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 44px;
            height: 44px;
            background: rgba(255, 255, 255, 0.9);
            border: 1px solid var(--ligne);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 10;
            transition: all 0.2s ease;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }

          .carousel-btn:hover {
            background: white;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }

          .carousel-btn-prev {
            left: 12px;
          }

          .carousel-btn-next {
            right: 12px;
          }

          .carousel-btn svg {
            width: 20px;
            height: 20px;
            color: var(--encre);
          }

          .carousel-dots {
            position: absolute;
            bottom: 16px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 8px;
            z-index: 10;
          }

          .carousel-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            border: 1px solid var(--ligne);
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .carousel-dot:hover {
            background: rgba(255, 255, 255, 0.8);
          }

          .carousel-dot.active {
            background: var(--brique);
            border-color: var(--brique);
            width: 12px;
            height: 12px;
          }

          @media (max-width: 768px) {
            .carousel-btn {
              width: 36px;
              height: 36px;
            }

            .carousel-btn-prev {
              left: 8px;
            }

            .carousel-btn-next {
              right: 8px;
            }

            .carousel-btn svg {
              width: 16px;
              height: 16px;
            }

            .carousel-dots {
              bottom: 12px;
              gap: 6px;
            }

            .carousel-dot {
              width: 8px;
              height: 8px;
            }

            .carousel-dot.active {
              width: 10px;
              height: 10px;
            }
          }
        `}
      </style>

      <section className="section" id="content">
        <div className="container">
          <p className="eyebrow"><Link to="/nos-offres#biens" style={{ color: 'var(--brique)' }}>← Retour aux offres</Link></p>
          <div className="detail-grid">
            <div>
              <div className="arch-frame small property-image-carousel">
                {images.length > 1 && (
                  <>
                    <button
                      className="carousel-btn carousel-btn-prev"
                      onClick={goToPreviousImage}
                      aria-label="Image précédente"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                      </svg>
                    </button>
                    <button
                      className="carousel-btn carousel-btn-next"
                      onClick={goToNextImage}
                      aria-label="Image suivante"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </button>
                  </>
                )}
                <img
                  src={currentImage}
                  alt={property.titre}
                  onError={handleImageError}
                />
                {images.length > 1 && (
                  <div className="carousel-dots">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        className={`carousel-dot ${index === currentImageIndex ? 'active' : ''}`}
                        onClick={() => goToImage(index)}
                        aria-label={`Aller à l'image ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div>
              <span className={`tag ${property.type}`} style={{ position: 'static', display: 'inline-block', marginBottom: '14px' }}>
                {property.type === 'vente' ? 'Vente' : 'Location'}
              </span>
              {property.reference && <p style={{ fontSize: '0.85rem', color: 'var(--encre-douce)', marginBottom: '8px' }}><code>{property.reference}</code></p>}
              <h1>{property.titre}</h1>
              <p style={{ color: 'var(--encre-douce)' }}>{property.ville}</p>

              {/* Affichage de toutes les caractéristiques selon le type de bien */}
              <div className="detail-meta">
                {(() => {
                  const type = property.type_bien || 'maison';
                  const allFeatures = getAllFeaturesForType(type);

                  // Afficher les caractéristiques prédéfinies
                  const predefinedFeatures = allFeatures.filter(key => key !== 'updated_at').map(key => {
                    // Gérer les caractéristiques personnalisées avec structure { value, icon }
                    let actualValue = property[key];
                    let customIcon = null;

                    if (typeof actualValue === 'object' && actualValue !== null) {
                      customIcon = actualValue.icon;
                      actualValue = actualValue.value;
                    }

                    if (actualValue === undefined || actualValue === null || actualValue === '' || actualValue === false) return null;

                    const iconConfig = FEATURE_ICONS[key];
                    const label = iconConfig ? iconConfig.label : key;
                    const showIcon = shouldShowIcon(key, actualValue);
                    const svgIcon = customIcon ? FEATURE_SVG_ICONS[customIcon] : FEATURE_SVG_ICONS[key];
                    const formattedValue = formatCharacteristicValue(key, actualValue);

                    return (
                      <div key={key}>
                        <strong>
                          {showIcon && svgIcon && (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px', color: 'var(--brique)', verticalAlign: 'middle', marginRight: '4px' }} dangerouslySetInnerHTML={{ __html: svgIcon }} />
                          )}
                          {formattedValue}
                        </strong> {label}
                      </div>
                    );
                  });

                  // Afficher les caractéristiques personnalisées (celles qui ne sont pas dans allFeatures)
                  const customFeatures = Object.entries(property).filter(([key]) => !allFeatures.includes(key) && key !== 'id' && key !== 'titre' && key !== 'type' && key !== 'type_bien' && key !== 'ville' && key !== 'prix' && key !== 'description' && key !== 'statut' && key !== 'image' && key !== 'images' && key !== 'created_at' && key !== 'published_at' && key !== 'reference' && key !== 'updated_at').map(([key, value]) => {
                    // Gérer les caractéristiques personnalisées avec structure { value, icon }
                    let actualValue = value;
                    let customIcon = null;

                    if (typeof actualValue === 'object' && actualValue !== null) {
                      customIcon = actualValue.icon;
                      actualValue = actualValue.value;
                    }

                    if (actualValue === undefined || actualValue === null || actualValue === '' || actualValue === false) return null;

                    // Label pour caractéristique personnalisée
                    const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                    const showIcon = shouldShowIcon(key, actualValue);
                    const svgIcon = customIcon ? FEATURE_SVG_ICONS[customIcon] : null;
                    const formattedValue = formatCharacteristicValue(key, actualValue);

                    return (
                      <div key={key}>
                        <strong>
                          {showIcon && svgIcon && (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px', color: 'var(--brique)', verticalAlign: 'middle', marginRight: '4px' }} dangerouslySetInnerHTML={{ __html: svgIcon }} />
                          )}
                          {formattedValue}
                        </strong> {label}
                      </div>
                    );
                  });

                  return [...predefinedFeatures, ...customFeatures];
                })()}
              </div>

              <div className="price" style={{ fontSize: '1.5rem', marginBottom: '20px' }}>{formatPrice(property.prix)}</div>
              {property.description && <p>{property.description}</p>}
              <div className="hero-actions" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '24px' }}>
                <button className="btn btn-primary" onClick={() => openRdvModal(property.titre)} style={{ flex: '1', minWidth: 'clamp(140px, 30vw, 180px)' }}>Prendre rendez-vous</button>
                <Link to="/contact#agencies" className="btn btn-outline" style={{ flex: '1', minWidth: 'clamp(140px, 30vw, 180px)' }}>Poser une question</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {isRdvModalOpen && (
        <div className="modal-overlay active" id="rdvModal" onClick={(e) => { if (e.target.id === 'rdvModal') closeRdvModal(); }}>
          <div className="modal-content">
            <button className="modal-close" id="closeRdvModal" onClick={closeRdvModal}>✕</button>
            <h2>Prendre rendez-vous</h2>
            <p>Remplissez le formulaire ci-dessous pour prendre rendez-vous avec nos conseillers</p>
            <form id="rdvForm" onSubmit={handleRdvFormSubmit}>
              <div className="field">
                <label>Nom complet</label>
                <input type="text" name="nom" required value={rdvFormData.nom} onChange={handleRdvFormChange} />
              </div>
              <div className="field">
                <label>Email</label>
                <input type="email" name="email" required value={rdvFormData.email} onChange={handleRdvFormChange} />
              </div>
              <div className="field">
                <label>Motif</label>
                <select name="motif" required value={rdvFormData.motif} onChange={handleRdvFormChange}>
                  <option value="">Sélectionnez un motif</option>
                  <option>Visite d'un bien</option>
                  <option>Conseil en investissement</option>
                  <option>Estimation de bien</option>
                  <option>Gestion locative</option>
                  <option>Architecture / Construction</option>
                  <option>Formation immobilière</option>
                  <option>Autre demande</option>
                </select>
              </div>
              <div className="field-row">
                <div className="field">
                  <label>Date souhaitée</label>
                  <input type="date" name="date" required value={rdvFormData.date} onChange={handleRdvFormChange} />
                </div>
                <div className="field">
                  <label>Créneau horaire</label>
                  <select name="creneau" required value={rdvFormData.creneau} onChange={handleRdvFormChange}>
                    <option value="">Sélectionnez un créneau</option>
                    <option>Matin (9h-12h)</option>
                    <option>Après-midi (14h-17h)</option>
                    <option>Soirée (17h-19h)</option>
                  </select>
                </div>
              </div>
              <div className="field">
                <label>Téléphone</label>
                <input type="tel" name="telephone" required value={rdvFormData.telephone} onChange={handleRdvFormChange} />
              </div>
              <div className="field">
                <label>Bien concerné</label>
                <input type="text" name="bien" value={rdvFormData.bien} onChange={handleRdvFormChange} placeholder="Référence ou adresse du bien" />
              </div>
              <div className="field">
                <label>Message (optionnel)</label>
                <textarea name="message" placeholder="Précisez votre besoin si vous le souhaitez." value={rdvFormData.message} onChange={handleRdvFormChange}></textarea>
              </div>
              <button type="submit" className="btn btn-primary block">Envoyer ma demande</button>
              <p className="form-msg">{rdvFormMsg}</p>
            </form>
          </div>
        </div>
      )}

      <WhatsAppFloat />
    </div>
  );
};

export default BienDetail;
