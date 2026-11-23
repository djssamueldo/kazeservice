import { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import '../styles/style.css';
import { createAppointment } from '../api/appointments';
import WhatsAppFloat from '../components/WhatsAppFloat';
import Section from '../components/Section';


const Services = () => {
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
  const [sectionsAnimated, setSectionsAnimated] = useState(false);

  const servicesData = [
    {
      title: "Transaction immobilière",
      description: "Accompagnement complet pour l'achat, la vente et la location de biens immobiliers avec un suivi personnalisé à chaque étape.",
      link: "/transaction-immobiliere",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>`
    },
    {
      title: "Estimer et vendre",
      description: "Estimation gratuite de votre bien et accompagnement complet pour une vente réussie au meilleur prix.",
      link: "/estimer-et-vendre",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`
    },
    {
      title: "Faire gérer ma location",
      description: "Gestion locative complète, suivi administratif, perception des loyers et accompagnement des propriétaires.",
      link: "/faire-gerer-ma-location",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V7l8-4 8 4v14"/><path d="M17 21v-8.5a2.5 2.5 0 0 0-5 0V21"/><path d="M7 9a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2H7V9z"/></svg>`
    },
    {
      title: "Architecture",
      description: "Études architecturales, conception de plans et accompagnement dans l'aménagement de vos futurs espaces.",
      link: "/contact#agencies",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/></svg>`
    },
    {
      title: "Conseils juridiques, fiscaux et comptables",
      description: "Conseils juridiques, fiscaux et comptables pour sécuriser chaque projet immobilier.",
      link: "/contact#agencies",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>`
    },
    {
      title: "Construction",
      description: "Accompagnement dans la réalisation de projets de construction avec des partenaires qualifiés.",
      link: "/contact#agencies",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 0 0-10 10v2h20v-2a10 10 0 0 0-10-10z"/><path d="M12 2v4"/><path d="M8 6h8"/><path d="M4 14v6"/><path d="M20 14v6"/><path d="M8 14v6"/><path d="M16 14v6"/></svg>`
    },
    {
      title: "Formations",
      description: "Développez vos compétences grâce à nos formations dédiées à l'immobilier, à la gestion et aux métiers du secteur.",
      link: "/formations",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10v6"/><path d="M20 10a2 2 0 0 0-2-2v-8c0-1.1.9-2 2-2s2 .9 2 2v8a2 2 0 0 0-2 2Z"/><path d="M4 10a2 2 0 0 1 2-2v-8c0-1.1-.9-2-2-2s-2 .9-2 2v8a2 2 0 0 1 2 2Z"/><path d="m9 14 2 2 4-4"/></svg>`,
      isCta: true
    },
    {
      title: "Placement de personnel",
      description: "Recrutement et mise à disposition de personnel qualifié pour les particuliers, entreprises et institutions dans plusieurs secteurs d'activité.",
      link: "/placement-personnel",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
    },
    {
      title: "Services informatiques",
      description: "Développement web et mobile, logiciels métiers, cybersécurité, maintenance informatique, réseaux, hébergement et transformation digitale.",
      link: "/services-informatiques",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`
    }
  ];

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
    } catch (error) {
      setRdvFormMsg('Une erreur est survenue. Veuillez réessayer.');
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

      {/* HERO SERVICES */}
      <section className="hero-section" style={{ backgroundImage: "url('/service.jpg')" }}>
        <div className="hero-background" style={{ backgroundImage: "url('/service.jpg')" }}></div>
        <div className="unified-hero-overlay"></div>
        <div className="hero-content-wrapper">
          <h1 className="hero-title">Nos Services</h1>
          <p className="hero-subtitle">Découvrez nos solutions complètes pour tous vos projets immobiliers, de recrutement et informatiques</p>
          <div className="hero-buttons">
            <a href="#services" className="btn btn-primary btn-large">Découvrir nos services</a>
            <a href="#why-choose-us" className="btn btn-secondary btn-large">Pourquoi nous choisir</a>
          </div>
        </div>
      </section>

      <Section id="about-section" className="about-section-custom">
        <div className="about-section-header-custom">
          <p className="eyebrow">Qui sommes-nous ?</p>
          <h2>KAZESERVICES</h2>
          <p className="about-description-justify">KAZESERVICES est un cabinet multiservices spécialisé dans les métiers de l'immobilier, le placement de personnel et les services informatiques. Nous accompagnons les particuliers, les entreprises et les investisseurs dans leurs projets d'achat, de vente, de location, de gestion immobilière, d'architecture, de formation, de conseil juridique, fiscal et comptable, ainsi que dans leurs besoins en recrutement de personnel qualifié et en transformation digitale.</p>
          <p className="about-description-justify">Notre connaissance approfondie du marché immobilier, notre expertise en ressources humaines et nos compétences informatiques nous permettent d'apporter des solutions adaptées à chaque projet. Notre réseau de partenaires qualifiés et notre approche personnalisée garantissent un accompagnement sur-mesure, qu'il s'agisse d'une résidence, d'un investissement, d'un patrimoine à valoriser, de besoins en personnel ou de projets technologiques.</p>
        </div>
      </Section>

      <Section id="why-choose-us" className="why-choose-us">
        <div className="why-choose-us-header">
          <p className="eyebrow">Pourquoi nous choisir</p>
          <h2>Les valeurs qui nous guident</h2>
          <p>Nous nous engageons à vous offrir une expérience exceptionnelle basée sur des valeurs fondamentales, dans tous nos domaines d'expertise : immobilier, ressources humaines et services informatiques.</p>
        </div>

        <div className="why-choose-us-grid">
          <div className="why-choose-us-card">
            <div className="why-choose-us-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
            </div>
            <h3>Expertise</h3>
            <p>Une équipe de professionnels expérimentés connaissant parfaitement le marché immobilier, les ressources humaines et les technologies de l'information.</p>
          </div>
          <div className="why-choose-us-card">
            <div className="why-choose-us-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            </div>
            <h3>Transparence</h3>
            <p>Une communication claire et honnête à chaque étape de votre projet, qu'il soit immobilier, RH ou technologique.</p>
          </div>
          <div className="why-choose-us-card">
            <div className="why-choose-us-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            <h3>Accompagnement personnalisé</h3>
            <p>Un suivi sur-mesure adapté à vos besoins et à vos objectifs spécifiques dans tous nos domaines d'activité.</p>
          </div>
          <div className="why-choose-us-card">
            <div className="why-choose-us-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
            <h3>Réactivité</h3>
            <p>Une réponse rapide et efficace à toutes vos demandes et interrogations, quel que soit votre projet.</p>
          </div>
          <div className="why-choose-us-card">
            <div className="why-choose-us-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>
            <h3>Sécurité</h3>
            <p>Des processus rigoureux pour garantir la sécurité de vos transactions.</p>
          </div>
          <div className="why-choose-us-card">
            <div className="why-choose-us-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </div>
            <h3>Satisfaction client</h3>
            <p>Votre satisfaction est notre priorité absolue et notre plus grande récompense.</p>
          </div>
        </div>
      </Section>

      <Section className="process-section">
        <div className="process-section-header">
          <p className="eyebrow">NOTRE MÉTHODE D'ACCOMPAGNEMENT</p>
          <h2>Notre accompagnement en 4 étapes</h2>
          <p>Chaque projet mérite une approche claire, structurée et personnalisée. Chez KAZESERVICES, nous vous accompagnons à chaque étape afin de garantir une expérience fluide, sécurisée et efficace, que votre projet soit immobilier, RH ou technologique.</p>
        </div>
        <div className="process-steps-grid">
          <div className="process-step-card">
            <div className="process-step-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
            <h4>Analyse de votre besoin</h4>
            <p>Nous prenons le temps de comprendre vos objectifs, vos contraintes et votre budget afin de définir la meilleure stratégie adaptée à votre projet.</p>
          </div>
          <div className="process-step-card">
            <div className="process-step-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M9 14h6"></path><path d="M9 10h6"></path><path d="M9 18h6"></path></svg>
            </div>
            <h4>Conseil personnalisé</h4>
            <p>Nos experts vous orientent vers les solutions les plus adaptées grâce à une analyse approfondie du marché et de votre projet.</p>
          </div>
          <div className="process-step-card">
            <div className="process-step-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M5 21V7l8-4 8 4v14"/><path d="M17 21v-8.5a2.5 2.5 0 0 0-5 0V21"/><path d="M7 9a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2H7V9z"/></svg>
            </div>
            <h4>Mise en œuvre</h4>
            <p>Nous coordonnons toutes les démarches nécessaires avec professionnalisme jusqu'à la concrétisation de votre projet immobilier.</p>
          </div>
          <div className="process-step-card">
            <div className="process-step-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </div>
            <h4>Suivi et accompagnement</h4>
            <p>Même après la réalisation de votre projet, nous restons disponibles pour vous conseiller et assurer un accompagnement durable.</p>
          </div>
        </div>
        <div className="process-section-footer">
          <p>De votre premier contact jusqu'à la finalisation de votre projet, KAZESERVICES met tout en œuvre pour vous offrir un accompagnement transparent, réactif et personnalisé.</p>
        </div>
      </Section>

      <Section id="services" className="services-section-custom">
        <div className="services-section-header-custom">
          <p className="eyebrow">Nos Services</p>
          <h2>Découvrez nos solutions multiservices</h2>
          <p>Des services complets et personnalisés pour répondre à tous vos besoins : immobilier, ressources humaines et transformation digitale.</p>
        </div>

          <div className="services-grid-custom" id="servicesGridCustom">
            {servicesData.map((service, index) => (
              service.isCta ? (
                <div key={index} className="service-card-custom service-card-cta-custom">
                  <div className="service-card-icon-custom" dangerouslySetInnerHTML={{ __html: service.icon }}></div>
                  <h3 className="service-card-title-custom">{service.title}</h3>
                  <p className="service-card-description-custom">{service.description}</p>
                  <Link to={service.link} className="service-card-link-custom">Voir les formations</Link>
                </div>
              ) : (
                <div key={index} className="service-card-custom">
                  <div className="service-card-icon-custom" dangerouslySetInnerHTML={{ __html: service.icon }}></div>
                  <h3 className="service-card-title-custom">{service.title}</h3>
                  <p className="service-card-description-custom">{service.description}</p>
                  <Link to={service.link} className="service-card-link-custom">
                    En savoir plus
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  </Link>
                </div>
              )
            ))}
          </div>
      </Section>

      <Section className="cta-section">
        <h2>Confiez-nous votre projet immobilier</h2>
        <p>Notre équipe est prête à vous accompagner dans la réalisation de tous vos projets immobiliers avec professionnalisme et engagement.</p>
        <div className="cta-section-buttons">
          <Link to="/nos-offres#biens" className="btn btn-primary">Découvrir nos offres</Link>
          <Link to="/contact#agencies" className="btn btn-secondary">Nous contacter</Link>
        </div>
      </Section>

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

export default Services;
