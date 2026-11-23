import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import '../styles/style.css';
import { createAppointment } from '../api/appointments';
import WhatsAppFloat from '../components/WhatsAppFloat';


const TransactionImmobiliere = () => {
  const navigate = useNavigate();
  const [activeBuyAccordion, setActiveBuyAccordion] = useState(null);
  const [activeRentAccordion, setActiveRentAccordion] = useState(null);
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

  const [buySearchData, setBuySearchData] = useState({
    type_bien: '',
    budget: '',
    zone: '',
    surface: '',
    pieces: '',
    email: ''
  });

  const [rentSearchData, setRentSearchData] = useState({
    type_bien: '',
    loyer: '',
    zone: '',
    surface: '',
    pieces: '',
    email: ''
  });

  const buyAccordionItems = [
    {
      number: 1,
      title: "Premier contact et définition du projet",
      content: "Prenez rendez-vous avec l'un de nos conseillers pour définir précisément votre projet : budget, localisation, type de bien, critères essentiels. Cette première étape nous permet de cibler les biens qui correspondent parfaitement à vos attentes."
    },
    {
      number: 2,
      title: "Sélection et visites des biens",
      content: "Nous vous proposons une sélection de biens correspondant à vos critères. Vous organisez les visites à votre rythme. Nos conseillers vous accompagnent pour répondre à toutes vos questions sur place."
    },
    {
      number: 3,
      title: "Offre d'achat et négociation",
      content: "Une fois le bien idéal trouvé, nous rédigeons votre offre d'achat et négocions les meilleures conditions pour vous. Notre expertise vous assure une transaction aux conditions optimales."
    },
    {
      number: 4,
      title: "Signature et formalités",
      content: "Nous vous accompagnons jusqu'à la signature de l'acte de vente. Notre équipe gère toutes les formalités administratives pour que vous puissiez prendre possession de votre bien en toute sérénité."
    }
  ];

  const rentAccordionItems = [
    {
      number: 1,
      title: "Définition de votre projet",
      content: "Exprimez vos besoins : budget, localisation préférée, type de logement, surface, équipements souhaités. Nos conseillers analysent votre demande pour vous proposer les biens les plus adaptés."
    },
    {
      number: 2,
      title: "Sélection et visites",
      content: "Nous vous présentons une sélection de logements correspondant à vos critères. Planifiez les visites à votre convenance. Nos équipes vous accompagnent pour découvrir les biens."
    },
    {
      number: 3,
      title: "Constitution du dossier",
      content: "Une fois le logement choisi, nous vous aidons à constituer votre dossier de location : pièces justificatives, garanties, documents financiers. Un dossier complet accélère la validation."
    },
    {
      number: 4,
      title: "Signature et remise des clés",
      content: "Signature du bail, état des lieux, remise des clés. Nous vous accompagnons jusqu'à votre installation dans votre nouveau logement pour une transition en douceur."
    }
  ];

  const toggleBuyAccordion = (index) => {
    setActiveBuyAccordion(activeBuyAccordion === index ? null : index);
  };

  const toggleRentAccordion = (index) => {
    setActiveRentAccordion(activeRentAccordion === index ? null : index);
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
      {
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
      }
    } catch (error) {
      setRdvFormMsg("L'envoi a échoué. Vérifiez votre connexion et réessayez, ou contactez-nous directement par téléphone.");
    }
  };

  const handleBuySearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.append('transaction', 'vente');
    if (buySearchData.type_bien) params.append('type_bien', buySearchData.type_bien);
    if (buySearchData.budget) params.append('budget_max', buySearchData.budget);
    if (buySearchData.zone) params.append('ville', buySearchData.zone);
    if (buySearchData.surface) params.append('surface_min', buySearchData.surface);
    if (buySearchData.pieces) params.append('chambres', buySearchData.pieces);
    navigate(`/nos-offres?${params.toString()}`);
  };

  const handleRentSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.append('transaction', 'location');
    if (rentSearchData.type_bien) params.append('type_bien', rentSearchData.type_bien);
    if (rentSearchData.loyer) params.append('budget_max', rentSearchData.loyer);
    if (rentSearchData.zone) params.append('ville', rentSearchData.zone);
    if (rentSearchData.surface) params.append('surface_min', rentSearchData.surface);
    if (rentSearchData.pieces) params.append('chambres', rentSearchData.pieces);
    navigate(`/nos-offres?${params.toString()}`);
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

      {/* HERO TRANSACTION IMMOBILIÈRE */}
      <section className="hero-section" style={{ backgroundImage: "url('/transaction-immobilère.png')" }}>
        <div className="hero-background" style={{ backgroundImage: "url('/transaction-immobilère.png')" }}></div>
        <div className="unified-hero-overlay"></div>
        <div className="hero-content-wrapper">
          <h1 className="hero-title">Transaction Immobilière</h1>
          <p className="hero-subtitle">Achetez ou louez votre bien idéal avec notre accompagnement personnalisé</p>
          <div className="hero-buttons">
            <a href="#acheter" className="btn btn-primary btn-large">Acheter</a>
            <a href="#louer" className="btn btn-secondary btn-large">Louer</a>
          </div>
        </div>
      </section>

      {/* SECTION ACHETER */}
      <section id="acheter" className="section advantages-section">
        <div className="container">
          <div className="section-head text-center">
            <h2>Acheter un bien</h2>
            <p className="section-subtitle">Trouvez la propriété de vos rêves parmi notre sélection</p>
          </div>
          <div className="advantages-grid">
            <div className="advantage-card">
              <div className="advantage-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
              </div>
              <h3>Large choix de biens</h3>
              <p>Une sélection variée de biens immobiliers correspondant à vos critères.</p>
            </div>
            <div className="advantage-card">
              <div className="advantage-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3>Conseillers dédiés</h3>
              <p>Des experts à votre écoute pour vous accompagner dans votre projet d'achat.</p>
            </div>
            <div className="advantage-card">
              <div className="advantage-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <h3>Visites flexibles</h3>
              <p>Organisez vos visites selon votre emploi du temps pour une prise de décision sereine.</p>
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
              <p>Nous gérons toutes les formalités pour vous permettre de vous concentrer sur l'essentiel.</p>
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
              <p>Nous négocions les meilleures conditions pour optimiser votre investissement.</p>
            </div>
            <div className="advantage-card">
              <div className="advantage-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3>Transactions sécurisées</h3>
              <p>Des procédures conformes et sécurisées pour une transaction en toute confiance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FORMULAIRE DE RECHERCHE ACHETER */}
      <section className="section tinted search-section">
        <div className="container">
          <div className="section-head text-center">
            <h2>Rechercher un bien à acheter</h2>
            <p className="section-subtitle">Trouvez le bien idéal pour votre projet</p>
          </div>
          <div className="search-form-card">
            <form id="buySearchForm" onSubmit={handleBuySearchSubmit}>
              <div className="form-grid-3">
                <div className="field">
                  <label>Type de bien</label>
                  <select name="type_bien" value={buySearchData.type_bien} onChange={(e) => setBuySearchData({...buySearchData, type_bien: e.target.value})}>
                    <option value="">Tous les types</option>
                    <option value="maison">Maison</option>
                    <option value="villa">Villa</option>
                    <option value="appartement">Appartement</option>
                    <option value="terrain">Terrain</option>
                    <option value="bureau">Bureau</option>
                    <option value="fonds_commerce">Fonds de commerce</option>
                  </select>
                </div>
                <div className="field">
                  <label>Budget maximum (FCFA)</label>
                  <select name="budget" value={buySearchData.budget} onChange={(e) => setBuySearchData({...buySearchData, budget: e.target.value})}>
                    <option value="">Sans limite</option>
                    <option value="5000000">5 millions</option>
                    <option value="10000000">10 millions</option>
                    <option value="20000000">20 millions</option>
                    <option value="50000000">50 millions</option>
                    <option value="100000000">100 millions</option>
                    <option value="100000000+">Plus de 100 millions</option>
                  </select>
                </div>
                <div className="field">
                  <label>Zone recherchée</label>
                  <input type="text" name="zone" placeholder="Quartier ou ville..." value={buySearchData.zone} onChange={(e) => setBuySearchData({...buySearchData, zone: e.target.value})} />
                </div>
              </div>
              <div className="form-grid-3">
                <div className="field">
                  <label>Surface minimale (m²)</label>
                  <select name="surface" value={buySearchData.surface} onChange={(e) => setBuySearchData({...buySearchData, surface: e.target.value})}>
                    <option value="">Toutes surfaces</option>
                    <option value="50">50 m²</option>
                    <option value="100">100 m²</option>
                    <option value="150">150 m²</option>
                    <option value="200">200 m²</option>
                    <option value="300">300 m²+</option>
                  </select>
                </div>
                <div className="field">
                  <label>Nombre de pièces</label>
                  <select name="pieces" value={buySearchData.pieces} onChange={(e) => setBuySearchData({...buySearchData, pieces: e.target.value})}>
                    <option value="">Tous</option>
                    <option value="1">1 pièce</option>
                    <option value="2">2 pièces</option>
                    <option value="3">3 pièces</option>
                    <option value="4">4 pièces</option>
                    <option value="5">5 pièces+</option>
                  </select>
                </div>
                <div className="field">
                  <label>Votre email</label>
                  <input type="email" name="email" placeholder="Pour recevoir les offres..." value={buySearchData.email} onChange={(e) => setBuySearchData({...buySearchData, email: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary block">Rechercher</button>
            </form>
          </div>
        </div>
      </section>

      {/* ETAPE DE L'ACHAT (ACCORDÉON) */}
      <section className="section steps-section">
        <div className="container">
          <div className="section-head text-center">
            <h2>Notre processus d'acquisition</h2>
            <p className="section-subtitle">Notre processus d'acquisition en 4 étapes</p>
          </div>
          <div className="accordion">
            {buyAccordionItems.map((item, index) => (
              <div key={index} className={`accordion-item ${activeBuyAccordion === index ? 'active' : ''}`}>
                <button className="accordion-header" onClick={() => toggleBuyAccordion(index)}>
                  <span className="accordion-number">{item.number}</span>
                  <span className="accordion-title">{item.title}</span>
                  <svg className="accordion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                <div className="accordion-content">
                  <p>{item.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SÉPARATEUR ÉLÉGANT */}
      <section className="section separator-section">
        <div className="container">
          <div className="separator-line"></div>
        </div>
      </section>

      {/* SECTION LOUER */}
      <section id="louer" className="section advantages-section">
        <div className="container">
          <div className="section-head text-center">
            <h2>Louer un bien</h2>
            <p className="section-subtitle">Trouvez le logement parfait pour votre installation</p>
          </div>
          <div className="advantages-grid">
            <div className="advantage-card">
              <div className="advantage-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
              <h3>Large choix de logements</h3>
              <p>Appartements, maisons, villas et bureaux dans les meilleurs quartiers de la ville.</p>
            </div>
            <div className="advantage-card">
              <div className="advantage-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3>Conseillers dédiés</h3>
              <p>Des experts à votre écoute pour comprendre vos besoins et vous proposer les biens adaptés.</p>
            </div>
            <div className="advantage-card">
              <div className="advantage-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <h3>Visites rapides</h3>
              <p>Organisez vos visites rapidement selon votre agenda pour accélérer votre installation.</p>
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
              <h3>Dossiers simplifiés</h3>
              <p>Nous vous guidons dans la constitution de votre dossier de location pour une validation rapide.</p>
            </div>
            <div className="advantage-card">
              <div className="advantage-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                  <line x1="1" y1="10" x2="23" y2="10"></line>
                </svg>
              </div>
              <h3>Loyers transparents</h3>
              <p>Prix clairs et sans surprise. Tous les frais sont communiqués dès le début.</p>
            </div>
            <div className="advantage-card">
              <div className="advantage-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3>Contrats sécurisés</h3>
              <p>Baux conformes à la législation en vigueur pour une location en toute sérénité.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FORMULAIRE DE RECHERCHE LOUER */}
      <section className="section tinted search-section">
        <div className="container">
          <div className="section-head text-center">
            <h2>Rechercher un bien à louer</h2>
            <p className="section-subtitle">Trouvez le logement idéal pour votre installation</p>
          </div>
          <div className="search-form-card">
            <form id="rentSearchForm" onSubmit={handleRentSearchSubmit}>
              <div className="form-grid-3">
                <div className="field">
                  <label>Type de bien</label>
                  <select name="type_bien" value={rentSearchData.type_bien} onChange={(e) => setRentSearchData({...rentSearchData, type_bien: e.target.value})}>
                    <option value="">Tous les types</option>
                    <option value="appartement">Appartement</option>
                    <option value="maison">Maison</option>
                    <option value="villa">Villa</option>
                    <option value="bureau">Bureau</option>
                    <option value="studio">Studio</option>
                  </select>
                </div>
                <div className="field">
                  <label>Loyer maximum (FCFA/mois)</label>
                  <select name="loyer" value={rentSearchData.loyer} onChange={(e) => setRentSearchData({...rentSearchData, loyer: e.target.value})}>
                    <option value="">Sans limite</option>
                    <option value="100000">100 000 FCFA</option>
                    <option value="200000">200 000 FCFA</option>
                    <option value="300000">300 000 FCFA</option>
                    <option value="500000">500 000 FCFA</option>
                    <option value="750000">750 000 FCFA</option>
                    <option value="1000000+">Plus de 1M FCFA</option>
                  </select>
                </div>
                <div className="field">
                  <label>Zone recherchée</label>
                  <input type="text" name="zone" placeholder="Quartier ou ville..." value={rentSearchData.zone} onChange={(e) => setRentSearchData({...rentSearchData, zone: e.target.value})} />
                </div>
              </div>
              <div className="form-grid-3">
                <div className="field">
                  <label>Surface minimale (m²)</label>
                  <select name="surface" value={rentSearchData.surface} onChange={(e) => setRentSearchData({...rentSearchData, surface: e.target.value})}>
                    <option value="">Toutes surfaces</option>
                    <option value="30">30 m²</option>
                    <option value="50">50 m²</option>
                    <option value="80">80 m²</option>
                    <option value="100">100 m²</option>
                    <option value="150">150 m²+</option>
                  </select>
                </div>
                <div className="field">
                  <label>Nombre de pièces</label>
                  <select name="pieces" value={rentSearchData.pieces} onChange={(e) => setRentSearchData({...rentSearchData, pieces: e.target.value})}>
                    <option value="">Tous</option>
                    <option value="1">1 pièce (studio)</option>
                    <option value="2">2 pièces</option>
                    <option value="3">3 pièces</option>
                    <option value="4">4 pièces</option>
                    <option value="5">5 pièces+</option>
                  </select>
                </div>
                <div className="field">
                  <label>Votre email</label>
                  <input type="email" name="email" placeholder="Pour recevoir les offres..." value={rentSearchData.email} onChange={(e) => setRentSearchData({...rentSearchData, email: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary block">Rechercher</button>
            </form>
          </div>
        </div>
      </section>

      {/* ÉTAPES DE LA LOCATION (ACCORDÉON) */}
      <section className="section steps-section">
        <div className="container">
          <div className="section-head text-center">
            <h2>Notre processus de location</h2>
            <p className="section-subtitle">Notre processus de location en 4 étapes</p>
          </div>
          <div className="accordion">
            {rentAccordionItems.map((item, index) => (
              <div key={index} className={`accordion-item ${activeRentAccordion === index ? 'active' : ''}`}>
                <button className="accordion-header" onClick={() => toggleRentAccordion(index)}>
                  <span className="accordion-number">{item.number}</span>
                  <span className="accordion-title">{item.title}</span>
                  <svg className="accordion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                <div className="accordion-content">
                  <p>{item.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="section cta-section">
        <div className="container text-center">
          <h2>Confiez-nous votre projet immobilier</h2>
          <p className="cta-subtitle">Notre équipe est prête à vous accompagner dans la réalisation de tous vos projets immobiliers avec professionnalisme et engagement.</p>
          <div className="cta-section-buttons">
            <Link to="/nos-offres#biens" className="btn btn-primary">Découvrir nos offres</Link>
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
                <label>Nom</label>
                <input type="text" name="nom" required value={rdvFormData.nom} onChange={handleRdvFormChange} />
              </div>
              <div className="field">
                <label>Email</label>
                <input type="email" name="email" required value={rdvFormData.email} onChange={handleRdvFormChange} />
              </div>
              <div className="field">
                <label>Motif</label>
                <select name="motif" required value={rdvFormData.motif} onChange={handleRdvFormChange}>
                  <option value="">Motif</option>
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
                  <label>Date</label>
                  <input type="date" name="date" required value={rdvFormData.date} onChange={handleRdvFormChange} />
                </div>
                <div className="field">
                  <label>Créneau</label>
                  <select name="creneau" required value={rdvFormData.creneau} onChange={handleRdvFormChange}>
                    <option value="">Créneau</option>
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
                <label>Message</label>
                <textarea name="message" placeholder="Précisez votre besoin si vous le souhaitez." value={rdvFormData.message} onChange={handleRdvFormChange}></textarea>
              </div>
              <button type="submit" className="btn btn-primary block" id="rdvSubmitBtn">Envoyer</button>
              <p className="form-msg" id="rdvFormMsg">{rdvFormMsg}</p>
            </form>
          </div>
        </div>
      )}

      <WhatsAppFloat />
    </div>
  );
};

export default TransactionImmobiliere;
