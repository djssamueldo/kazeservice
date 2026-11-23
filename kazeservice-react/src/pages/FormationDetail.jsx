import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/style.css';
import { getFormationBySlug } from '../api/formations';
import { createAppointment } from '../api/appointments';
import { submitMessage } from '../api/messages';
import WhatsAppFloat from '../components/WhatsAppFloat';
import { normalizeFormationImageUrl } from '../utils/imageUtils';

const FormationDetail = () => {
  const { slug } = useParams();
  const [formation, setFormation] = useState(null);
  const [loading, setLoading] = useState(true);
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
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showReadMore, setShowReadMore] = useState(true);
  const [infoFormData, setInfoFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    formation: '',
    message: ''
  });
  const [sectionsAnimated, setSectionsAnimated] = useState(false);
  const [infoFormMsg, setInfoFormMsg] = useState('');

  // Helper pour parser les champs qui peuvent être des chaînes JSON ou des tableaux
  const parseArray = (value) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return [];
      }
    }
    return [];
  };


  useEffect(() => {
    setLoading(true);
    getFormationBySlug(slug).then((found) => {
      if (found && found.publie === true) {
        setFormation(found);
      } else {
        setFormation(null);
      }
      setLoading(false);
    });
  }, [slug]);

  useEffect(() => {
    if (formation) {
      setInfoFormData({ ...infoFormData, formation: formation.titre });
      const description = formation.description || '';
      const fullHeight = description.length * 0.5;
      const maxHeight = 60;
      setShowReadMore(fullHeight > maxHeight);
    }
  }, [formation]);

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
        motif: rdvFormData.motif || `Formation : ${formation?.titre || '—'}`,
        date: rdvFormData.date,
        creneau: rdvFormData.creneau,
        telephone: rdvFormData.telephone,
        message: rdvFormData.message || '',
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
      setRdvFormMsg("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  const handleInfoFormChange = (e) => {
    setInfoFormData({
      ...infoFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleInfoFormSubmit = async (e) => {
    e.preventDefault();
    setInfoFormMsg('Envoi en cours...');

    try {
      await submitMessage('formation', {
        nom: infoFormData.nom,
        email: infoFormData.email,
        telephone: infoFormData.telephone,
        message: `Formation : ${infoFormData.formation || formation?.titre || '—'}\n${infoFormData.message || ''}`,
      });
      setInfoFormMsg("Votre demande a été envoyée avec succès. Nous vous contacterons bientôt.");
      setInfoFormData({
        nom: '',
        email: '',
        telephone: '',
        formation: formation?.titre || '',
        message: ''
      });
    } catch (error) {
      setInfoFormMsg("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
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
  }, [formation]);

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

  if (!formation) {
    return (
      <div>
        <Header />
        <section className="section" id="content">
          <div className="container text-center" style={{ maxWidth: '480px' }}>
            <h1>Formation non trouvée</h1>
            <p style={{ color: 'var(--encre-douce)' }}>La formation demandée n'existe pas ou a été supprimée.</p>
            <Link to="/formations" className="btn btn-primary">Retour aux formations</Link>
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
          .formation-hero-grid {
            display: grid;
            grid-template-columns: 65fr 35fr;
            gap: 32px;
            align-items: start;
          }
          .formation-info-block {}
          .formation-form-block {
            background: #fff;
            padding: 18px;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            position: sticky;
            top: 20px;
          }
          .formation-info-grid {
            grid-template-columns: 1fr 1fr 1fr !important;
          }
          @media (max-width: 1024px) {
            .formation-hero-grid {
              grid-template-columns: 1fr;
              gap: 24px;
            }
            .formation-form-block {
              padding: 16px;
              position: static;
            }
            .formation-info-grid {
              grid-template-columns: 1fr 1fr !important;
            }
          }
          @media (max-width: 768px) {
            .formation-hero-grid {
              grid-template-columns: 1fr;
              gap: 24px;
            }
            .formation-form-block {
              padding: 16px;
              position: static;
            }
            .formation-info-grid {
              grid-template-columns: 1fr !important;
            }
            h1 {
              font-size: 1.8rem !important;
            }
          }
        `}
      </style>

      <section className="section" style={{ paddingTop: '80px', paddingBottom: '20px' }}>
        <div className="container" style={{ paddingTop: '5px', paddingBottom: '20px' }}>
          <p className="eyebrow" style={{ marginBottom: '12px' }}><Link to="/formations#formations" style={{ color: 'var(--brique)', textDecoration: 'none', fontWeight: '500' }}>← Retour aux formations</Link></p>
          <div className="formation-hero-grid">
            <div className="formation-info-block">
              <h1 style={{ marginBottom: '6px', fontSize: '1.8rem', lineHeight: '1.2', fontWeight: '700', letterSpacing: '-0.02em', color: 'var(--encre)' }}>{formation.titre}</h1>
              {formation.description_courte && (
                <p style={{ color: 'var(--encre-douce)', marginBottom: '12px', fontSize: '0.95rem', lineHeight: '1.5', fontWeight: '400', fontStyle: 'italic' }}>{formation.description_courte}</p>
              )}

              <div style={{ borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '12px' }}>
                <img
                  src={normalizeFormationImageUrl(formation.image)}
                  alt={formation.titre}
                  onError={(e) => { e.target.onerror = null; e.target.src = normalizeFormationImageUrl(null); }}
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                />
              </div>

              <div className="formation-info-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '8px', marginBottom: '12px' }}>
                <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: '6px', padding: '6px 8px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '6px', height: '50px' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px', color: 'var(--brique)', flexShrink: 0 }}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.55rem', color: 'var(--encre-douce)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1px', fontWeight: '500' }}>Durée</div>
                    <div style={{ fontWeight: '600', color: 'var(--encre)', fontSize: '0.75rem', lineHeight: '1.2' }}>{formation.duree}</div>
                  </div>
                </div>
                <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: '6px', padding: '6px 8px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '6px', height: '50px' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px', color: 'var(--brique)', flexShrink: 0 }}><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.55rem', color: 'var(--encre-douce)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1px', fontWeight: '500' }}>Prix</div>
                    <div style={{ fontWeight: '600', color: 'var(--encre)', fontSize: '0.75rem', lineHeight: '1.2' }}>{formation.prix}</div>
                  </div>
                </div>
                <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: '6px', padding: '6px 8px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '6px', height: '50px' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px', color: 'var(--brique)', flexShrink: 0 }}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.55rem', color: 'var(--encre-douce)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1px', fontWeight: '500' }}>Niveau</div>
                    <div style={{ fontWeight: '600', color: 'var(--encre)', fontSize: '0.75rem', lineHeight: '1.2' }}>{formation.niveau}</div>
                  </div>
                </div>
                <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: '6px', padding: '6px 8px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '6px', height: '50px' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px', color: 'var(--brique)', flexShrink: 0 }}><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.55rem', color: 'var(--encre-douce)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1px', fontWeight: '500' }}>Format</div>
                    <div style={{ fontWeight: '600', color: 'var(--encre)', fontSize: '0.75rem', lineHeight: '1.2' }}>{formation.format}</div>
                  </div>
                </div>
                <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: '6px', padding: '6px 8px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '6px', height: '50px' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px', color: 'var(--brique)', flexShrink: 0 }}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.55rem', color: 'var(--encre-douce)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1px', fontWeight: '500' }}>Langue</div>
                    <div style={{ fontWeight: '600', color: 'var(--encre)', fontSize: '0.75rem', lineHeight: '1.2' }}>{formation.langue}</div>
                  </div>
                </div>
                {formation.certification && (
                  <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: '6px', padding: '6px 8px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '6px', height: '50px' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px', color: 'var(--brique)', flexShrink: 0 }}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.55rem', color: 'var(--encre-douce)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1px', fontWeight: '500' }}>Certification</div>
                      <div style={{ fontWeight: '600', color: 'var(--encre)', fontSize: '0.75rem', lineHeight: '1.2' }}>{formation.certification}</div>
                    </div>
                  </div>
                )}
                {formation.places_disponibles && formation.places_disponibles > 0 && (

                  <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: '6px', padding: '6px 8px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '6px', height: '50px' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px', color: 'var(--brique)', flexShrink: 0 }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.55rem', color: 'var(--encre-douce)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1px', fontWeight: '500' }}>Places</div>
                      <div style={{ fontWeight: '600', color: 'var(--encre)', fontSize: '0.75rem', lineHeight: '1.2' }}>{formation.places_disponibles} disponibles</div>
                    </div>
                  </div>
                )}
                {formation.date_debut && (
                  <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: '6px', padding: '6px 8px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '6px', height: '50px' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px', color: 'var(--brique)', flexShrink: 0 }}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.55rem', color: 'var(--encre-douce)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1px', fontWeight: '500' }}>Date de début</div>
                      <div style={{ fontWeight: '600', color: 'var(--encre)', fontSize: '0.75rem', lineHeight: '1.2' }}>{formation.date_debut ? new Date(formation.date_debut).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}</div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <p style={{ color: 'var(--encre-douce)', lineHeight: '1.5', marginBottom: '6px', fontSize: '0.85rem', display: !showFullDescription ? 'block' : 'none', maxHeight: '3.6em', overflow: 'hidden' }}>{formation.description ? formation.description.substring(0, 150) : ''}...</p>
                <p style={{ color: 'var(--encre-douce)', lineHeight: '1.5', marginBottom: '6px', display: showFullDescription ? 'block' : 'none', fontSize: '0.85rem' }}>{formation.description || ''}</p>
                {showReadMore && <button onClick={toggleDescription} style={{ background: 'none', border: 'none', color: 'var(--brique)', fontWeight: '600', cursor: 'pointer', padding: 0, fontSize: '0.75rem' }}>{showFullDescription ? 'Lire moins' : 'Lire plus'}</button>}
              </div>
            </div>

            <div className="formation-form-block">
              <h3 style={{ marginBottom: '4px', fontSize: '1rem' }}>Demander des informations</h3>
              <p style={{ color: 'var(--encre-douce)', marginBottom: '12px', fontSize: '0.75rem' }}>Remplissez ce formulaire pour recevoir plus d'informations sur cette formation</p>
              <form onSubmit={handleInfoFormSubmit}>
                <div className="field" style={{ marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.75rem', marginBottom: '2px' }}>Nom complet</label>
                  <input type="text" name="nom" required style={{ padding: '6px 10px', fontSize: '0.8rem' }} value={infoFormData.nom} onChange={handleInfoFormChange} />
                </div>
                <div className="field" style={{ marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.75rem', marginBottom: '2px' }}>Email</label>
                  <input type="email" name="email" required style={{ padding: '6px 10px', fontSize: '0.8rem' }} value={infoFormData.email} onChange={handleInfoFormChange} />
                </div>
                <div className="field" style={{ marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.75rem', marginBottom: '2px' }}>Téléphone</label>
                  <input type="tel" name="telephone" required style={{ padding: '6px 10px', fontSize: '0.8rem' }} value={infoFormData.telephone} onChange={handleInfoFormChange} />
                </div>
                <div className="field" style={{ marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.75rem', marginBottom: '2px' }}>Formation</label>
                  <input type="text" name="formation" value={formation.titre} readOnly style={{ padding: '6px 10px', fontSize: '0.8rem' }} />
                </div>
                <div className="field" style={{ marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.75rem', marginBottom: '2px' }}>Message (optionnel)</label>
                  <textarea name="message" placeholder="Précisez vos questions si vous le souhaitez." style={{ padding: '6px 10px', fontSize: '0.8rem', minHeight: '50px' }} value={infoFormData.message} onChange={handleInfoFormChange}></textarea>
                </div>
                <button type="submit" className="btn btn-primary btn-block" style={{ padding: '8px 14px', fontSize: '0.8rem' }}>Envoyer ma demande</button>
                <div className="form-msg">{infoFormMsg}</div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {parseArray(formation.prerequis).length > 0 && (
        <section className="section reveal" style={{ paddingTop: '20px', paddingBottom: '20px' }}>
          <div className="container">
            <div className="section-head" style={{ marginBottom: '16px' }}>
              <p className="eyebrow">Prérequis</p>
              <h2 style={{ fontSize: '1.4rem' }}>Prérequis de la formation</h2>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {parseArray(formation.prerequis).map((prereq, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--encre)', background: 'var(--ivoire-carte)', padding: '8px 14px', borderRadius: '8px', flex: '1 1 auto', minWidth: '150px' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px', color: 'var(--brique)', flexShrink: 0 }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  <span style={{ fontWeight: '500' }}>{prereq}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section reveal" style={{ paddingTop: '20px', paddingBottom: '20px' }}>
        <div className="container">
          <div className="section-head" style={{ marginBottom: '16px' }}>
            <p className="eyebrow">Programme</p>
            <h2 style={{ fontSize: '1.4rem' }}>Programme de la formation</h2>
          </div>
          <div className="properties-grid" style={{ gap: '12px' }}>
            {parseArray(formation.programme).map((item, i) => (
              <div key={i} style={{ background: 'var(--ivoire-carte)', padding: '14px 18px', borderRadius: 'var(--rayon-arche)', display: 'flex', alignItems: 'center', gap: '12px', transition: 'transform 0.2s ease' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <span style={{ width: '28px', height: '28px', background: 'var(--brique)', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', flexShrink: 0, fontSize: '0.85rem' }}>{i + 1}</span>
                <span style={{ fontSize: '0.9rem', color: 'var(--encre)', fontWeight: '500', lineHeight: '1.4' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section reveal" style={{ paddingTop: '20px', paddingBottom: '20px' }}>
        <div className="container">
          <div className="section-head" style={{ marginBottom: '16px' }}>
            <p className="eyebrow">Objectifs</p>
            <h2 style={{ fontSize: '1.4rem' }}>Objectifs pédagogiques</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>
            {parseArray(formation.objectifs).map((obj, i) => (
              <div key={i} style={{
                background: 'var(--ivoire-carte)',
                borderRadius: '12px',
                padding: '16px 18px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                border: '1px solid rgba(0,0,0,0.05)'
              }} onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.12)';
                e.currentTarget.style.borderColor = 'var(--brique)';
              }} onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.05)';
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  background: 'var(--brique)',
                  color: '#fff',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  flexShrink: 0,
                  fontSize: '1rem',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '0.9rem', marginBottom: '4px', fontWeight: '600', color: 'var(--encre)' }}>{obj.split(':')[0] || obj}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--encre-douce)', margin: 0, lineHeight: '1.5' }}>{obj.split(':')[1] || ''}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section reveal" style={{ paddingTop: '20px', paddingBottom: '20px' }}>
        <div className="container">
          <div className="section-head" style={{ marginBottom: '16px' }}>
            <p className="eyebrow">Public cible</p>
            <h2 style={{ fontSize: '1.4rem' }}>À qui s'adresse cette formation</h2>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {parseArray(formation.public_cible).map((person, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--encre)', background: 'var(--ivoire-carte)', padding: '8px 14px', borderRadius: '8px', flex: '1 1 auto', minWidth: '150px' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px', color: 'var(--brique)', flexShrink: 0 }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                <span style={{ fontWeight: '500' }}>{person}</span>
              </div>
            ))}
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
                <label>Message (optionnel)</label>
                <textarea name="message" placeholder="Précisez vos questions si vous le souhaitez." value={rdvFormData.message} onChange={handleRdvFormChange}></textarea>
              </div>
              <button type="submit" className="btn btn-primary btn-block">Envoyer ma demande</button>
              <div className="form-msg">{rdvFormMsg}</div>
            </form>
          </div>
        </div>
      )}

      <WhatsAppFloat />
    </div>
  );
};

export default FormationDetail;
