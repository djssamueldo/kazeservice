import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import '../styles/style.css';
import { createAppointment } from '../api/appointments';
import { submitMessage } from '../api/messages';
import WhatsAppFloat from '../components/WhatsAppFloat';


const FaireGererMaLocation = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
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

  const [manageFormData, setManageFormData] = useState({
    nom: '',
    telephone: '',
    email: '',
    adresse: '',
    type_bien: '',
    surface: '',
    message: ''
  });
  const [manageFormMsg, setManageFormMsg] = useState('');

  const faqItems = [
    {
      question: "Quels sont vos honoraires de gestion ?",
      answer: "Nos honoraires sont généralement de 8% des loyers encaissés HT. Ce tarif inclut toutes les prestations de gestion administrative, financière et technique. Un devis personnalisé vous est fourni gratuitement."
    },
    {
      question: "Comment sont sélectionnés les locataires ?",
      answer: "Nous appliquons des critères stricts : vérification des revenus (3 fois le loyer), analyse des justificatifs, contrôle des références et vérification de la solvabilité. Seuls les dossiers solides sont acceptés."
    },
    {
      question: "Que se passe-t-il en cas d'impayé ?",
      answer: "Nous procédons immédiatement aux relances amiables, puis aux relances recommandées. Avec la garantie loyers impayés, vous êtes indemnisé dès le premier mois d'impayé. Nous gérons également la procédure contentieuse si nécessaire."
    },
    {
      question: "Puis-je accéder à mon espace propriétaire ?",
      answer: "Oui, vous avez accès à un espace personnel sécurisé où vous pouvez consulter vos quittances, l'historique des paiements, les rapports de visite et toutes les informations relatives à votre bien en temps réel."
    },
    {
      question: "Comment sont gérés les travaux ?",
      answer: "Nous coordonnons toutes les interventions : demande de devis, sélection des artisans conformes, supervision des travaux et validation des factures. Les travaux courants sont délégués, les gros travaux nécessitent votre accord préalable."
    }
  ];

  const testimonials = [
    {
      content: "Depuis que j'ai confié mon appartement à Kazeservices, je n'ai plus aucune préoccupation. Les loyers sont payés à temps et le suivi est impeccable.",
      author: "Jean Agbogan",
      location: "Tokoin",
      initials: "JA"
    },
    {
      content: "Professionnalisme et transparence. Je reçois un rapport mensuel détaillé et toute intervention est validée avant. Je recommande vivement.",
      author: "Aïcha Mensah",
      location: "Agoè",
      initials: "AM"
    },
    {
      content: "Gestion de plusieurs biens depuis 3 ans. Fiabilité totale et réactivité en cas de problème. Une vraie tranquillité d'esprit.",
      author: "Kofi Dossou",
      location: "Lomé",
      initials: "KD"
    }
  ];

  const timelineItems = [
    { number: 1, title: "Prise de contact", content: "Vous nous contactez pour une première discussion sur votre bien et vos attentes." },
    { number: 2, title: "Estimation", content: "Nous évaluons le loyer optimal selon le marché et les caractéristiques du bien." },
    { number: 3, title: "Mise en location", content: "Signature du mandat de gestion et préparation du bien pour la location." },
    { number: 4, title: "Diffusion", content: "Publication de l'annonce sur tous nos portails et réseaux sociaux." },
    { number: 5, title: "Visites", content: "Organisation des visites avec les candidats potentiels." },
    { number: 6, title: "Sélection", content: "Analyse des dossiers et sélection du locataire le plus fiable." },
    { number: 7, title: "Signature", content: "Signature du bail et de l'état des lieux avec le locataire retenu." },
    { number: 8, title: "Remise des clés", content: "Remise des clés et début de la gestion locative." },
    { number: 9, title: "Gestion quotidienne", content: "Encaissement des loyers, suivi des charges et gestion des interventions." }
  ];

  const servicesItems = [
    { number: "01", title: "Recherche du locataire", content: "Publication d'annonces, présélection des dossiers, organisation des visites et vérification des garanties." },
    { number: "02", title: "Visites et sélection", content: "Accompagnement lors des visites, analyse des profils et sélection du candidat idéal." },
    { number: "03", title: "Constitution du dossier", content: "Vérification des pièces justificatives, analyse de la solvabilité et constitution du dossier locataire." },
    { number: "04", title: "Bail et état des lieux", content: "Rédaction du bail conforme à la législation, réalisation de l'état des lieux entrant et sortant." },
    { number: "05", title: "Encaissement et relances", content: "Encaissement automatique des loyers, relances en cas d'impayé et suivi des paiements." },
    { number: "06", title: "Gestion des travaux", content: "Coordination des réparations, demande de devis, supervision des artisans et facturation." },
    { number: "07", title: "Déclarations fiscales", content: "Établissement des déclarations de revenus locatifs et assistance pour vos obligations fiscales." },
    { number: "08", title: "Renouvellement et sortie", content: "Gestion des renouvellements de bail, congés et remise en état du logement." }
  ];

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const nextTestimonial = () => {
    setActiveTestimonial((activeTestimonial + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((activeTestimonial - 1 + testimonials.length) % testimonials.length);
  };

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
        bien: '',
        message: ''
      });
      setTimeout(closeRdvModal, 2000);
    } catch (error) {
      setRdvFormMsg("L'envoi a échoué. Vérifiez votre connexion et réessayez, ou contactez-nous directement par téléphone.");
    }
  };

  const handleManageFormChange = (e) => {
    setManageFormData({
      ...manageFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleManageFormSubmit = async (e) => {
    e.preventDefault();
    setManageFormMsg('Envoi en cours...');

    try {
      await submitMessage('gestion_locative', {
        nom: manageFormData.nom,
        telephone: manageFormData.telephone,
        email: manageFormData.email,
        adresse: manageFormData.adresse,
        type_bien: manageFormData.type_bien,
        surface: manageFormData.surface,
        message: manageFormData.message,
      });
      {
        setManageFormMsg('Merci ! Votre demande a bien été envoyée. Un expert vous contactera sous 24h.');
        setManageFormData({
          nom: '',
          telephone: '',
          email: '',
          adresse: '',
          type_bien: '',
          surface: '',
          message: ''
        });
      }
    } catch (error) {
      setManageFormMsg("L'envoi a échoué. Réessayez ou contactez-nous directement.");
    }
  };

  const scrollToManageForm = () => {
    const element = document.getElementById('manageFormSection');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
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

  return (
    <div>
      <Header onRdvClick={openRdvModal} />

      {/* HERO FAIRE GÉRER MA LOCATION */}
      <section className="hero-section" style={{ backgroundImage: "url('/gerer-ma-location.png')" }}>
        <div className="hero-background" style={{ backgroundImage: "url('/gerer-ma-location.png')" }}></div>
        <div className="unified-hero-overlay"></div>
        <div className="hero-content-wrapper">
          <h1 className="hero-title">Faire Gérer Ma Location</h1>
          <p className="hero-subtitle">Confiez la gestion de votre bien à des professionnels</p>
          <div className="hero-buttons">
            <button onClick={scrollToManageForm} className="btn btn-primary btn-large">Confier mon bien</button>
            <a href="#prestations" className="btn btn-secondary btn-large">Nos prestations</a>
          </div>
        </div>
      </section>

      {/* POURQUOI NOUS CONFIER VOTRE BIEN */}
      <section className="section advantages-section">
        <div className="container">
          <div className="section-head text-center">
            <h2>Pourquoi nous confier votre bien ?</h2>
            <p className="section-subtitle">Notre expertise pour une gestion locative sereine et rentable</p>
          </div>
          <div className="advantages-grid">
            <div className="advantage-card">
              <div className="advantage-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3>Recherche de locataires</h3>
              <p>Sélection rigoureuse de locataires solvables et fiables</p>
            </div>
            <div className="advantage-card">
              <div className="advantage-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <h3>Gestion administrative</h3>
              <p>Encaissement des loyers, quittances et suivi des dossiers</p>
            </div>
            <div className="advantage-card">
              <div className="advantage-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                  <line x1="1" y1="10" x2="23" y2="10"></line>
                </svg>
              </div>
              <h3>Gestion financière</h3>
              <p>Régularisation des charges et suivi comptable</p>
            </div>
            <div className="advantage-card">
              <div className="advantage-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3>Conformité légale</h3>
              <p>Baux conformes et respect de la législation</p>
            </div>
            <div className="advantage-card">
              <div className="advantage-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </div>
              <h3>Gestion des incidents</h3>
              <p>Intervention rapide en cas de problème ou d'impayé</p>
            </div>
            <div className="advantage-card">
              <div className="advantage-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <h3>Suivi personnalisé</h3>
              <p>Reporting régulier et disponibilité pour vos questions</p>
            </div>
          </div>
        </div>
      </section>

      {/* NOS PRESTATIONS */}
      <section className="section services-section" id="prestations">
        <div className="container">
          <div className="section-head text-center">
            <h2>Nos prestations</h2>
            <p className="section-subtitle">Un accompagnement complet pour la gestion de votre bien</p>
          </div>
          <div className="services-grid">
            {servicesItems.map((item, index) => (
              <div key={index} className="service-card">
                <div className="service-number">{item.number}</div>
                <h3>{item.title}</h3>
                <p>{item.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE PROCESSUS */}
      <section className="section timeline-section">
        <div className="container">
          <div className="section-head text-center">
            <h2>Notre processus de gestion</h2>
            <p className="section-subtitle">Les étapes clés de notre accompagnement</p>
          </div>
          <div className="timeline">
            {timelineItems.map((item, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-number">{item.number}</div>
                <div className="timeline-content">
                  <h3>{item.title}</h3>
                  <p>{item.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GARANTIES */}
      <section className="section guarantees-section">
        <div className="container">
          <div className="section-head text-center">
            <h2>Nos garanties</h2>
            <p className="section-subtitle">La tranquillité d'esprit pour vos investissements locatifs</p>
          </div>
          <div className="guarantees-grid">
            <div className="guarantee-card">
              <div className="guarantee-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3>Garantie loyers impayés</h3>
              <p>Protection contre les impayés avec indemnisation jusqu'à 100% des loyers dus.</p>
            </div>
            <div className="guarantee-card">
              <div className="guarantee-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <h3>Protection juridique</h3>
              <p>Assistance juridique incluse pour tout litige ou contentieux locataire.</p>
            </div>
            <div className="guarantee-card">
              <div className="guarantee-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
              </div>
              <h3>Assurance PNO</h3>
              <p>Propriétaire Non Occupant incluse pour couvrir les risques locatifs.</p>
            </div>
            <div className="guarantee-card">
              <div className="guarantee-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <h3>Suivi transparent</h3>
              <p>Reporting mensuel détaillé et accès à un espace propriétaire en ligne.</p>
            </div>
            <div className="guarantee-card">
              <div className="guarantee-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <h3>Une expertise locale reconnue</h3>
              <p>Connaissance approfondie du marché immobilier local pour optimiser vos revenus locatifs.</p>
            </div>
            <div className="guarantee-card">
              <div className="guarantee-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                </svg>
              </div>
              <h3>Un interlocuteur unique</h3>
              <p>Un gestionnaire dédié pour votre bien, disponible et réactif. Plus de démarches multiples.</p>
            </div>
            <div className="guarantee-card">
              <div className="guarantee-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                  <line x1="1" y1="10" x2="23" y2="10"></line>
                </svg>
              </div>
              <h3>Des honoraires transparents</h3>
              <p>Pas de frais cachés, nos honoraires sont clairs et communiqués dès le début.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGES */}
      <section className="section testimonials-section">
        <div className="container">
          <div className="section-head text-center">
            <h2>Témoignages</h2>
            <p className="section-subtitle">Ce que disent nos propriétaires</p>
          </div>
          <div className="testimonials-carousel">
            {testimonials.map((testimonial, index) => (
              <div key={index} className={`testimonial-card ${activeTestimonial === index ? 'active' : ''}`}>
                <div className="testimonial-content">
                  <p>"{testimonial.content}"</p>
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar">{testimonial.initials}</div>
                  <div className="author-info">
                    <div className="author-name">{testimonial.author}</div>
                    <div className="author-location">{testimonial.location}</div>
                  </div>
                </div>
              </div>
            ))}
            <div className="testimonials-nav">
              <button className="testimonial-nav-btn prev" onClick={prevTestimonial}>←</button>
              <button className="testimonial-nav-btn next" onClick={nextTestimonial}>→</button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section faq-section" id="faq">
        <div className="container">
          <div className="section-head text-center">
            <h2>Questions fréquentes</h2>
            <p className="section-subtitle">Les réponses à vos questions sur la gestion locative</p>
          </div>
          <div className="faq-accordion">
            {faqItems.map((item, index) => (
              <div key={index} className={`faq-item ${activeFaq === index ? 'active' : ''}`}>
                <button className="faq-header" onClick={() => toggleFaq(index)}>
                  <span>{item.question}</span>
                  <svg className="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                <div className="faq-content">
                  <p>{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORMULAIRE GESTION */}
      <section className="section tinted estimation-form-section" id="manageFormSection">
        <div className="container">
          <div className="section-head text-center">
            <h2>Confiez-nous votre bien</h2>
            <p className="section-subtitle">Remplissez le formulaire ci-dessous pour confier la gestion de votre bien</p>
          </div>
          <div className="estimation-form-card">
            <form id="manageForm" onSubmit={handleManageFormSubmit}>
              <div className="form-grid-2">
                <div className="field">
                  <label>Nom *</label>
                  <input type="text" name="nom" required placeholder="Votre nom complet" value={manageFormData.nom} onChange={handleManageFormChange} />
                </div>
                <div className="field">
                  <label>Téléphone *</label>
                  <input type="tel" name="telephone" required placeholder="Votre numéro de téléphone" value={manageFormData.telephone} onChange={handleManageFormChange} />
                </div>
              </div>
              <div className="form-grid-2">
                <div className="field">
                  <label>Email *</label>
                  <input type="email" name="email" required placeholder="Votre adresse email" value={manageFormData.email} onChange={handleManageFormChange} />
                </div>
                <div className="field">
                  <label>Adresse du bien *</label>
                  <input type="text" name="adresse" required placeholder="Adresse complète" value={manageFormData.adresse} onChange={handleManageFormChange} />
                </div>
              </div>
              <div className="form-grid-2">
                <div className="field">
                  <label>Type de bien *</label>
                  <select name="type_bien" required value={manageFormData.type_bien} onChange={handleManageFormChange}>
                    <option value="">Choisissez</option>
                    <option value="appartement">Appartement</option>
                    <option value="maison">Maison</option>
                    <option value="villa">Villa</option>
                    <option value="bureau">Bureau</option>
                    <option value="local_commercial">Local commercial</option>
                  </select>
                </div>
                <div className="field">
                  <label>Surface (m²) *</label>
                  <input type="number" name="surface" required placeholder="Surface en m²" value={manageFormData.surface} onChange={handleManageFormChange} />
                </div>
              </div>
              <div className="field">
                <label>Message (facultatif)</label>
                <textarea name="message" rows="4" placeholder="Précisez vos attentes ou particularités..." value={manageFormData.message} onChange={handleManageFormChange}></textarea>
              </div>
              <button type="submit" className="btn btn-primary btn-large block" id="submitManageBtn">Confier mon bien</button>
              <p className="form-msg" id="manageFormMsg">{manageFormMsg}</p>
            </form>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="section cta-section">
        <div className="container text-center">
          <h2>Confiez-nous la gestion de votre location</h2>
          <p className="cta-subtitle">Notre équipe de professionnels gère votre bien en toute sérénité pour optimiser vos revenus locatifs.</p>
          <div className="cta-section-buttons">
            <a href="#faq" className="btn btn-primary">Voir la FAQ</a>
            <Link to="/contact#agencies" className="btn btn-secondary">Nous contacter</Link>
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
                <label>Bien concerné</label>
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

export default FaireGererMaLocation;
