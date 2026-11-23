import { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import '../styles/style.css';
import '../styles/home-sections.css';
import '../styles/home-responsive.css';
import { createAppointment } from '../api/appointments';
import { submitMessage } from '../api/messages';
import { getProperties } from '../api/properties';
import { sortPropertiesByDate } from '../data/propertyTypes';
import WhatsAppFloat from '../components/WhatsAppFloat';
import Section from '../components/Section';
import ContentBlock from '../components/ContentBlock';
import SectionTitle from '../components/SectionTitle';
import SectionEyebrow from '../components/SectionEyebrow';
import PropertyCard from '../components/PropertyCard';

const Home = () => {
  const [isRdvModalOpen, setIsRdvModalOpen] = useState(false);
  const [formData, setFormData] = useState({
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
    message: ''
  });
  const [contactFormMsg, setContactFormMsg] = useState('');

  // Ajouter la classe 'home' au body au chargement
  useEffect(() => {
    document.body.classList.add('home');
    return () => {
      document.body.classList.remove('home');
    };
  }, []);

  // Animation des trois cartes trio-band avec GSAP
  useEffect(() => {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      const trioCols = document.querySelectorAll('.trio-col');
      const heroSection = document.querySelector('.hero-split');

      // Désactiver l'animation sur mobile (écran < 900px)
      const isMobile = window.innerWidth < 900;

      if (trioCols.length === 3 && heroSection && !isMobile) {
        // Position initiale : carte centrale surélevée pour chevaucher le Hero
        gsap.set(trioCols[1], { y: -70 });
        gsap.set(trioCols[0], { y: -30 });
        gsap.set(trioCols[2], { y: -30 });

        // Créer le ScrollTrigger pour les 3 cartes
        const scrollTrigger = ScrollTrigger.create({
          trigger: heroSection,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          onUpdate: (self) => {
            const progress = self.progress;

            // Carte centrale : amplitude réduite pour rester dans la zone du Hero
            const centerY = -70 + (progress * -100);
            gsap.set(trioCols[1], { y: centerY });

            // Cartes latérales : amplitude réduite pour rester dans la zone du Hero
            const sideY = -30 + (progress * -80);
            gsap.set(trioCols[0], { y: sideY });
            gsap.set(trioCols[2], { y: sideY });
          }
        });

        return () => {
          scrollTrigger.kill();
        };
      }
    }
  }, []);

  // Biens immobiliers — chargés depuis l'API Laravel (ou données de démo en secours)
  const [allProperties, setAllProperties] = useState([]);

  useEffect(() => {
    getProperties().then(setAllProperties);
  }, []);


  // Trier automatiquement par date de publication (plus récents en premier)
  const sortedProperties = sortPropertiesByDate(allProperties);

  // Refs pour les animations
  const counterRef = useRef(null);
  const [counterAnimated, setCounterAnimated] = useState(false);
  const dailySectionRef = useRef(null);
  const supportSectionRef = useRef(null);
  const blogSectionRef = useRef(null);
  const contactSectionRef = useRef(null);
  const propertiesSectionRef = useRef(null);
  const [dailyAnimated, setDailyAnimated] = useState(false);
  const [supportAnimated, setSupportAnimated] = useState(false);
  const [blogAnimated, setBlogAnimated] = useState(false);
  const [propertiesAnimated, setPropertiesAnimated] = useState(false);

  const openRdvModal = () => {
    setIsRdvModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeRdvModal = () => {
    setIsRdvModalOpen(false);
    document.body.style.overflow = '';
  };

  const handleRdvFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleContactFormChange = (e) => {
    setContactFormData({
      ...contactFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleRdvFormSubmit = async (e) => {
    e.preventDefault();
    setRdvFormMsg('Envoi en cours...');

    try {
      await createAppointment({
        nom: formData.nom,
        email: formData.email,
        motif: formData.motif,
        date: formData.date,
        creneau: formData.creneau,
        telephone: formData.telephone,
        message: `Bien concerné : ${formData.bien || '—'}\n${formData.message || ''}`,
      });

      setRdvFormMsg('Votre demande de rendez-vous a été envoyée avec succès. Un conseiller vous contactera bientôt.');
      setFormData({
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

  const handleContactFormSubmit = async (e) => {
    e.preventDefault();
    setContactFormMsg('Envoi en cours...');

    try {
      await submitMessage('contact', {
        nom: contactFormData.name,
        email: contactFormData.email,
        telephone: contactFormData.telephone,
        message: contactFormData.message,
      });
      setContactFormMsg('Votre message a été envoyé avec succès !');
      setContactFormData({
        name: '',
        email: '',
        telephone: '',
        message: ''
      });
    } catch (err) {
      setContactFormMsg('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  // Animation du compteur
  useEffect(() => {
    let hasAnimated = false;
    let observer = null;

    const animateCounter = () => {
      const counterElement = counterRef.current;
      if (!counterElement) return;

      const target = 15;
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      const updateCounter = () => {
        current += step;
        if (current < target) {
          counterElement.textContent = Math.floor(current);
          requestAnimationFrame(updateCounter);
        } else {
          counterElement.textContent = target;
          // Désactiver l'observer après l'animation terminée
          if (observer && counterRef.current) {
            observer.unobserve(counterRef.current);
          }
        }
      };

      updateCounter();
    };

    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          setCounterAnimated(true);
          animateCounter();
        }
      });
    }, { threshold: 0.5 });

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (observer && counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, []);

  // Animation de la section LISTE DE BIENS
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !propertiesAnimated) {
          setPropertiesAnimated(true);
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    if (propertiesSectionRef.current) {
      observer.observe(propertiesSectionRef.current);
    }

    return () => {
      if (propertiesSectionRef.current) {
        observer.unobserve(propertiesSectionRef.current);
      }
    };
  }, [propertiesAnimated]);

  // Animation de la section "Faciliter votre quotidien"
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !dailyAnimated) {
          setDailyAnimated(true);
        }
      });
    }, { threshold: 0.2 });

    if (dailySectionRef.current) {
      observer.observe(dailySectionRef.current);
    }

    return () => {
      if (dailySectionRef.current) {
        observer.unobserve(dailySectionRef.current);
      }
    };
  }, [dailyAnimated]);

  // Animation de la section "Notre accompagnement"
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !supportAnimated) {
          setSupportAnimated(true);
        }
      });
    }, { threshold: 0.2 });

    if (supportSectionRef.current) {
      observer.observe(supportSectionRef.current);
    }

    return () => {
      if (supportSectionRef.current) {
        observer.unobserve(supportSectionRef.current);
      }
    };
  }, [supportAnimated]);

  // Animation de la section "Blog"
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !blogAnimated) {
          setBlogAnimated(true);
        }
      });
    }, { threshold: 0.2 });

    if (blogSectionRef.current) {
      observer.observe(blogSectionRef.current);
    }

    return () => {
      if (blogSectionRef.current) {
        observer.unobserve(blogSectionRef.current);
      }
    };
  }, [blogAnimated]);

  // Animation de la section "Contact" - Parallax horizontal piloté par le scroll avec lissage
  useEffect(() => {
    let currentX = 0;
    let targetX = 0;
    let animationFrameId = null;

    const updateAnimation = () => {
      // Lissage avec interpolation
      currentX += (targetX - currentX) * 0.1;

      const wrapper = contactSectionRef.current?.querySelector('.home-contact-wrapper');
      if (wrapper) {
        wrapper.style.transform = `translateX(${currentX}px)`;
        // Opacité basée sur la progression
        const progress = 1 - (currentX / (window.innerWidth / 2 + 320));
        wrapper.style.opacity = Math.max(0, Math.min(1, progress));
      }

      animationFrameId = requestAnimationFrame(updateAnimation);
    };

    const handleScroll = () => {
      if (!contactSectionRef.current) return;

      const rect = contactSectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;

      // Calculer la progression du scroll (0 quand la section est en bas, 1 quand elle est au centre)
      const start = windowHeight - 200; // top bottom-=200
      const end = windowHeight / 2; // center center

      let progress = 0;
      if (rect.top < start && rect.top > end) {
        progress = (start - rect.top) / (start - end);
      } else if (rect.top <= end) {
        progress = 1;
      }

      // Position initiale : formulaire au bord droit de l'écran
      const startX = windowWidth / 2 + 320;
      targetX = startX * (1 - progress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
    updateAnimation(); // Démarrer l'animation

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
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
    <div className="home">
      <Header onRdvClick={openRdvModal} />

      {/* 1. HERO : deux colonnes - image gauche, logo+texte droite */}
      <section className="hero-split">
        <h1 className="sr-only">Kazeservices — Cabinet de conseil immobilier : achat, vente, location, gestion, architecture et formation</h1>

        <div className="hero-container">
          {/* Colonne gauche - Image */}
          <div className="hero-left">
            <img src="/acceuil.png" alt="Villa Kazeservices" />
          </div>

          {/* Colonne droite - Logo + Texte */}
          <div className="hero-right">
            <Link to="/" className="logo">
              <img src="/logo-kazeservice.jpg" alt="Kazeservices" className="logo-img" />
            </Link>
            <div className="hero-content">
              <p className="hero-tagline">CONSEIL • GESTION • CONSTRUCTION</p>
              <h2 className="hero-title">La satisfaction du client,</h2>
              <p className="hero-subtitle">notre succès</p>
            </div>
            <div className="hero-values">
              <div className="hero-value-item">
                <span className="hero-value-icon">🛡️</span>
                <div className="hero-value-content">
                  <span className="hero-value-title">EXPERTISE</span>
                  <span className="hero-value-subtitle">Professionnalisme</span>
                </div>
              </div>
              <div className="hero-value-item">
                <span className="hero-value-icon">👤</span>
                <div className="hero-value-content">
                  <span className="hero-value-title">ACCOMPAGNEMENT</span>
                  <span className="hero-value-subtitle">Personnalisé</span>
                </div>
              </div>
              <div className="hero-value-item">
                <span className="hero-value-icon">📞</span>
                <div className="hero-value-content">
                  <span className="hero-value-title">DISPONIBLE</span>
                  <span className="hero-value-subtitle">7j/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TROIS BLOCS DYNAMIQUES */}
      <section className="trio-band">
        <div className="trio-col">
          <div className="trio-photo" style={{backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop')"}}></div>
          <div className="trio-card">
            <div className="trio-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="4" width="7" height="16" rx="0.5"/>
                <rect x="13" y="2" width="7" height="18" rx="0.5"/>
                <path d="M6 7h3"/>
                <path d="M6 10h3"/>
                <path d="M6 13h3"/>
                <path d="M6 16h3"/>
                <path d="M15 5h3"/>
                <path d="M15 8h3"/>
                <path d="M15 11h3"/>
                <path d="M15 14h3"/>
                <path d="M15 17h3"/>
                <path d="M6 19h3"/>
                <path d="M15 19h3"/>
              </svg>
            </div>
            <h3>Acheter ou Louer</h3>
            <p>Kazeservices met à votre disposition plusieurs biens immobiliers et fonds de commerce qui, selon vos critères de choix, vous permettront de trouver le produit répondant à vos attentes.</p>
            <Link to="/nos-offres" className="btn-trio">Commencez votre recherche</Link>
          </div>
        </div>
        <div className="trio-col trio-col-dark">
          <div className="trio-card">
            <div className="trio-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <path d="M9 22V12h6v10"/>
              </svg>
            </div>
            <h3>Estimer &amp; Vendre</h3>
            <p>L'expertise Kazeservices vous permet de vendre votre villa, maison, terrain ou autre bien immobilier vite et au meilleur prix, avec un accompagnement à chaque étape.</p>
            <Link to="/estimer-et-vendre" className="btn-trio">En savoir plus</Link>
          </div>
        </div>
        <div className="trio-col">
          <div className="trio-photo" style={{backgroundImage: "url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop')"}}></div>
          <div className="trio-card">
            <div className="trio-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
              </svg>
            </div>
            <h3>Faire gérer ma location</h3>
            <p>Soyez serein, Kazeservices s'occupe de tout : nous accompagnons nos clients propriétaires bailleurs pour valoriser leur patrimoine et sécuriser leurs revenus locatifs.</p>
            <Link to="/faire-gerer-ma-location" className="btn-trio">Découvrez notre offre</Link>
          </div>
        </div>
      </section>

      {/* 3. LISTE DE BIENS */}
      <section className="section reveal" ref={propertiesSectionRef}>
        <div className="container">
          <div className="properties-grid" id="featured-properties">
            {sortedProperties.slice(0, 6).map((property, index) => (
              <PropertyCard key={property.id} property={property} index={index} />
            ))}
          </div>
          <div className="text-center mt-lg">
            <Link to="/nos-offres" className="btn btn-primary">Voir toutes nos offres</Link>
          </div>
        </div>
      </section>

      {/* 4. FACILITER VOTRE QUOTIDIEN */}
      <section className="home-daily-section" ref={dailySectionRef}>
        <div className="home-daily-container">
          <div className="home-daily-wrapper">
            <div className={`home-daily-content ${dailyAnimated ? 'animate-in' : ''}`}>
              <h2 className="home-daily-title">Faciliter votre quotidien</h2>
              <div className="home-daily-line"></div>
              <p className="home-daily-text">
                <span className="home-daily-orange">KAZESERVICE</span> met à votre disposition un ensemble de services immobiliers pour simplifier votre quotidien. Achat, vente, location, gestion immobilière, conseils juridiques, fiscaux, comptables, architecture et accompagnement personnalisé : notre équipe vous apporte des solutions fiables à chaque étape de votre projet.
              </p>
              <Link to="/services" className="home-daily-btn">En savoir plus</Link>
            </div>
            <div className={`home-daily-images ${dailyAnimated ? 'animate-in' : ''}`}>
              <div className="home-daily-image-large">
                <div className={`home-daily-curtain ${dailyAnimated ? 'reveal' : ''}`}></div>
                <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=900&auto=format&fit=crop" alt="Faciliter votre quotidien avec Kazeservices" />
              </div>
              <div className="home-daily-image-small">
                <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=900&auto=format&fit=crop" alt="Services immobiliers Kazeservices" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. NOTRE ACCOMPAGNEMENT */}
      <section className="home-support-section" ref={supportSectionRef}>
        <div className="home-support-container">
          <div className="home-support-wrapper">
            <div className={`home-support-photo ${supportAnimated ? 'animate-in' : ''}`}>
              <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=900&auto=format&fit=crop" alt="Notre accompagnement Kazeservices" />
            </div>
            <div className={`home-support-content ${supportAnimated ? 'animate-in' : ''}`}>
              <h2 className="home-support-title">Notre accompagnement</h2>
              <p className="home-support-text">
                <span className="home-support-orange">KAZESERVICE</span> accompagne particuliers, entreprises et investisseurs dans tous leurs projets immobiliers. Notre équipe vous conseille afin de sélectionner les meilleures opportunités selon vos objectifs et votre budget.
              </p>
              <p className="home-support-text">
                Nous mettons notre expertise à votre disposition pour sécuriser chaque étape de votre projet, de la recherche jusqu'à la concrétisation de votre investissement.
              </p>
              <div className={`home-support-counter ${supportAnimated ? 'animate-in' : ''}`}>
                <span className="home-support-number" ref={counterRef} data-count="15" data-suffix=" Ans +">0</span>
                <span className="home-support-label">Années d'expérience</span>
              </div>
              <Link to="/services" className={`home-support-btn ${supportAnimated ? 'animate-in' : ''}`}>Découvrir nos atouts</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BLOG / ACTUALITÉS */}
      <section className="home-blog-section" ref={blogSectionRef}>
        <div className="home-blog-container">
          <div className="home-blog-header">
            <span className="home-blog-label">ACTUALITÉS & CONSEILS</span>
            <h2 className="home-blog-title">Les dernières actualités immobilières</h2>
            <p className="home-blog-description">Découvrez nos derniers articles sur l'immobilier, le marché à Lomé et nos conseils d'experts.</p>
          </div>
          <div className="home-blog-grid">
            <article className={`home-blog-card ${blogAnimated ? 'animate-in' : ''}`}>
              <div className="home-blog-thumb">
                <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=600&auto=format&fit=crop" alt="Article blog" />
              </div>
              <div className="home-blog-content">
                <span className="home-blog-category">Conseils</span>
                <h3>Comment estimer votre bien immobilier au juste prix</h3>
                <p>Découvrez les critères essentiels pour estimer correctement votre villa, maison ou terrain à Lomé.</p>
                <a href="#" className="home-blog-link">Lire la suite →</a>
              </div>
            </article>
            <article className={`home-blog-card ${blogAnimated ? 'animate-in' : ''}`}>
              <div className="home-blog-thumb">
                <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=600&auto=format&fit=crop" alt="Article blog" />
              </div>
              <div className="home-blog-content">
                <span className="home-blog-category">Marché</span>
                <h3>Les tendances du marché immobilier à Lomé en 2026</h3>
                <p>Analyse des évolutions du marché locatif et des prix de vente dans les quartiers prisés.</p>
                <a href="#" className="home-blog-link">Lire la suite →</a>
              </div>
            </article>
            <article className={`home-blog-card ${blogAnimated ? 'animate-in' : ''}`}>
              <div className="home-blog-thumb">
                <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=600&auto=format&fit=crop" alt="Article blog" />
              </div>
              <div className="home-blog-content">
                <span className="home-blog-category">Gestion</span>
                <h3>Les avantages de la gestion locative professionnelle</h3>
                <p>Pourquoi confier la gestion de votre location à un professionnel vous fait gagner temps et sérénité.</p>
                <a href="#" className="home-blog-link">Lire la suite →</a>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* 7. CONTACTEZ-NOUS */}
      <section className="home-contact-section" ref={contactSectionRef}>
        <div className="home-contact-background">
          <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1600&auto=format&fit=crop" alt="Fond contact Kazeservices" />
        </div>
        <div className="home-contact-container">
          <div className="home-contact-wrapper">
            <h2 className="home-contact-title">Contactez-nous</h2>
            <form id="homeContactForm" onSubmit={handleContactFormSubmit}>
              <div className="home-contact-form-row">
                <input type="text" name="name" placeholder="Nom complet" required className="home-contact-input" value={contactFormData.name} onChange={handleContactFormChange} />
                <input type="email" name="email" placeholder="Email" required className="home-contact-input" value={contactFormData.email} onChange={handleContactFormChange} />
                <input type="tel" name="telephone" placeholder="Téléphone" className="home-contact-input" value={contactFormData.telephone} onChange={handleContactFormChange} />
              </div>
              <textarea name="message" placeholder="Votre message" required className="home-contact-textarea" value={contactFormData.message} onChange={handleContactFormChange}></textarea>
              <button type="submit" className="home-contact-btn">Envoyer</button>
              <p className="home-contact-form-msg" id="homeContactMsg">{contactFormMsg}</p>
            </form>
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
                <input type="text" name="nom" required value={formData.nom} onChange={handleRdvFormChange} />
              </div>
              <div className="field">
                <label>Email</label>
                <input type="email" name="email" required value={formData.email} onChange={handleRdvFormChange} />
              </div>
              <div className="field">
                <label>Motif</label>
                <select name="motif" required value={formData.motif} onChange={handleRdvFormChange}>
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
                  <input type="date" name="date" required value={formData.date} onChange={handleRdvFormChange} />
                </div>
                <div className="field">
                  <label>Créneau horaire</label>
                  <select name="creneau" required value={formData.creneau} onChange={handleRdvFormChange}>
                    <option value="">Sélectionnez un créneau</option>
                    <option>Matin (9h-12h)</option>
                    <option>Après-midi (14h-17h)</option>
                    <option>Soirée (17h-19h)</option>
                  </select>
                </div>
              </div>
              <div className="field">
                <label>Téléphone</label>
                <input type="tel" name="telephone" required value={formData.telephone} onChange={handleRdvFormChange} />
              </div>
              <div className="field">
                <label>Bien concerné (optionnel)</label>
                <input type="text" name="bien" placeholder="Référence ou adresse du bien" value={formData.bien} onChange={handleRdvFormChange} />
              </div>
              <div className="field">
                <label>Message (optionnel)</label>
                <textarea name="message" placeholder="Précisez votre besoin si vous le souhaitez." value={formData.message} onChange={handleRdvFormChange}></textarea>
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

export default Home;
