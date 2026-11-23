import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import OpenStreetMap from '../components/OpenStreetMap';
import '../styles/style.css';
import { createAppointment } from '../api/appointments';
import { submitMessage } from '../api/messages';
import { getAgences } from '../api/agences';
import WhatsAppFloat from '../components/WhatsAppFloat';


const Contact = () => {
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

  const [contactFormData, setContactFormData] = useState({
    name: '',
    email: '',
    telephone: '',
    subject: '',
    message: '',
    captcha: ''
  });
  const [contactFormMsg, setContactFormMsg] = useState('');
  const [contactFormStatus, setContactFormStatus] = useState('idle'); // idle | loading | success | error

  const [agenciesData, setAgenciesData] = useState([]);

  useEffect(() => {
    getAgences().then(setAgenciesData);
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
      {
        setRdvFormMsg('Votre demande de rendez-vous a été envoyée avec succès. Un conseiller vous contactera bientôt.');
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
      }
    } catch (error) {
      setRdvFormMsg('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  const handleContactFormChange = (e) => {
    setContactFormData({
      ...contactFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleContactFormSubmit = async (e) => {
    e.preventDefault();

    if (contactFormData.captcha.trim() !== '7') {
      setContactFormStatus('error');
      setContactFormMsg('Réponse incorrecte. Veuillez réessayer.');
      return;
    }

    setContactFormStatus('loading');
    setContactFormMsg('Envoi en cours...');

    try {
      const result = await submitMessage('contact', {
        nom: contactFormData.name,
        email: contactFormData.email,
        telephone: contactFormData.telephone,
        message: `Sujet : ${contactFormData.subject || '—'}\n${contactFormData.message || ''}`,
      });

      if (result?.simulated) {
        setContactFormStatus('error');
        setContactFormMsg("Le service d'envoi n'est pas disponible pour le moment. Veuillez réessayer plus tard.");
        return;
      }

      setContactFormStatus('success');
      setContactFormMsg('Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.');
      setContactFormData({
        name: '',
        email: '',
        telephone: '',
        subject: '',
        message: '',
        captcha: ''
      });
      e.target.reset();
    } catch (error) {
      setContactFormStatus('error');
      const details = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat().join(' ')
        : '';
      setContactFormMsg(details || 'Une erreur est survenue. Veuillez réessayer.');
    }
  };

  const scrollToAgencies = () => {
    const agenciesSection = document.querySelector('.agencies-section');
    if (agenciesSection) {
      agenciesSection.scrollIntoView({ behavior: 'smooth' });
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

  // Scroll vers la section agences si le hash est #agencies
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#agencies') {
        const agenciesSection = document.querySelector('.agencies-section');
        if (agenciesSection) {
          setTimeout(() => {
            const headerHeight = 80;
            const elementPosition = agenciesSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }, 100);
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div>
      <Header onRdvClick={openRdvModal} />

      <section className="hero-section" style={{ backgroundImage: "url('/contact.png')" }}>
        <div className="hero-background" style={{ backgroundImage: "url('/contact.png')" }}></div>
        <div className="unified-hero-overlay"></div>
        <div className="hero-content-wrapper">
          <h1 className="hero-title">Contactez-nous</h1>
          <p className="hero-subtitle">Nos équipes sont à votre écoute pour vous accompagner dans tous vos projets immobiliers</p>
        </div>
        <div className="hero-scroll-indicator" onClick={scrollToAgencies}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 13l5 5 5-5M7 6l5 5 5-5"/>
          </svg>
        </div>
      </section>

      <section className="section agencies-section reveal visible" id="agencies">
        <div className="container">
          <div className="agencies-grid">
            {agenciesData.map((agency, index) => (
              <div key={agency.id} className="agency-card visible" data-index={index}>
                <h3 className="agency-card-title">{agency.nom}</h3>

                <div className="agency-info-row">
                  <div className="agency-icon location">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <div className="agency-info-content">
                    <div className="agency-info-label">Adresse</div>
                    <div className="agency-info-value">{agency.adresse}</div>
                  </div>
                </div>

                <div className="agency-info-row">
                  <div className="agency-icon phone">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </div>
                  <div className="agency-info-content">
                    <div className="agency-info-label">Téléphone</div>
                    <div className="agency-info-value">
                      {agency.telephones.map((tel, i) => (
                        <a key={i} href={`tel:${tel.replace(/\s/g, '')}`}>{tel}</a>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="agency-info-row">
                  <div className="agency-icon whatsapp">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div className="agency-info-content">
                    <div className="agency-info-label">WhatsApp</div>
                    <div className="agency-info-value">
                      <a href={`https://wa.me/${agency.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener">{agency.whatsapp}</a>
                    </div>
                  </div>
                </div>

                <div className="agency-info-row">
                  <div className="agency-icon email">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                  <div className="agency-info-content">
                    <div className="agency-info-label">Email</div>
                    <div className="agency-info-value">
                      <a href={`mailto:${agency.email}`}>{agency.email}</a>
                    </div>
                  </div>
                </div>

                <div className="agency-info-row">
                  <div className="agency-icon hours">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                  <div className="agency-info-content">
                    <div className="agency-info-label">Horaires</div>
                    <div className="agency-info-value">
                      {Array.isArray(agency.horaires) ? (
                        agency.horaires.map((horaire, index) => (
                          <div key={index} style={{ marginBottom: index < agency.horaires.length - 1 ? '4px' : '0' }}>{horaire}</div>
                        ))
                      ) : (
                        agency.horaires
                      )}
                    </div>
                  </div>
                </div>

                <div className="agency-map-container">
                  <OpenStreetMap latitude={agency.latitude} longitude={agency.longitude} height="300px" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section tinted reveal">
        <div className="container" style={{ maxWidth: '680px' }}>
          <div className="section-head text-center">
            <h2>Envoyez-nous un message</h2>
            <p style={{ color: 'var(--encre-douce)', marginTop: '10px' }}>
              Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais
            </p>
          </div>
          <div className="form-card">
            <form id="contactForm" onSubmit={handleContactFormSubmit}>
              <div className="field-row">
                <div className="field">
                  <label>Nom complet</label>
                  <input type="text" name="name" required value={contactFormData.name} onChange={handleContactFormChange} placeholder="Nom complet" />
                </div>
                <div className="field">
                  <label>Téléphone</label>
                  <input type="tel" name="telephone" required value={contactFormData.telephone} onChange={handleContactFormChange} placeholder="+228 ..." />
                </div>
              </div>
              <div className="field">
                <label>Email</label>
                <input type="email" name="email" required value={contactFormData.email} onChange={handleContactFormChange} placeholder="votre@email.com" />
              </div>
              <div className="field">
                <label>Sujet</label>
                <input type="text" name="subject" required value={contactFormData.subject} onChange={handleContactFormChange} placeholder="Sujet de votre message" />
              </div>
              <div className="field">
                <label>Message</label>
                <textarea name="message" required placeholder="Votre message" value={contactFormData.message} onChange={handleContactFormChange} rows="5"></textarea>
              </div>
              <div className="field">
                <label>Vérification (anti-spam)</label>
                <input type="text" name="captcha" required value={contactFormData.captcha} onChange={handleContactFormChange} placeholder="3 + 4 = ?" style={{ width: '100px' }} />
                <span style={{ fontSize: '0.85rem', color: 'var(--encre-douce)', marginLeft: '10px' }}>Combien font 3 + 4 ?</span>
              </div>
              <button type="submit" className="btn btn-primary block">Envoyer le message</button>
              {contactFormMsg && (
                <p
                  className={`form-msg ${contactFormStatus === 'success' ? 'ok' : contactFormStatus === 'error' ? 'error' : ''}`}
                  style={contactFormStatus === 'loading' ? { display: 'block' } : undefined}
                >
                  {contactFormMsg}
                </p>
              )}
            </form>
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
                <label>Bien concerné (optionnel)</label>
                <input type="text" name="bien" placeholder="Référence ou adresse du bien" value={rdvFormData.bien} onChange={handleRdvFormChange} />
              </div>
              <div className="field">
                <label>Message (optionnel)</label>
                <textarea name="message" placeholder="Précisez votre besoin si vous le souhaitez." value={rdvFormData.message} onChange={handleRdvFormChange}></textarea>
              </div>
              <button type="submit" className="btn btn-primary block" id="rdvSubmitBtn">Envoyer ma demande</button>
              <p className="form-msg" id="rdvFormMsg">{rdvFormMsg}</p>
            </form>
          </div>
        </div>
      )}

      <WhatsAppFloat />
    </div>
  );
};

export default Contact;
