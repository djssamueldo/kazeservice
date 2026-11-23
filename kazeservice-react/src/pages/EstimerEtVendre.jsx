import { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import '../styles/style.css';
import { createAppointment } from '../api/appointments';
import { submitMessage } from '../api/messages';
import WhatsAppFloat from '../components/WhatsAppFloat';
import Section from '../components/Section';
import ContentBlock from '../components/ContentBlock';
import SectionTitle from '../components/SectionTitle';
import SectionEyebrow from '../components/SectionEyebrow';


const EstimerEtVendre = () => {
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

  const [estimationFormData, setEstimationFormData] = useState({
    nom: '',
    telephone: '',
    email: '',
    adresse: '',
    type_bien: '',
    surface: '',
    pieces: '',
    message: ''
  });
  const [estimationFormMsg, setEstimationFormMsg] = useState('');

  const statsSectionRef = useRef(null);
  const [countersAnimated, setCountersAnimated] = useState(false);

  const faqItems = [
    {
      question: "Comment se déroule une estimation ?",
      answer: "Un expert se déplace gratuitement à votre domicile pour évaluer votre bien. Il analyse les caractéristiques, l'état général, la localisation et compare avec les transactions réelles du quartier. Vous recevez ensuite une estimation détaillée par écrit."
    },
    {
      question: "Combien coûte l'estimation ?",
      answer: "L'estimation est gratuite et sans engagement. Elle vous permet de connaître la valeur de votre bien sur le marché actuel sans aucun frais. Vous êtes libre de choisir ou non nos services pour la vente."
    },
    {
      question: "Suis-je obligé de signer un mandat ?",
      answer: "Non, l'estimation ne vous engage à rien. Si vous souhaitez nous confier la vente, nous proposerons un mandat de vente définissant nos honoraires et la durée de collaboration. Vous restez libre de refuser."
    },
    {
      question: "Combien de temps faut-il pour vendre ?",
      answer: "Le délai moyen de vente est de 15 jours pour les biens correctement estimés. Cependant, ce délai peut varier selon le type de bien, la localisation et les conditions du marché. Nous vous donnons une estimation réaliste dès le début."
    },
    {
      question: "Quels documents dois-je fournir ?",
      answer: "Pour l'estimation : une pièce d'identité et le titre de propriété. Pour la vente : le titre de propriété, le diagnostic de performance énergétique, le carnet d'entretien (copropriété), les derniers procès-verbaux d'assemblée générale et les plans si disponibles."
    }
  ];

  const testimonials = [
    {
      content: "Excellente estimation de notre appartement. L'équipe a su trouver rapidement un acqueseur au prix souhaité. Je recommande vivement !",
      author: "Marie Kouassi",
      location: "Lomé",
      initials: "MK"
    },
    {
      content: "Professionnalisme et réactivité tout au long de la vente de notre villa. Les photos étaient magnifiques et les visites bien organisées.",
      author: "Koffi Amewugah",
      location: "Kodjoviakopé",
      initials: "KA"
    },
    {
      content: "Vente de notre terrain en un temps record. L'estimation était juste et la négociation parfaite. Merci à toute l'équipe Kazeservices.",
      author: "Aho Togbe",
      location: "Bè",
      initials: "AT"
    }
  ];

  const timelineItems = [
    { number: 1, title: "Prise de contact", content: "Vous nous contactez pour une première discussion sur votre projet de vente." },
    { number: 2, title: "Estimation", content: "Notre expert se déplace pour évaluer votre bien et établir une estimation précise." },
    { number: 3, title: "Signature du mandat", content: "Nous signons ensemble le mandat de vente définissant nos conditions de collaboration." },
    { number: 4, title: "Préparation du bien", content: "Conseils pour mettre en valeur votre propriété avant les visites." },
    { number: 5, title: "Reportage photo", content: "Réalisation de photos professionnelles et vidéos pour la commercialisation." },
    { number: 6, title: "Diffusion", content: "Publication de votre annonce sur tous nos portails partenaires." },
    { number: 7, title: "Visites", content: "Organisation et accompagnement des visites avec les acquéreurs potentiels." },
    { number: 8, title: "Négociation", content: "Négociation des offres et présentation des propositions les plus sérieuses." },
    { number: 9, title: "Compromis", content: "Rédaction et signature du compromis de vente avec l'acquéreur retenu." },
    { number: 10, title: "Signature définitive", content: "Signature de l'acte authentique chez le notaire et remise des clés." }
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

  const handleEstimationFormChange = (e) => {
    setEstimationFormData({
      ...estimationFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleEstimationFormSubmit = async (e) => {
    e.preventDefault();
    setEstimationFormMsg('Envoi en cours...');

    try {
      await submitMessage('estimation', {
        nom: estimationFormData.nom,
        telephone: estimationFormData.telephone,
        email: estimationFormData.email,
        adresse: estimationFormData.adresse,
        type_bien: estimationFormData.type_bien,
        surface: estimationFormData.surface,
        pieces: estimationFormData.pieces,
        message: estimationFormData.message,
      });
      {
        setEstimationFormMsg('Merci ! Votre demande d\'estimation a bien été envoyée. Un expert vous contactera sous 24h.');
        setEstimationFormData({
          nom: '',
          telephone: '',
          email: '',
          adresse: '',
          type_bien: '',
          surface: '',
          pieces: '',
          message: ''
        });
      }
    } catch (error) {
      setEstimationFormMsg("L'envoi a échoué. Réessayez ou contactez-nous directement.");
    }
  };

  const scrollToEstimationForm = () => {
    const element = document.getElementById('estimationFormSection');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Animated counters
  useEffect(() => {
    let hasAnimated = false;
    let observer = null;

    const animateCounters = () => {
      const statNumbers = document.querySelectorAll('.stat-number');
      statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
          current += step;
          if (current < target) {
            stat.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
          } else {
            stat.textContent = target;
          }
        };

        updateCounter();
      });
    };

    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          setCountersAnimated(true);
          animateCounters();
          // Désactiver l'observer après la première animation
          if (statsSectionRef.current) {
            observer.unobserve(statsSectionRef.current);
          }
        }
      });
    }, { threshold: 0.5 });

    if (statsSectionRef.current) {
      observer.observe(statsSectionRef.current);
    }

    return () => {
      if (observer && statsSectionRef.current) {
        observer.unobserve(statsSectionRef.current);
      }
    };
  }, []);

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

      {/* HERO ESTIMER ET VENDRE */}
      <section className="hero-section" style={{ backgroundImage: "url('/estimer-et-vendre.png')" }}>
        <div className="hero-background" style={{ backgroundImage: "url('/estimer-et-vendre.png')" }}></div>
        <div className="unified-hero-overlay"></div>
        <div className="hero-content-wrapper">
          <h1 className="hero-title">Estimer et Vendre</h1>
          <p className="hero-subtitle">Obtenez une estimation gratuite et vendez votre bien au meilleur prix</p>
          <div className="hero-buttons">
            <button onClick={scrollToEstimationForm} className="btn btn-primary btn-large">Demander une estimation</button>
            <a href="#commitments" className="btn btn-secondary btn-large">Nos engagements</a>
          </div>
        </div>
      </section>

      {/* POURQUOI VENDRE AVEC NOUS */}
      <section className="section advantages-section">
        <div className="container">
          <div className="section-head text-center">
            <h2>Pourquoi vendre avec nous ?</h2>
            <p className="section-subtitle">Notre expertise pour vendre votre bien rapidement et au meilleur prix</p>
          </div>
          <div className="advantages-grid">
            <div className="advantage-card">
              <div className="advantage-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              </div>
              <h3>Estimation précise</h3>
              <p>Évaluation précise basée sur les transactions réelles du quartier</p>
            </div>
            <div className="advantage-card">
              <div className="advantage-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <h3>Expertise locale</h3>
              <p>Connaissance approfondie du marché immobilier local</p>
            </div>
            <div className="advantage-card">
              <div className="advantage-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
              </div>
              <h3>Photos professionnelles</h3>
              <p>Reportage photo et vidéo pour valoriser votre bien</p>
            </div>
            <div className="advantage-card">
              <div className="advantage-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
              </div>
              <h3>Diffusion multi-portails</h3>
              <p>Publication sur tous les portails immobiliers partenaires</p>
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
              <h3>Accompagnement légal</h3>
              <p>Assistance pour toutes les démarches administratives</p>
            </div>
            <div className="advantage-card">
              <div className="advantage-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <h3>Négociation experte</h3>
              <p>Négociation des offres pour obtenir le meilleur prix</p>
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE VENTE */}
      <section className="section timeline-section">
        <div className="container">
          <div className="section-head text-center">
            <h2>Notre processus de vente</h2>
            <p className="section-subtitle">Les étapes clés de la vente de votre bien</p>
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

      {/* NOS ENGAGEMENTS */}
      <section className="section commitments-section" id="commitments">
        <div className="container">
          <div className="section-head text-center">
            <h2>Nos engagements</h2>
            <p className="section-subtitle">Nos garanties pour une vente réussie</p>
          </div>
          <div className="commitments-grid">
            <div className="commitment-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Estimation réaliste</span>
            </div>
            <div className="commitment-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Suivi personnalisé</span>
            </div>
            <div className="commitment-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Compte rendu après chaque visite</span>
            </div>
            <div className="commitment-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Accompagnement jusqu'à la signature</span>
            </div>
            <div className="commitment-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Stratégie marketing sur mesure</span>
            </div>
            <div className="commitment-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Visibilité maximale</span>
            </div>
          </div>
        </div>
      </section>

      {/* CHIFFRES CLÉS */}
      <section className="section stats-section" ref={statsSectionRef}>
        <div className="container">
          <div className="section-head text-center">
            <h2>Nos statistiques</h2>
            <p className="section-subtitle">Nos résultats en chiffres</p>
          </div>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number" data-target="250">0</div>
              <div className="stat-label">Ventes réalisées</div>
            </div>
            <div className="stat-item">
              <div className="stat-number" data-target="98">0</div>
              <div className="stat-label">% de satisfaction</div>
            </div>
            <div className="stat-item">
              <div className="stat-number" data-target="15">0</div>
              <div className="stat-label">Jours de délai moyen</div>
            </div>
            <div className="stat-item">
              <div className="stat-number" data-target="95">0</div>
              <div className="stat-label">% vendus au prix estimé</div>
            </div>
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGES */}
      <section className="section testimonials-section">
        <div className="container">
          <div className="section-head text-center">
            <h2>Témoignages</h2>
            <p className="section-subtitle">Ce que disent nos clients</p>
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
            <p className="section-subtitle">Les réponses à vos questions sur l'estimation et la vente</p>
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

      {/* FORMULAIRE ESTIMATION */}
      <section className="section tinted estimation-form-section" id="estimationFormSection">
        <div className="container">
          <div className="section-head text-center">
            <h2>Demander une estimation</h2>
            <p className="section-subtitle">Remplissez le formulaire ci-dessous pour obtenir une estimation gratuite de votre bien</p>
          </div>
          <div className="estimation-form-card">
            <form id="estimationForm" onSubmit={handleEstimationFormSubmit}>
              <div className="form-grid-2">
                <div className="field">
                  <label>Nom *</label>
                  <input type="text" name="nom" required placeholder="Votre nom complet" value={estimationFormData.nom} onChange={handleEstimationFormChange} />
                </div>
                <div className="field">
                  <label>Téléphone *</label>
                  <input type="tel" name="telephone" required placeholder="Votre numéro de téléphone" value={estimationFormData.telephone} onChange={handleEstimationFormChange} />
                </div>
              </div>
              <div className="form-grid-2">
                <div className="field">
                  <label>Email *</label>
                  <input type="email" name="email" required placeholder="Votre adresse email" value={estimationFormData.email} onChange={handleEstimationFormChange} />
                </div>
                <div className="field">
                  <label>Adresse du bien *</label>
                  <input type="text" name="adresse" required placeholder="Adresse complète" value={estimationFormData.adresse} onChange={handleEstimationFormChange} />
                </div>
              </div>
              <div className="form-grid-3">
                <div className="field">
                  <label>Type de bien *</label>
                  <select name="type_bien" required value={estimationFormData.type_bien} onChange={handleEstimationFormChange}>
                    <option value="">Choisissez</option>
                    <option value="maison">Maison</option>
                    <option value="villa">Villa</option>
                    <option value="appartement">Appartement</option>
                    <option value="terrain">Terrain</option>
                    <option value="bureau">Bureau</option>
                    <option value="fonds_commerce">Fonds de commerce</option>
                  </select>
                </div>
                <div className="field">
                  <label>Surface (m²) *</label>
                  <input type="number" name="surface" required placeholder="Surface en m²" value={estimationFormData.surface} onChange={handleEstimationFormChange} />
                </div>
                <div className="field">
                  <label>Nombre de pièces</label>
                  <input type="number" name="pieces" placeholder="Nombre de pièces" value={estimationFormData.pieces} onChange={handleEstimationFormChange} />
                </div>
              </div>
              <div className="field">
                <label>Message (facultatif)</label>
                <textarea name="message" rows="4" placeholder="Précisez les particularités de votre bien..." value={estimationFormData.message} onChange={handleEstimationFormChange}></textarea>
              </div>
              <button type="submit" className="btn btn-primary btn-large block" id="submitEstimationBtn">Demander mon estimation</button>
              <p className="form-msg" id="estimationFormMsg">{estimationFormMsg}</p>
            </form>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="section cta-section">
        <div className="container text-center">
          <h2>Prêt à vendre votre bien ?</h2>
          <p className="cta-subtitle">Contactez nos experts pour une estimation personnalisée</p>
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

export default EstimerEtVendre;
