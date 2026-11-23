import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import '../styles/style.css';
import { createAppointment } from '../api/appointments';
import WhatsAppFloat from '../components/WhatsAppFloat';


const InvestirDansImmobilier = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isRdvModalOpen, setIsRdvModalOpen] = useState(false);
  const [rdvFormData, setRdvFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    motif: '',
    date: '',
    message: ''
  });
  const [rdvFormMsg, setRdvFormMsg] = useState('');
  const [sectionsAnimated, setSectionsAnimated] = useState(false);

  const [simulatorData, setSimulatorData] = useState({
    montant_investi: '',
    apport: '',
    duree: '20',
    taux: '',
    loyer: '',
    charges: ''
  });
  const [simulatorResults, setSimulatorResults] = useState(null);

  const faqItems = [
    {
      question: "Quel apport personnel est nécessaire pour investir ?",
      answer: "Généralement, les banques demandent un apport de 10% à 20% du prix du bien. Cependant, certains dispositifs permettent d'investir avec un apport réduit. Nous vous aidons à optimiser votre apport."
    },
    {
      question: "Quelle est la rentabilité moyenne d'un investissement locatif ?",
      answer: "La rentabilité brute moyenne se situe entre 5% et 8% selon la localisation et le type de bien. La rentabilité nette, après charges et impôts, est généralement de 3% à 6%."
    },
    {
      question: "Quels sont les avantages fiscaux de l'investissement locatif ?",
      answer: "Plusieurs dispositifs permettent de réduire vos impôts : LMNP, Pinel, Malraux, Denormandie. Nous vous conseillons sur la solution la plus adaptée à votre situation."
    },
    {
      question: "Comment choisir le bon bien pour investir ?",
      answer: "Nous analysons plusieurs critères : l'emplacement, le potentiel locatif, l'état général, les charges de copropriété, et la valorisation future. Notre expertise vous garantit un choix éclairé."
    },
    {
      question: "Puis-je investir avec un budget limité ?",
      answer: "Oui, il existe des solutions pour tous les budgets : petits appartements, SCPI, crowdfunding immobilier. Nous vous aidons à trouver la formule adaptée à votre capacité d'investissement."
    }
  ];

  const testimonials = [
    {
      content: "Grâce à Kazeservices, j'ai pu acquérir mon premier bien locatif avec un rendement de 8%. L'accompagnement a été impeccable du début à la fin.",
      author: "Marc Kodjo",
      location: "Investisseur",
      initials: "MK"
    },
    {
      content: "Leur connaissance du marché local m'a permis de trouver un bien sous-évalué. En 3 ans, sa valeur a augmenté de 30%. Je recommande vivement.",
      author: "Sylvie Aho",
      location: "Propriétaire",
      initials: "SA"
    },
    {
      content: "J'ai investi dans un immeuble de rapport grâce à leur équipe. La gestion locative est assurée et les revenus sont réguliers. Un vrai plaisir.",
      author: "Koffi Tété",
      location: "Investisseur",
      initials: "KT"
    }
  ];

  const timelineItems = [
    { number: 1, title: "Analyse de votre projet", content: "Nous définissons ensemble vos objectifs, votre budget et votre capacité d'investissement." },
    { number: 2, title: "Étude du budget", content: "Analyse de votre capacité d'emprunt et optimisation de votre apport personnel." },
    { number: 3, title: "Recherche des biens", content: "Sélection de biens correspondant à vos critères et présentation des meilleures opportunités." },
    { number: 4, title: "Organisation des visites", content: "Planification et accompagnement lors des visites des biens sélectionnés." },
    { number: 5, title: "Négociation", content: "Négociation du prix d'achat et des conditions de vente en votre faveur." },
    { number: 6, title: "Assistance au financement", content: "Accompagnement dans vos démarches bancaires et comparaison des offres de crédit." },
    { number: 7, title: "Signature chez le notaire", content: "Présence et conseil lors de la signature de l'acte authentique de vente." },
    { number: 8, title: "Accompagnement après acquisition", content: "Support pour la mise en location, la gestion locative ou l'aménagement de votre bien." }
  ];

  const investmentSolutions = [
    { icon: "rect", title: "Appartement", description: "Idéal pour la location, les appartements offrent un rendement locatif attractif en zone urbaine." },
    { icon: "house", title: "Villa", description: "Pour les familles ou la location haut de gamme, les villas offrent un confort et une valorisation exceptionnelle." },
    { icon: "arrows", title: "Terrain", description: "Investissez dans le foncier pour construire ou revendre avec une plus-value significative." },
    { icon: "building", title: "Immeuble", description: "Pour les investisseurs confirmés, les immeubles de rapport garantissent un revenu locatif stable." },
    { icon: "office", title: "Local commercial", description: "Les bureaux et commerces offrent des baux longs et des loyers plus élevés que l'habitation." },
    { icon: "layers", title: "Programme neuf", description: "Profitez des avantages fiscaux et d'un bien clé en main avec les programmes neufs." },
    { icon: "house2", title: "Investissement locatif", description: "Optimisez votre fiscalité avec les dispositifs de défiscalisation immobilière." },
    { icon: "home", title: "Résidence principale", description: "Constituez votre patrimoine en devenant propriétaire de votre résidence principale." }
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
        telephone: '',
        motif: '',
        date: '',
        message: ''
      });
      setTimeout(closeRdvModal, 2000);
    } catch (error) {
      setRdvFormMsg("L'envoi a échoué. Vérifiez votre connexion et réessayez, ou contactez-nous directement par téléphone.");
    }
  };

  const handleSimulatorChange = (e) => {
    setSimulatorData({
      ...simulatorData,
      [e.target.name]: e.target.value
    });
  };

  const calculateInvestment = () => {
    const montantInvesti = parseFloat(simulatorData.montant_investi) || 0;
    const apport = parseFloat(simulatorData.apport) || 0;
    const duree = parseInt(simulatorData.duree) || 20;
    const taux = parseFloat(simulatorData.taux) || 4.5;
    const loyer = parseFloat(simulatorData.loyer) || 0;
    const charges = parseFloat(simulatorData.charges) || 0;

    if (montantInvesti === 0) {
      alert('Veuillez entrer le montant investi');
      return;
    }

    const montantEmprunte = montantInvesti - apport;
    const tauxMensuel = taux / 100 / 12;
    const nombreMois = duree * 12;

    let mensualite = 0;
    if (montantEmprunte > 0 && tauxMensuel > 0) {
      mensualite = montantEmprunte * (tauxMensuel * Math.pow(1 + tauxMensuel, nombreMois)) / (Math.pow(1 + tauxMensuel, nombreMois) - 1);
    } else if (montantEmprunte > 0) {
      mensualite = montantEmprunte / nombreMois;
    }

    const revenuNet = loyer - charges - mensualite;
    const revenuAnnuelBrut = loyer * 12;
    const rentabiliteBrute = montantInvesti > 0 ? (revenuAnnuelBrut / montantInvesti) * 100 : 0;
    const revenuAnnuelNet = revenuNet * 12;
    const rentabiliteNette = montantInvesti > 0 ? (revenuAnnuelNet / montantInvesti) * 100 : 0;

    setSimulatorResults({
      mensualite: mensualite.toLocaleString('fr-FR') + ' FCFA',
      revenuNet: revenuNet.toLocaleString('fr-FR') + ' FCFA',
      rentabiliteBrute: rentabiliteBrute.toFixed(2) + '%',
      rentabiliteNette: rentabiliteNette.toFixed(2) + '%'
    });
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

  const getIcon = (iconType) => {
    switch(iconType) {
      case 'rect':
        return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>;
      case 'house':
        return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>;
      case 'arrows':
        return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h20M2 12l5-5m0 10l-5-5M22 12l-5-5m0 10l5-5"></path></svg>;
      case 'building':
        return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M5 21V7l8-4 8 4v14M8 21v-9a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v9"></path></svg>;
      case 'office':
        return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>;
      case 'layers':
        return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>;
      case 'house2':
        return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>;
      case 'home':
        return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
      default:
        return null;
    }
  };

  return (
    <div>
      <Header onRdvClick={openRdvModal} />

      <section className="hero-section" style={{ backgroundImage: "url('/investir-dans-immobilier.png')" }}>
        <div className="hero-background" style={{ backgroundImage: "url('/investir-dans-immobilier.png')" }}></div>
        <div className="unified-hero-overlay"></div>
        <div className="hero-content-wrapper">
          <h1 className="hero-title">Investir dans l'Immobilier</h1>
          <p className="hero-subtitle">Construisez votre patrimoine immobilier avec nos experts</p>
          <div className="hero-buttons">
            <a href="#services-section" className="btn btn-primary btn-large">Découvrir nos solutions</a>
            <a href="#simulator-section" className="btn btn-secondary btn-large">Simulateur de rentabilité</a>
          </div>
        </div>
      </section>

      <section className="section advantages-section">
        <div className="container">
          <div className="section-head text-center">
            <h2>Pourquoi investir dans l'immobilier ?</h2>
            <p className="section-subtitle">Les avantages de l'investissement immobilier pour votre patrimoine</p>
          </div>
          <div className="advantages-grid">
            <div className="advantage-card">
              <div className="advantage-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <h3>Revenus locatifs</h3>
              <p>Générez des revenus réguliers grâce aux loyers perçus</p>
            </div>
            <div className="advantage-card">
              <div className="advantage-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <h3>Valorisation du bien</h3>
              <p>Bénéficiez de la plus-value à la revente du bien</p>
            </div>
            <div className="advantage-card">
              <div className="advantage-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <h3>Sécurité de l'investissement</h3>
              <p>L'immobilier est un placement stable et sécurisé</p>
            </div>
            <div className="advantage-card">
              <div className="advantage-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <h3>Préparation à la retraite</h3>
              <p>Constituez un patrimoine pour votre retraite</p>
            </div>
            <div className="advantage-card">
              <div className="advantage-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <h3>Effet de levier</h3>
              <p>Investissez avec un apport réduit grâce au crédit</p>
            </div>
            <div className="advantage-card">
              <div className="advantage-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <h3>Protection contre l'inflation</h3>
              <p>L'immobilier protège votre capital de l'inflation</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section why-us-section reveal visible">
        <div className="container">
          <div className="section-head text-center">
            <h2>Pourquoi nous choisir ?</h2>
            <p className="section-subtitle">Notre expertise pour réussir votre investissement immobilier</p>
          </div>
          <div className="why-us-cards-grid">
            <div className="why-us-card revealed">
              <div className="why-us-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <h3>Expertise du marché local</h3>
              <p>Connaissance approfondie du marché immobilier pour identifier les meilleures opportunités d'investissement dans chaque quartier.</p>
            </div>
            <div className="why-us-card revealed">
              <div className="why-us-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                </svg>
              </div>
              <h3>Accompagnement personnalisé</h3>
              <p>Un conseiller dédié vous guide de la définition de votre projet à la signature chez le notaire.</p>
            </div>
            <div className="why-us-card revealed">
              <div className="why-us-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
              <h3>Sélection rigoureuse des biens</h3>
              <p>Nous ne vous proposons que des biens avec un fort potentiel de valorisation et de rentabilité.</p>
            </div>
            <div className="why-us-card revealed">
              <div className="why-us-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
              </div>
              <h3>Réseau de partenaires</h3>
              <p>Accès à notre réseau de notaires, banques, artisans et experts pour faciliter votre projet.</p>
            </div>
            <div className="why-us-card revealed">
              <div className="why-us-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <h3>Assistance administrative</h3>
              <p>Nous gérons toutes les démarches administratives et juridiques pour vous simplifier la vie.</p>
            </div>
            <div className="why-us-card revealed">
              <div className="why-us-card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3>Suivi après acquisition</h3>
              <p>Nous restons à votre disposition après l'achat pour la gestion locative et l'optimisation de votre bien.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="services-section" className="section services-section">
        <div className="container">
          <div className="section-head text-center">
            <h2>Nos solutions d'investissement</h2>
            <p className="section-subtitle">Des solutions adaptées à tous les profils d'investisseurs</p>
          </div>
          <div className="services-grid">
            {investmentSolutions.map((solution, index) => (
              <div key={index} className="service-card">
                <div className="service-icon">
                  {getIcon(solution.icon)}
                </div>
                <h3>{solution.title}</h3>
                <p>{solution.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section timeline-section">
        <div className="container">
          <div className="section-head text-center">
            <h2>Notre processus d'accompagnement</h2>
            <p className="section-subtitle">Les étapes clés de votre projet d'investissement</p>
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

      <section id="simulator-section" className="section tinted simulator-section">
        <div className="container">
          <div className="section-head text-center">
            <h2>Simulateur de rentabilité</h2>
            <p className="section-subtitle">Calculez la rentabilité de votre investissement immobilier</p>
          </div>
          <div className="simulator-card">
            <form id="simulatorForm">
              <div className="form-grid-2">
                <div className="field">
                  <label>Montant investi (FCFA)</label>
                  <input type="number" name="montant_investi" placeholder="Ex: 50000000" value={simulatorData.montant_investi} onChange={handleSimulatorChange} />
                </div>
                <div className="field">
                  <label>Apport personnel (FCFA)</label>
                  <input type="number" name="apport" placeholder="Ex: 10000000" value={simulatorData.apport} onChange={handleSimulatorChange} />
                </div>
              </div>
              <div className="form-grid-2">
                <div className="field">
                  <label>Durée de l'emprunt (années)</label>
                  <select name="duree" value={simulatorData.duree} onChange={handleSimulatorChange}>
                    <option value="10">10 ans</option>
                    <option value="15">15 ans</option>
                    <option value="20">20 ans</option>
                    <option value="25">25 ans</option>
                  </select>
                </div>
                <div className="field">
                  <label>Taux d'intérêt annuel (%)</label>
                  <input type="number" name="taux" step="0.1" placeholder="Ex: 4.5" value={simulatorData.taux} onChange={handleSimulatorChange} />
                </div>
              </div>
              <div className="form-grid-2">
                <div className="field">
                  <label>Loyer mensuel estimé (FCFA)</label>
                  <input type="number" name="loyer" placeholder="Ex: 300000" value={simulatorData.loyer} onChange={handleSimulatorChange} />
                </div>
                <div className="field">
                  <label>Charges mensuelles (FCFA)</label>
                  <input type="number" name="charges" placeholder="Ex: 20000" value={simulatorData.charges} onChange={handleSimulatorChange} />
                </div>
              </div>
              <button type="button" className="btn btn-primary btn-large block" onClick={calculateInvestment}>Calculer la rentabilité</button>
            </form>
            {simulatorResults && (
              <div className="simulator-results" style={{ display: 'block' }}>
                <h3>Résultats de la simulation</h3>
                <div className="results-grid">
                  <div className="result-item">
                    <div className="result-label">Mensualité de crédit</div>
                    <div className="result-value">{simulatorResults.mensualite}</div>
                  </div>
                  <div className="result-item">
                    <div className="result-label">Revenu net mensuel</div>
                    <div className="result-value">{simulatorResults.revenuNet}</div>
                  </div>
                  <div className="result-item">
                    <div className="result-label">Rentabilité brute</div>
                    <div className="result-value">{simulatorResults.rentabiliteBrute}</div>
                  </div>
                  <div className="result-item">
                    <div className="result-label">Rentabilité nette</div>
                    <div className="result-value">{simulatorResults.rentabiliteNette}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section testimonials-section">
        <div className="container">
          <div className="section-head text-center">
            <h2>Témoignages</h2>
            <p className="section-subtitle">Ce que disent nos investisseurs</p>
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

      <section className="section faq-section">
        <div className="container">
          <div className="section-head text-center">
            <h2>Questions fréquentes</h2>
            <p className="section-subtitle">Retrouvez les réponses aux questions les plus fréquentes sur l'investissement immobilier</p>
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

      <section className="section cta-section">
        <div className="container text-center">
          <h2>Investissez dans l'immobilier en toute confiance</h2>
          <p className="cta-subtitle">Notre équipe d'experts vous accompagne dans tous vos projets d'investissement immobilier</p>
          <div className="cta-section-buttons">
            <button className="btn btn-primary" onClick={openRdvModal}>Prendre rendez-vous</button>
            <Link to="/contact#agencies" className="btn btn-secondary">Nous contacter</Link>
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
                <label>Téléphone</label>
                <input type="tel" name="telephone" required value={rdvFormData.telephone} onChange={handleRdvFormChange} />
              </div>
              <div className="field">
                <label>Motif</label>
                <select name="motif" required value={rdvFormData.motif} onChange={handleRdvFormChange}>
                  <option value="">Sélectionnez un motif</option>
                  <option value="achat">Achat immobilier</option>
                  <option value="vente">Vente immobilière</option>
                  <option value="location">Location</option>
                  <option value="gestion">Gestion locative</option>
                  <option value="investissement">Investissement immobilier</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              <div className="field">
                <label>Date souhaitée</label>
                <input type="date" name="date" required value={rdvFormData.date} onChange={handleRdvFormChange} />
              </div>
              <div className="field">
                <label>Message (optionnel)</label>
                <textarea name="message" rows="3" value={rdvFormData.message} onChange={handleRdvFormChange}></textarea>
              </div>
              <button type="submit" className="btn btn-primary">Envoyer ma demande</button>
              <div className="form-msg" id="rdvFormMsg">{rdvFormMsg}</div>
            </form>
          </div>
        </div>
      )}

      <WhatsAppFloat />
    </div>
  );
};

export default InvestirDansImmobilier;
