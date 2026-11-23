import { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import '../styles/style.css';
import { createAppointment } from '../api/appointments';
import { getFormations } from '../api/formations';
import WhatsAppFloat from '../components/WhatsAppFloat';
import { normalizeFormationImageUrl } from '../utils/imageUtils';


const Formations = () => {
  const [isRdvModalOpen, setIsRdvModalOpen] = useState(false);
  const [rdvFormData, setRdvFormData] = useState({
    nom: '',
    email: '',
    motif: 'Formation immobilière',
    date: '',
    creneau: '',
    telephone: '',
    message: ''
  });
  const [rdvFormMsg, setRdvFormMsg] = useState('');
  const [sectionsAnimated, setSectionsAnimated] = useState(false);

  const [formations, setFormations] = useState([]);
  const formationsRef = useRef(null);

  useEffect(() => {
    getFormations().then((data) => {
      const publishedFormations = data.filter(formation => formation.publie === true);
      setFormations(publishedFormations);
    });
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#formations' && formationsRef.current) {
        setTimeout(() => {
          const headerHeight = 80;
          const elementPosition = formationsRef.current.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }, 200);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);


  const openRdvModal = () => {
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
        message: `Bien concerné : ${rdvFormData.bien || '—'}\n${rdvFormData.message || ''}`,
      });
      setRdvFormMsg("Votre demande de rendez-vous a été envoyée avec succès. Un conseiller vous contactera bientôt.");
      setRdvFormData({
        nom: '',
        email: '',
        motif: '',
        date: '',
        creneau: '',
        telephone: '',
        message: ''
      });
      setTimeout(closeRdvModal, 2000);
    } catch (error) {
      setRdvFormMsg("L'envoi a échoué. Vérifiez votre connexion et réessayez, ou contactez-nous directement par téléphone.");
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

  // Animation des sections reveal
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    const revealSections = document.querySelectorAll('.reveal');
    revealSections.forEach(section => observer.observe(section));

    return () => {
      revealSections.forEach(section => observer.unobserve(section));
    };
  }, []);

  return (
    <div>
      <Header onRdvClick={openRdvModal} />

      {/* HERO FORMATIONS */}
      <section className="hero-section" style={{ backgroundImage: "url('/formation.png')" }}>
        <div className="hero-background" style={{ backgroundImage: "url('/formation.png')" }}></div>
        <div className="unified-hero-overlay"></div>
        <div className="hero-content-wrapper">
          <p className="hero-eyebrow">Nos Formations</p>
          <h1 className="hero-title">Formations Immobilières Professionnelles</h1>
          <p className="hero-subtitle">Devenez expert en immobilier grâce à nos formations de qualité</p>
          <div className="hero-buttons">
            <a href="#formations" className="btn btn-primary btn-large">Découvrir nos formations</a>
            <Link to="/contact" className="btn btn-secondary btn-large">Nous contacter</Link>
          </div>
        </div>
      </section>

      {/* SECTION INTRODUCTION */}
      <section className="section reveal" style={{ paddingBottom: '60px' }}>
        <div className="container">
          <div className="section-head" style={{ marginBottom: '32px' }}>
            <p className="eyebrow">Pourquoi nous choisir</p>
            <h2>Une formation adaptée à vos besoins</h2>
            <p>Nos formations sont conçues par des experts du secteur immobilier pour vous offrir les compétences pratiques nécessaires à votre réussite.</p>
          </div>
          <div className="advantages-grid">
            <div className="advantage-card">
              <div className="advantage-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
              </div>
              <h3>Expertise reconnue</h3>
              <p>Des formateurs avec plus de 15 ans d'expérience dans le secteur immobilier.</p>
            </div>
            <div className="advantage-card">
              <div className="advantage-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <h3>Accompagnement personnalisé</h3>
              <p>Un suivi individuel pour répondre à vos questions spécifiques.</p>
            </div>
            <div className="advantage-card">
              <div className="advantage-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M9 14h6"></path><path d="M9 10h6"></path><path d="M9 18h6"></path></svg>
              </div>
              <h3>Approche pratique</h3>
              <p>Des études de cas réels et des mises en situation concrètes.</p>
            </div>
            <div className="advantage-card">
              <div className="advantage-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
              <h3>Compétences certifiantes</h3>
              <p>Des formations reconnues qui valorisent votre profil professionnel.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION LISTE DES FORMATIONS */}
      <section className="section tinted reveal" id="formations" ref={formationsRef} style={{ paddingTop: '60px', paddingBottom: '60px' }}>
        <div className="container">
          <div className="section-head" style={{ marginBottom: '32px' }}>
            <p className="eyebrow">Nos programmes</p>
            <h2>Nos formations disponibles</h2>
            <p>Découvrez nos différentes formations pour développer vos compétences immobilières.</p>
          </div>
          <div className="properties-grid" id="formationsGrid">
            {formations.length > 0 ? (
              formations.map((formation, index) => (
                <div key={index} className="property-card-modern">
                <div className="property-card-gallery">
                  <div className="property-card-images">
                    <img
                      src={normalizeFormationImageUrl(formation.image)}
                      alt={formation.titre}
                      className="property-card-img active"
                      loading="lazy"
                      onError={(e) => { e.target.onerror = null; e.target.src = normalizeFormationImageUrl(null); }}
                    />
                  </div>
                  <span className="property-card-badge">Formation</span>
                </div>
                <div className="property-card-content">
                  <div className="property-card-price">{formation.prix}</div>
                  <h3 className="property-card-title">{formation.titre}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--encre-douce)', marginBottom: '8px', lineHeight: '1.4' }}>
                    {formation.description_courte || formation.description}
                  </p>
                  <div className="property-card-location">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    {formation.niveau}
                  </div>
                  <div className="property-card-features">
                    <span className="feature">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      {formation.duree}
                    </span>
                    <span className="feature">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                      </svg>
                      {formation.format}
                    </span>
                    {formation.certification && (
                      <span className="feature">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                        </svg>
                        {formation.certification}
                      </span>
                    )}
                    {formation.places_disponibles && formation.places_disponibles > 0 && (

                      <span className="feature">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        {formation.places_disponibles} places
                      </span>
                    )}
                  </div>
                  {formation.date_debut && (
                    <div className="property-card-footer" style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #eee' }}>
                      <span className="property-card-date">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px', marginRight: '4px' }}>
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        Début: {new Date(formation.date_debut).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                  )}
                  <div className="property-card-footer">
                    <Link to={`/formation/${formation.slug}`} className="btn btn-primary">Voir les détails</Link>
                  </div>
                </div>
              </div>
              ))
            ) : (
              <div className="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <h3>Aucune formation disponible</h3>
                <p>Nous mettrons à jour cette section avec nos formations prochainement</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />

      {/* Modale de rendez-vous */}
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
                <label>Message (optionnel)</label>
                <textarea name="message" placeholder="Précisez vos questions si vous le souhaitez." value={rdvFormData.message} onChange={handleRdvFormChange}></textarea>
              </div>
              <button type="submit" className="btn btn-primary btn-block">Envoyer ma demande</button>
              <div className="form-msg" id="rdvFormMsg">{rdvFormMsg}</div>
            </form>
          </div>
        </div>
      )}

      <WhatsAppFloat />
    </div>
  );
};

export default Formations;
