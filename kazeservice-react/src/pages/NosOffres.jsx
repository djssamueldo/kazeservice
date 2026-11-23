import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import PropertyListCard from '../components/PropertyListCard';
import { formatDateRelative, sortPropertiesByDate, PROPERTY_TYPES } from '../data/propertyTypes';
import { getProperties } from '../api/properties';
import { createAppointment } from '../api/appointments';
import { submitMessage } from '../api/messages';
import { validateEmail, validateTelephone, validateText } from '../lib/validators';
import '../styles/style.css';

const NosOffres = () => {
  const [searchParams] = useSearchParams();
  const [isRdvModalOpen, setIsRdvModalOpen] = useState(false);
  const biensRef = useRef(null);
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


  const [searchFormData, setSearchFormData] = useState({
    transaction: 'all',
    type_bien: '',
    ville: '',
    quartier: '',
    budget_min: '',
    budget_max: '',
    surface_min: '',
    surface_max: '',
    chambres: '',
    sdb: '',
    reference: '',
    parking: false,
    piscine: false,
    jardin: false,
    salons: '',
    cuisines: '',
    wc: '',
    meuble: '',
    climatisation: '',
    terrasse: '',
    chauffage: '',
    jardin_select: '',
    piscine_select: '',
    garage: '',
    balcon: '',
    cuisine_equipee: '',
    vue_mer: '',
    vue_montagne: '',
    ascenseur: '',
    fibre: '',
    tri: 'pertinence'
  });

  const [quickContactData, setQuickContactData] = useState({
    nom: '',
    email: '',
    telephone: '',
    message: ''
  });
  const [quickContactMessage, setQuickContactMessage] = useState('');
  const [isQuickContactSubmitting, setIsQuickContactSubmitting] = useState(false);

  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [currentQuickFilter, setCurrentQuickFilter] = useState('all');
  const [currentView, setCurrentView] = useState('grid');
  const [currentSort, setCurrentSort] = useState('recent');
  const [allProperties, setAllProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);

  useEffect(() => {
    getProperties().then((props) => {
      const sorted = sortPropertiesByDate(props);
      setAllProperties(sorted);
      setFilteredProperties(sorted);
    });
  }, []);

  useEffect(() => {
    const transaction = searchParams.get('transaction');
    const typeBien = searchParams.get('type_bien');
    const budgetMax = searchParams.get('budget_max');
    const ville = searchParams.get('ville');
    const surfaceMin = searchParams.get('surface_min');
    const chambres = searchParams.get('chambres');

    if (transaction || typeBien || budgetMax || ville || surfaceMin || chambres) {
      const newFormData = {
        ...searchFormData,
        transaction: transaction || 'all',
        type_bien: typeBien || '',
        budget_max: budgetMax || '',
        ville: ville || '',
        surface_min: surfaceMin || '',
        chambres: chambres || ''
      };
      setSearchFormData(newFormData);
      setCurrentPage(1);
    }
  }, [searchParams]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#biens' && biensRef.current) {
        setTimeout(() => {
          const headerHeight = 80;
          const elementPosition = biensRef.current.getBoundingClientRect().top;
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

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const filterProperties = () => {
    const criteria = searchFormData;
    let filtered = [...allProperties];

    filtered = filtered.filter(p => {
      if (criteria.transaction && criteria.transaction !== 'all') {
        if (p.type !== criteria.transaction) return false;
      }

      if (currentQuickFilter !== 'all') {
        if (currentQuickFilter === 'vente' || currentQuickFilter === 'location') {
          if (p.type !== currentQuickFilter) return false;
        } else if (PROPERTY_TYPES[currentQuickFilter]) {
          // currentQuickFilter est un type de bien (maison, appartement, etc.)
          if (p.type_bien !== currentQuickFilter) return false;
        }
      }

      if (criteria.type_bien && p.type_bien !== criteria.type_bien) return false;

      if (criteria.ville && !p.ville.toLowerCase().includes(criteria.ville.toLowerCase())) return false;

      const price = priceToNumber(p.prix);
      if (criteria.budget_min && price < parseInt(criteria.budget_min)) return false;
      if (criteria.budget_max && price > parseInt(criteria.budget_max)) return false;

      const surface = surfaceToNumber(p.surface);
      if (criteria.surface_min && surface < parseInt(criteria.surface_min)) return false;
      if (criteria.surface_max && surface > parseInt(criteria.surface_max)) return false;

      if (criteria.chambres && (!p.chambres || p.chambres < parseInt(criteria.chambres))) return false;

      if (criteria.sdb && (!p.sdb || p.sdb < parseInt(criteria.sdb))) return false;

      if (criteria.parking && !p.garage) return false;
      if (criteria.piscine && !p.piscine) return false;
      if (criteria.jardin && !p.jardin) return false;

      if (criteria.reference && p.id !== criteria.reference) return false;

      if (criteria.salons && criteria.salons !== '') {
        if (!p.salons || p.salons < parseInt(criteria.salons)) return false;
      }

      if (criteria.cuisines && criteria.cuisines !== '') {
        if (!p.cuisines || p.cuisines < parseInt(criteria.cuisines)) return false;
      }

      if (criteria.wc && criteria.wc !== '') {
        if (!p.wc || p.wc < parseInt(criteria.wc)) return false;
      }

      if (criteria.meuble && criteria.meuble !== '') {
        if (criteria.meuble === 'oui' && !p.meuble) return false;
        if (criteria.meuble === 'non' && p.meuble) return false;
      }

      if (criteria.climatisation && criteria.climatisation !== '') {
        if (criteria.climatisation === 'oui' && !p.climatisation) return false;
        if (criteria.climatisation === 'non' && p.climatisation) return false;
      }

      if (criteria.chauffage && criteria.chauffage !== '') {
        if (criteria.chauffage === 'oui' && !p.chauffage) return false;
        if (criteria.chauffage === 'non' && p.chauffage) return false;
      }

      if (criteria.terrasse && criteria.terrasse !== '') {
        if (criteria.terrasse === 'oui' && !p.terrasse) return false;
        if (criteria.terrasse === 'non' && p.terrasse) return false;
      }

      if (criteria.garage && criteria.garage !== '') {
        if (criteria.garage === 'oui' && !p.garage) return false;
        if (criteria.garage === 'non' && p.garage) return false;
        if (!isNaN(criteria.garage) && (!p.garage || p.garage < parseInt(criteria.garage))) return false;
      }

      if (criteria.parking && criteria.parking !== '') {
        if (!isNaN(criteria.parking) && (!p.parking || p.parking < parseInt(criteria.parking))) return false;
      }

      if (criteria.jardin_select && criteria.jardin_select !== '') {
        if (criteria.jardin_select === 'oui' && !p.jardin) return false;
        if (criteria.jardin_select === 'non' && p.jardin) return false;
      }

      if (criteria.piscine_select && criteria.piscine_select !== '') {
        if (criteria.piscine_select === 'oui' && !p.piscine) return false;
        if (criteria.piscine_select === 'non' && p.piscine) return false;
      }

      if (criteria.balcon && criteria.balcon !== '') {
        if (criteria.balcon === 'oui' && !p.balcon) return false;
        if (criteria.balcon === 'non' && p.balcon) return false;
      }

      if (criteria.cuisine_equipee && criteria.cuisine_equipee !== '') {
        if (criteria.cuisine_equipee === 'oui' && !p.cuisine_equipee) return false;
        if (criteria.cuisine_equipee === 'non' && p.cuisine_equipee) return false;
      }

      if (criteria.vue_mer && criteria.vue_mer !== '') {
        if (criteria.vue_mer === 'oui' && !p.vue_mer) return false;
        if (criteria.vue_mer === 'non' && p.vue_mer) return false;
      }

      if (criteria.vue_montagne && criteria.vue_montagne !== '') {
        if (criteria.vue_montagne === 'oui' && !p.vue_montagne) return false;
        if (criteria.vue_montagne === 'non' && p.vue_montagne) return false;
      }

      if (criteria.ascenseur && criteria.ascenseur !== '') {
        if (criteria.ascenseur === 'oui' && !p.ascenseur) return false;
        if (criteria.ascenseur === 'non' && p.ascenseur) return false;
      }

      if (criteria.fibre && criteria.fibre !== '') {
        if (criteria.fibre === 'oui' && !p.fibre) return false;
        if (criteria.fibre === 'non' && p.fibre) return false;
      }

      return true;
    });

    // Tri unifié utilisant currentSort
    if (currentSort === 'recent') {
      filtered.sort((a, b) => new Date(b.created_at || b.published_at || 0) - new Date(a.created_at || a.published_at || 0));
    } else if (currentSort === 'ancien') {
      filtered.sort((a, b) => new Date(a.created_at || a.published_at || 0) - new Date(b.created_at || b.published_at || 0));
    } else if (currentSort === 'prix_asc') {
      filtered.sort((a, b) => priceToNumber(a.prix) - priceToNumber(b.prix));
    } else if (currentSort === 'prix_desc') {
      filtered.sort((a, b) => priceToNumber(b.prix) - priceToNumber(a.prix));
    } else if (currentSort === 'surface_asc') {
      filtered.sort((a, b) => surfaceToNumber(a.surface) - surfaceToNumber(b.surface));
    } else if (currentSort === 'surface_desc') {
      filtered.sort((a, b) => surfaceToNumber(b.surface) - surfaceToNumber(a.surface));
    } else if (currentSort === 'alpha') {
      filtered.sort((a, b) => a.titre.localeCompare(b.titre));
    }

    setFilteredProperties(filtered);
  };

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProperties = filteredProperties.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchFormData, currentQuickFilter]);

  const priceToNumber = (priceStr) => {
    const digits = (priceStr || '').replace(/[^\d]/g, '');
    return digits ? parseInt(digits) : 0;
  };

  const surfaceToNumber = (surfaceStr) => {
    if (typeof surfaceStr === 'number') return surfaceStr;
    const str = String(surfaceStr || '');
    const digits = str.replace(/[^\d]/g, '');
    return digits ? parseInt(digits) : 0;
  };

  useEffect(() => {
    filterProperties();
  }, [searchFormData, currentQuickFilter, currentSort, allProperties]);

  const handleSearchChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSearchFormData({
      ...searchFormData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleQuickContactChange = (e) => {
    setQuickContactData({
      ...quickContactData,
      [e.target.name]: e.target.value
    });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('Recherche avec critères:', searchFormData);
  };

  const handleQuickContactSubmit = async (e) => {
    e.preventDefault();

    // Validation des champs
    const nomValidation = validateText(quickContactData.nom, { required: true, minLength: 2, fieldName: 'Nom' });
    if (!nomValidation.isValid) {
      setQuickContactMessage(nomValidation.error);
      return;
    }

    const emailValidation = validateEmail(quickContactData.email);
    if (!emailValidation.isValid) {
      setQuickContactMessage(emailValidation.error);
      return;
    }

    const telephoneValidation = validateTelephone(quickContactData.telephone);
    if (!telephoneValidation.isValid) {
      setQuickContactMessage(telephoneValidation.error);
      return;
    }

    const messageValidation = validateText(quickContactData.message, { required: true, minLength: 10, fieldName: 'Message' });
    if (!messageValidation.isValid) {
      setQuickContactMessage(messageValidation.error);
      return;
    }

    setIsQuickContactSubmitting(true);
    setQuickContactMessage('Envoi en cours...');

    try {
      await submitMessage('recherche_bien', {
        nom: quickContactData.nom,
        email: quickContactData.email,
        telephone: quickContactData.telephone,
        message: quickContactData.message,
      });

      setQuickContactMessage('Votre demande a été envoyée avec succès. Nous vous contacterons dès qu\'un bien correspondant sera disponible.');
      setQuickContactData({
        nom: '',
        email: '',
        telephone: '',
        message: ''
      });

      setTimeout(() => {
        setQuickContactMessage('');
      }, 5000);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      setQuickContactMessage('Une erreur est survenue lors de l\'envoi de votre message. Veuillez réessayer.');
    } finally {
      setIsQuickContactSubmitting(false);
    }
  };

  const resetFilters = () => {
    setSearchFormData({
      transaction: 'all',
      type_bien: '',
      ville: '',
      quartier: '',
      budget_min: '',
      budget_max: '',
      surface_min: '',
      surface_max: '',
      chambres: '',
      sdb: '',
      reference: '',
      parking: false,
      piscine: false,
      jardin: false,
      salons: '',
      cuisines: '',
      wc: '',
      meuble: '',
      climatisation: '',
      terrasse: '',
      chauffage: '',
      jardin_select: '',
      piscine_select: '',
      garage: '',
      balcon: '',
      cuisine_equipee: '',
      vue_mer: '',
      vue_montagne: '',
      ascenseur: '',
      fibre: '',
      tri: 'pertinence'
    });
    setCurrentQuickFilter('all');
    setFilteredProperties(allProperties);
  };

  const toggleAdvanced = () => {
    setIsAdvancedOpen(!isAdvancedOpen);
  };

  const setQuickFilter = (filter) => {
    setCurrentQuickFilter(filter);
  };

  const setView = (view) => {
    setCurrentView(view);
  };

  const handleSortChange = (e) => {
    setCurrentSort(e.target.value);
  };

  const scrollToProperties = () => {
    const propertiesSection = document.querySelector('.properties-results-section');
    if (propertiesSection) {
      propertiesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToSearch = () => {
    const searchSection = document.querySelector('.search-section');
    if (searchSection) {
      searchSection.scrollIntoView({ behavior: 'smooth' });
    }
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

  return (
    <div>
      <Header onRdvClick={openRdvModal} />

      {/* HERO NOS OFFRES */}
      <section className="hero-section" style={{ backgroundImage: "url('/nos offres.png')" }}>
        <div className="hero-background" style={{ backgroundImage: "url('/nos offres.png')" }}></div>
        <div className="unified-hero-overlay"></div>
        <div className="hero-content-wrapper">
          <h1 className="hero-title">Nos Offres</h1>
          <p className="hero-subtitle">Découvrez notre sélection de biens immobiliers</p>
          <div className="hero-buttons">
            <button onClick={scrollToProperties} className="btn btn-primary btn-large">Rechercher un bien</button>
            <Link to="/contact#agencies" className="btn btn-secondary btn-large">Nous contacter</Link>
          </div>
        </div>
      </section>

      {/* MOTEUR DE RECHERCHE AVANCÉ */}
      <section className="section search-section">
        <div className="container">
          <div className="search-container">
            <form id="advancedSearchForm" className="advanced-search-form" onSubmit={handleSearchSubmit}>
              {/* Première ligne : Transaction, Type, Ville, Quartier */}
              <div className="search-row">
                <div className="search-field">
                  <label>Transaction</label>
                  <select name="transaction" id="transactionSelect" data-type-field="true" value={searchFormData.transaction} onChange={handleSearchChange}>
                    <option value="all">Toutes</option>
                    <option value="vente">Achat</option>
                    <option value="location">Location</option>
                  </select>
                </div>

                <div className="search-field">
                  <label>Type de bien</label>
                  <select name="type_bien" value={searchFormData.type_bien} onChange={handleSearchChange}>
                    <option value="">Tous les types</option>
                    {Object.entries(PROPERTY_TYPES).map(([key, config]) => (
                      <option key={key} value={key}>{config.label}</option>
                    ))}
                  </select>
                </div>

                <div className="search-field">
                  <label>Ville</label>
                  <input type="text" name="ville" placeholder="Ex: Lomé" value={searchFormData.ville} onChange={handleSearchChange} />
                </div>

                <div className="search-field">
                  <label>Quartier</label>
                  <input type="text" name="quartier" placeholder="Ex: Agoè" value={searchFormData.quartier} onChange={handleSearchChange} />
                </div>
              </div>

              {/* Deuxième ligne : Budgets et Surfaces */}
              <div className="search-row">
                <div className="search-field">
                  <label>Budget minimum (FCFA)</label>
                  <input type="number" name="budget_min" placeholder="Ex: 5000000" value={searchFormData.budget_min} onChange={handleSearchChange} />
                </div>

                <div className="search-field">
                  <label>Budget maximum (FCFA)</label>
                  <input type="number" name="budget_max" placeholder="Ex: 50000000" value={searchFormData.budget_max} onChange={handleSearchChange} />
                </div>

                <div className="search-field">
                  <label>Surface minimum (m²)</label>
                  <input type="number" name="surface_min" placeholder="Ex: 50" value={searchFormData.surface_min} onChange={handleSearchChange} />
                </div>

                <div className="search-field">
                  <label>Surface maximum (m²)</label>
                  <input type="number" name="surface_max" placeholder="Ex: 200" value={searchFormData.surface_max} onChange={handleSearchChange} />
                </div>
              </div>

              {/* Troisième ligne : Chambres, SDB, Référence, Options */}
              <div className="search-row">
                <div className="search-field">
                  <label>Chambres</label>
                  <select name="chambres" value={searchFormData.chambres} onChange={handleSearchChange}>
                    <option value="">Tous</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5+</option>
                  </select>
                </div>

                <div className="search-field">
                  <label>Salles de bain</label>
                  <select name="sdb" value={searchFormData.sdb} onChange={handleSearchChange}>
                    <option value="">Tous</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3+</option>
                  </select>
                </div>

                <div className="search-field">
                  <label>Référence</label>
                  <input type="text" name="reference" placeholder="Ex: REF-001" value={searchFormData.reference} onChange={handleSearchChange} />
                </div>

                <div className="search-field search-field-options">
                  <label>Options</label>
                  <div className="search-chips">
                    <input type="checkbox" name="parking" id="chip-parking" className="search-chip-input" checked={searchFormData.parking} onChange={handleSearchChange} />
                    <label htmlFor="chip-parking" className="search-chip">
                      <span className="search-chip-text">Parking</span>
                    </label>

                    <input type="checkbox" name="piscine" id="chip-piscine" className="search-chip-input" checked={searchFormData.piscine} onChange={handleSearchChange} />
                    <label htmlFor="chip-piscine" className="search-chip">
                      <span className="search-chip-text">Piscine</span>
                    </label>

                    <input type="checkbox" name="jardin" id="chip-jardin" className="search-chip-input" checked={searchFormData.jardin} onChange={handleSearchChange} />
                    <label htmlFor="chip-jardin" className="search-chip">
                      <span className="search-chip-text">Jardin</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Recherche avancée */}
              <div className="search-advanced-toggle">
                <button type="button" className="search-advanced-btn" onClick={toggleAdvanced}>
                  <span className="search-advanced-arrow">{isAdvancedOpen ? '▲' : '▼'}</span>
                  <span className="search-advanced-text">Recherche avancée</span>
                </button>
              </div>

              {isAdvancedOpen && (
                <div className={`search-advanced-content ${isAdvancedOpen ? 'open' : ''}`} id="advancedContent">
                  <div className="search-advanced-grid">
                    <div className="search-field">
                      <label>Salons</label>
                      <select name="salons" value={searchFormData.salons} onChange={handleSearchChange}>
                        <option value="">Tous</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3+</option>
                      </select>
                    </div>

                    <div className="search-field">
                      <label>Cuisines</label>
                      <select name="cuisines" value={searchFormData.cuisines} onChange={handleSearchChange}>
                        <option value="">Tous</option>
                        <option value="1">1</option>
                        <option value="2">2+</option>
                      </select>
                    </div>

                    <div className="search-field">
                      <label>WC</label>
                      <select name="wc" value={searchFormData.wc} onChange={handleSearchChange}>
                        <option value="">Tous</option>
                        <option value="1">1</option>
                        <option value="2">2+</option>
                      </select>
                    </div>

                    <div className="search-field">
                      <label>Meublé</label>
                      <select name="meuble" value={searchFormData.meuble} onChange={handleSearchChange}>
                        <option value="">Tous</option>
                        <option value="oui">Oui</option>
                        <option value="non">Non</option>
                      </select>
                    </div>

                    <div className="search-field">
                      <label>Climatisation</label>
                      <select name="climatisation" value={searchFormData.climatisation} onChange={handleSearchChange}>
                        <option value="">Tous</option>
                        <option value="oui">Oui</option>
                        <option value="non">Non</option>
                      </select>
                    </div>

                    <div className="search-field">
                      <label>Terrasse</label>
                      <select name="terrasse" value={searchFormData.terrasse} onChange={handleSearchChange}>
                        <option value="">Tous</option>
                        <option value="oui">Oui</option>
                        <option value="non">Non</option>
                      </select>
                    </div>

                    <div className="search-field">
                      <label>Chauffage</label>
                      <select name="chauffage" value={searchFormData.chauffage} onChange={handleSearchChange}>
                        <option value="">Tous</option>
                        <option value="oui">Oui</option>
                        <option value="non">Non</option>
                      </select>
                    </div>

                    <div className="search-field">
                      <label>Jardin</label>
                      <select name="jardin_select" value={searchFormData.jardin_select} onChange={handleSearchChange}>
                        <option value="">Tous</option>
                        <option value="oui">Oui</option>
                        <option value="non">Non</option>
                      </select>
                    </div>

                    <div className="search-field">
                      <label>Piscine</label>
                      <select name="piscine_select" value={searchFormData.piscine_select} onChange={handleSearchChange}>
                        <option value="">Tous</option>
                        <option value="oui">Oui</option>
                        <option value="non">Non</option>
                      </select>
                    </div>

                    <div className="search-field">
                      <label>Garage</label>
                      <select name="garage" value={searchFormData.garage} onChange={handleSearchChange}>
                        <option value="">Tous</option>
                        <option value="1">1</option>
                        <option value="2">2+</option>
                      </select>
                    </div>

                    <div className="search-field">
                      <label>Parking</label>
                      <select name="parking_select" value={searchFormData.parking_select} onChange={handleSearchChange}>
                        <option value="">Tous</option>
                        <option value="1">1</option>
                        <option value="2">2+</option>
                      </select>
                    </div>

                    <div className="search-field">
                      <label>Balcon</label>
                      <select name="balcon" value={searchFormData.balcon} onChange={handleSearchChange}>
                        <option value="">Tous</option>
                        <option value="oui">Oui</option>
                        <option value="non">Non</option>
                      </select>
                    </div>

                    <div className="search-field">
                      <label>Cuisine équipée</label>
                      <select name="cuisine_equipee" value={searchFormData.cuisine_equipee} onChange={handleSearchChange}>
                        <option value="">Tous</option>
                        <option value="oui">Oui</option>
                        <option value="non">Non</option>
                      </select>
                    </div>

                    <div className="search-field">
                      <label>Vue mer</label>
                      <select name="vue_mer" value={searchFormData.vue_mer} onChange={handleSearchChange}>
                        <option value="">Tous</option>
                        <option value="oui">Oui</option>
                        <option value="non">Non</option>
                      </select>
                    </div>

                    <div className="search-field">
                      <label>Vue montagne</label>
                      <select name="vue_montagne" value={searchFormData.vue_montagne} onChange={handleSearchChange}>
                        <option value="">Tous</option>
                        <option value="oui">Oui</option>
                        <option value="non">Non</option>
                      </select>
                    </div>

                    <div className="search-field">
                      <label>Ascenseur</label>
                      <select name="ascenseur" value={searchFormData.ascenseur} onChange={handleSearchChange}>
                        <option value="">Tous</option>
                        <option value="oui">Oui</option>
                        <option value="non">Non</option>
                      </select>
                    </div>

                    <div className="search-field">
                      <label>Fibre</label>
                      <select name="fibre" value={searchFormData.fibre} onChange={handleSearchChange}>
                        <option value="">Tous</option>
                        <option value="oui">Oui</option>
                        <option value="non">Non</option>
                      </select>
                    </div>

                    <div className="search-field">
                      <label>Tri</label>
                      <select name="tri" value={searchFormData.tri} onChange={handleSearchChange}>
                        <option value="pertinence">Pertinence</option>
                        <option value="prix_asc">Prix croissant</option>
                        <option value="prix_desc">Prix décroissant</option>
                        <option value="surface_asc">Surface croissante</option>
                        <option value="surface_desc">Surface décroissante</option>
                        <option value="date_desc">Plus récents</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Boutons d'action */}
              <div className="search-actions">
                <button type="submit" className="btn btn-primary search-submit">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  Rechercher
                </button>
                <button type="button" className="btn btn-secondary search-reset" onClick={resetFilters}>
                  Réinitialiser
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* BARRE DE FILTRES RAPIDE */}
      <section className="section quick-filters-section">
        <div className="container">
          <div className="quick-filters-bar">
            <button className={`quick-filter ${currentQuickFilter === 'all' ? 'active' : ''}`} onClick={() => setQuickFilter('all')}>Tous</button>
            <button className={`quick-filter ${currentQuickFilter === 'vente' ? 'active' : ''}`} onClick={() => setQuickFilter('vente')}>Achat</button>
            <button className={`quick-filter ${currentQuickFilter === 'location' ? 'active' : ''}`} onClick={() => setQuickFilter('location')}>Location</button>
            {Object.entries(PROPERTY_TYPES).map(([key, config]) => (
              <button key={key} className={`quick-filter ${currentQuickFilter === key ? 'active' : ''}`} onClick={() => setQuickFilter(key)}>
                {config.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* RÉSULTATS */}
      <section className="section properties-results-section" id="biens" ref={biensRef}>
        <div className="container">
          <div className="results-header">
            <div className="results-count">
              <span id="resultsCount">{filteredProperties.length}</span> biens
            </div>
            <div className="results-controls">
              <div className="view-toggle">
                <button className={`view-btn ${currentView === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')} aria-label="Vue grille">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                </button>
                <button className={`view-btn ${currentView === 'list' ? 'active' : ''}`} onClick={() => setView('list')} aria-label="Vue liste">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="8" y1="6" x2="21" y2="6"></line>
                    <line x1="8" y1="12" x2="21" y2="12"></line>
                    <line x1="8" y1="18" x2="21" y2="18"></line>
                    <line x1="3" y1="6" x2="3.01" y2="6"></line>
                    <line x1="3" y1="12" x2="3.01" y2="12"></line>
                    <line x1="3" y1="18" x2="3.01" y2="18"></line>
                  </svg>
                </button>
              </div>
              <select id="sortSelect" className="sort-select" value={currentSort} onChange={handleSortChange}>
                <option value="recent">Plus récents</option>
                <option value="ancien">Plus anciens</option>
                <option value="prix_asc">Prix croissant</option>
                <option value="prix_desc">Prix décroissant</option>
                <option value="surface_asc">Surface croissante</option>
                <option value="surface_desc">Surface décroissante</option>
                <option value="alpha">Ordre alphabétique</option>
              </select>
            </div>
          </div>

          <div className={`properties-grid ${currentView === 'list' ? 'properties-list' : ''}`} id="propertiesList">
            {paginatedProperties.length > 0 ? (
              paginatedProperties.map((property, index) => (
                currentView === 'list' ? (
                  <PropertyListCard key={property.id} property={property} index={index} />
                ) : (
                  <PropertyCard key={property.id} property={property} index={index} />
                )
              ))
            ) : (
              <div className="empty-state" id="emptyState">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <h3>Aucun résultat</h3>
                <p>Aucun bien ne correspond à vos critères de recherche</p>
                <button className="btn btn-secondary" onClick={resetFilters}>Réinitialiser</button>
              </div>
            )}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="pagination-container" id="paginationContainer">
              <div className="pagination" id="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Précédent
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}
                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Suivant
                </button>
              </div>
              <div className="results-per-page">
                <label>Éléments par page</label>
                <select id="resultsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange}>
                  <option value="12">12</option>
                  <option value="24">24</option>
                  <option value="36">36</option>
                  <option value="48">48</option>
                </select>
                <span>Page</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FORMULAIRE DE CONTACT RAPIDE */}
      <section className="section quick-contact-section">
        <div className="container">
          <div className="quick-contact-container" id="quickContactContainer">
            <div className="quick-contact-header">
              <h2>Contactez-nous</h2>
              <p>Notre équipe est à votre disposition pour vous aider</p>
            </div>
            <form id="quickContactForm" className="quick-contact-form" onSubmit={handleQuickContactSubmit}>
              <div className="quick-contact-grid">
                <div className="quick-contact-field">
                  <label>Nom</label>
                  <input type="text" name="nom" required placeholder="Votre nom complet" value={quickContactData.nom} onChange={handleQuickContactChange} />
                </div>
                <div className="quick-contact-field">
                  <label>Email</label>
                  <input type="email" name="email" required placeholder="votre@email.com" value={quickContactData.email} onChange={handleQuickContactChange} />
                </div>
                <div className="quick-contact-field">
                  <label>Téléphone</label>
                  <input type="tel" name="telephone" required placeholder="+228 XX XX XX XX" value={quickContactData.telephone} onChange={handleQuickContactChange} />
                </div>
              </div>
              <div className="quick-contact-message-row">
                <div className="quick-contact-field">
                  <label>Message</label>
                  <textarea name="message" rows="4" placeholder="Décrivez le type de bien que vous recherchez..." value={quickContactData.message} onChange={handleQuickContactChange}></textarea>
                </div>
                <button type="submit" className="btn btn-primary btn-large" disabled={isQuickContactSubmitting}>
                  {isQuickContactSubmitting ? 'Envoi en cours...' : 'Envoyer'}
                </button>
              </div>
            </form>
            {quickContactMessage && (
              <div className={`quick-contact-status ${quickContactMessage.includes('succès') ? 'success' : 'error'}`}>
                {quickContactMessage}
              </div>
            )}
          </div>

          {/* Bouton CTA */}
          <div className="quick-contact-cta">
            <Link to="/contact#agencies" className="btn btn-secondary btn-large" style={{background: '#0E63A8', borderColor: '#0E63A8', color: '#fff'}}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              Contacter nos agences
            </Link>
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
                    <option>Soir (17h-19h)</option>
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
              <button type="submit" className="btn btn-primary btn-large">Envoyer</button>
              {rdvFormMsg && <p className="form-message">{rdvFormMsg}</p>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NosOffres;
