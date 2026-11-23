import { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import '../styles/style.css';
import { createAppointment } from '../api/appointments';
import { submitMessage } from '../api/messages';
import WhatsAppFloat from '../components/WhatsAppFloat';
import AboutSection from '../components/AboutSection';
import Section from '../components/Section';
import ContentBlock from '../components/ContentBlock';
import SectionTitle from '../components/SectionTitle';
import SectionEyebrow from '../components/SectionEyebrow';

const PlacementPersonnel = () => {
  const [isRdvModalOpen, setIsRdvModalOpen] = useState(false);
  const [rdvFormData, setRdvFormData] = useState({
    nom: '',
    email: '',
    motif: '',
    date: '',
    creneau: '',
    telephone: '',
    message: ''
  });
  const [rdvFormMsg, setRdvFormMsg] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [placementFormData, setPlacementFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    type: '',
    domaine: '',
    message: ''
  });
  const [placementFormMsg, setPlacementFormMsg] = useState('');
  const [animatedStats, setAnimatedStats] = useState(false);
  const statsRef = useRef(null);

  const placementData = {
    hero: {
      eyebrow: "Recrutement & Placement",
      title: "Placement de Personnel",
      subtitle: "Nous mettons à votre disposition des profils qualifiés et rigoureusement sélectionnés pour répondre aux besoins de votre entreprise.",
      background: "/placement-de-personnel.png"
    },
    presentation: {
      eyebrow: "Notre service",
      title: "Pourquoi choisir KAZESERVICES pour le placement de personnel ?",
      description: "KAZESERVICES Placement de Personnel est votre partenaire de confiance pour tous vos besoins en recrutement. Nous comprenons que chaque entreprise a des exigences uniques et nous nous engageons à trouver les profils parfaitement adaptés à votre culture et à vos objectifs.",
      description2: "Notre approche rigoureuse, notre réseau étendu et notre connaissance approfondie du marché du travail nous permettent de vous proposer des candidats qualifiés, motivés et prêts à s'investir dans votre réussite.",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800"
    },
    domains: [
      { title: "Personnel de maison", description: "Gouvernantes, domestiques, jardiniers, chauffeurs privés et autres services domestiques qualifiés.", image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800", button: "En savoir plus" },
      { title: "Personnel administratif", description: "Secrétaires, assistants administratifs, réceptionnistes et personnel de bureau.", image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800", button: "En savoir plus" },
      { title: "Personnel commercial", description: "Vendeurs, commerciaux, représentants et personnel de vente qualifié.", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800", button: "En savoir plus" },
      { title: "Personnel technique", description: "Techniciens, ingénieurs, experts techniques et personnel spécialisé.", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800", button: "En savoir plus" },
      { title: "Personnel informatique", description: "Développeurs, administrateurs système, experts IT et personnel numérique.", image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800", button: "En savoir plus" },
      { title: "Personnel de sécurité", description: "Agents de sécurité, gardiens, personnel de protection et surveillance.", image: "https://images.unsplash.com/photo-1558002038-1091777d3d8e?w=800", button: "En savoir plus" },
      { title: "Personnel hôtelier", description: "Réceptionnistes, personnel de chambre, concierges et services hôtellers.", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800", button: "En savoir plus" },
      { title: "Personnel de santé", description: "Infirmiers, aides-soignants, personnel médical et paramédical.", image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800", button: "En savoir plus" },
      { title: "Personnel industriel", description: "Ouvriers, opérateurs de production, personnel d'usine et industriel.", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800", button: "En savoir plus" },
      { title: "Personnel logistique", description: "Magasiniers, chauffeurs, personnel d'entrepôt et logistique.", image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800", button: "En savoir plus" },
      { title: "Personnel de nettoyage", description: "Agents d'entretien, personnel de ménage et services de nettoyage.", image: "https://images.unsplash.com/photo-1581578731117-104f2a412da1?w=800", button: "En savoir plus" },
      { title: "Personnel de restauration", description: "Cuisiniers, serveurs, personnel de cuisine et services de restauration.", image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800", button: "En savoir plus" }
    ],
    advantages: [
      { icon: "check-circle", title: "Processus rigoureux", description: "Sélection et vérification approfondie de chaque candidat." },
      { icon: "award", title: "Profils qualifiés", description: "Candidats expérimentés et compétents dans leur domaine." },
      { icon: "clock", title: "Gain de temps", description: "Nous gérons tout le processus de recrutement pour vous." },
      { icon: "users", title: "Accompagnement", description: "Suivi personnalisé avant, pendant et après le placement." },
      { icon: "shield", title: "Confidentialité", description: "Traitement confidentiel de toutes vos informations." },
      { icon: "trending-up", title: "Suivi", description: "Évaluation régulière de la satisfaction et performance." }
    ],
    process: [
      { step: 1, title: "Analyse des besoins", description: "Nous définissons ensemble vos exigences et critères de recrutement." },
      { step: 2, title: "Recherche de candidats", description: "Nous identifions les profils correspondants dans notre base de données." },
      { step: 3, title: "Sélection et entretiens", description: "Nous présélectionnons et rencontrons les candidats potentiels." },
      { step: 4, title: "Présentation des profils", description: "Nous vous présentons les candidats les plus adaptés à vos besoins." },
      { step: 5, title: "Intégration et suivi", description: "Nous assurons l'intégration et assurons un suivi régulier." }
    ],
    stats: [
      { value: 5000, label: "Candidats" },
      { value: 1200, label: "Recrutements" },
      { value: 350, label: "Entreprises" },
      { value: 98, label: "% Satisfaction" }
    ],
    testimonials: [
      { name: "Marie Dupont", company: "Entreprise ABC", text: "KAZESERVICES nous a permis de trouver rapidement une gouvernante qualifiée et fiable. Le processus était simple et efficace.", rating: 5 },
      { name: "Jean Martin", company: "Société XYZ", text: "Excellent service de recrutement pour notre personnel administratif. Les candidats proposés correspondaient parfaitement à nos attentes.", rating: 5 },
      { name: "Sophie Bernard", company: "Groupe DEF", text: "Professionnalisme et réactivité. KAZESERVICES a su comprendre nos besoins et nous proposer des profils adaptés.", rating: 5 }
    ],
    faq: [
      { question: "Comment fonctionne le processus de recrutement chez KAZESERVICES ?", answer: "Notre processus commence par une analyse approfondie de vos besoins, suivie d'une recherche ciblée de candidats dans notre réseau étendu. Nous procédons à une sélection rigoureuse avec vérification des compétences, références et antécédents. Ensuite, nous présentons les profils les plus adaptés et assurons l'intégration ainsi que le suivi post-recrutement." },
      { question: "Quels types de personnel pouvez-vous trouver pour mon entreprise ?", answer: "Nous pouvons trouver du personnel qualifié dans de nombreux domaines : personnel de maison (gouvernantes, domestiques, jardiniers), personnel administratif et de bureau, personnel commercial et vente, personnel technique et ingénierie, personnel informatique et IT, personnel de sécurité, personnel hôtelier et d'accueil, personnel de santé, personnel industriel, personnel logistique, personnel de nettoyage et personnel de restauration." },
      { question: "Combien de temps faut-il pour trouver un candidat adapté ?", answer: "Le délai dépend de la complexité du poste et des exigences spécifiques. Pour les postes standards, nous présentons généralement les premiers candidats qualifiés sous 2 à 4 semaines après la définition précise de vos besoins. Pour les profils plus spécialisés, le délai peut être légèrement plus long." },
      { question: "Quelles garanties offrez-vous sur le recrutement ?", answer: "Nous offrons une période de garantie pendant laquelle nous remplaçons gratuitement tout candidat qui ne correspondrait pas à vos attentes. Cette période varie selon le type de poste. Nous assurons également un suivi régulier pour garantir votre satisfaction et l'intégration réussie du nouveau collaborateur." },
      { question: "Comment vérifiez-vous les compétences et l'expérience des candidats ?", answer: "Nous effectuons une vérification approfondie des références professionnelles, des compétences techniques et des antécédents de chaque candidat. Nous validons également les diplômes et certifications lorsque requis. Nos experts conduisent des entretiens approfondis pour évaluer non seulement les compétences mais aussi l'adéquation culturelle avec votre entreprise." }
    ],
    form: {
      fields: [
        { name: "nom", label: "Nom complet", type: "text", required: true },
        { name: "email", label: "Email", type: "email", required: true },
        { name: "telephone", label: "Téléphone", type: "tel", required: true },
        { name: "type", label: "Type de demande", type: "select", options: ["Recrutement", "Candidature", "Information"], required: true },
        { name: "domaine", label: "Domaine", type: "select", options: ["Personnel de maison", "Personnel administratif", "Personnel commercial", "Personnel technique", "Personnel informatique", "Personnel de sécurité", "Personnel hôtelier", "Personnel de santé", "Personnel industriel", "Personnel logistique", "Personnel de nettoyage", "Personnel de restauration", "Autre"], required: true },
        { name: "message", label: "Message", type: "textarea", required: false }
      ]
    },
    cta: {
      title: "Prêt à trouver le personnel idéal ?",
      subtitle: "Contactez nos conseillers pour discuter de vos besoins en recrutement"
    }
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
        motif: rdvFormData.motif || 'Placement de personnel',
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

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const nextTestimonial = () => {
    setActiveTestimonial((activeTestimonial + 1) % placementData.testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((activeTestimonial - 1 + placementData.testimonials.length) % placementData.testimonials.length);
  };

  const handlePlacementFormChange = (e) => {
    setPlacementFormData({
      ...placementFormData,
      [e.target.name]: e.target.value
    });
  };

  const handlePlacementFormSubmit = async (e) => {
    e.preventDefault();
    setPlacementFormMsg('Envoi en cours...');

    try {
      await submitMessage('placement_personnel', {
        nom: placementFormData.nom,
        email: placementFormData.email,
        telephone: placementFormData.telephone,
        message: `Type : ${placementFormData.type || '—'}\nDomaine : ${placementFormData.domaine || '—'}\n${placementFormData.message || ''}`,
      });
      setPlacementFormMsg("Votre demande a été envoyée avec succès. Nous vous contacterons bientôt.");
      setPlacementFormData({
        nom: '',
        email: '',
        telephone: '',
        type: '',
        domaine: '',
        message: ''
      });
    } catch (error) {
      setPlacementFormMsg("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  const scrollToForm = () => {
    document.getElementById('formSection')?.scrollIntoView({ behavior: 'smooth' });
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
          setAnimatedStats(true);
          animateCounters();
          // Désactiver l'observer après la première animation
          if (statsRef.current) {
            observer.unobserve(statsRef.current);
          }
        }
      });
    }, { threshold: 0.5 });

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (observer && statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);

  return (
    <div>
      <Header onRdvClick={openRdvModal} />

      <section className="hero-section" style={{ backgroundImage: "url('/placement-de-personnel.png')" }}>
        <div className="hero-background" style={{ backgroundImage: "url('/placement-de-personnel.png')" }}></div>
        <div className="unified-hero-overlay"></div>
        <div className="hero-content-wrapper">
          <p className="hero-eyebrow">Recrutement & Placement</p>
          <h1 className="hero-title">Placement de Personnel</h1>
          <p className="hero-subtitle">Nous mettons à votre disposition des profils qualifiés et rigoureusement sélectionnés pour répondre aux besoins de votre entreprise.</p>
          <div className="hero-buttons">
            <button onClick={scrollToForm} className="btn btn-primary btn-large">Besoin de personnel</button>
            <button onClick={scrollToForm} className="btn btn-secondary btn-large">Recherche d'emploi</button>
          </div>
        </div>
      </section>

      <AboutSection
        eyebrow="Notre service"
        title="Pourquoi choisir KAZESERVICES pour le placement de personnel ?"
        description="KAZESERVICES Placement de Personnel est votre partenaire de confiance pour tous vos besoins en recrutement. Nous comprenons que chaque entreprise a des exigences uniques et nous nous engageons à trouver les profils parfaitement adaptés à votre culture et à vos objectifs."
        description2="Notre approche rigoureuse, notre réseau étendu et notre connaissance approfondie du marché du travail nous permettent de vous proposer des candidats qualifiés, motivés et prêts à s'investir dans votre réussite."
        image={placementData.presentation.image}
        alt="Placement de personnel"
        eyebrowClassName="eyebrow-with-line"
      />

      <Section id="domainsSection">
        <div className="section-head text-center">
          <SectionEyebrow className="eyebrow-with-line">Nos domaines d'expertise</SectionEyebrow>
          <SectionTitle centered>Domaines de recrutement</SectionTitle>
          <ContentBlock centered>
            <p>Nous recrutons dans de nombreux secteurs d'activité pour répondre à tous vos besoins</p>
          </ContentBlock>
        </div>
        <div className="properties-grid">
          {placementData.domains.map((domain, index) => (
            <div key={index} className="service-card">
              <div className="service-card-image" style={{ width: '100%', height: '200px', overflow: 'hidden', borderRadius: 'var(--rayon-arche)' }}>
                <img src={domain.image} alt={domain.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div className="service-card-content">
                <h3>{domain.title}</h3>
                <p>{domain.description}</p>
                <button className="btn btn-secondary btn-small">{domain.button}</button>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="advantagesSection" className="advantages-section">
        <div className="section-head text-center">
          <SectionEyebrow className="eyebrow-with-line">Nos avantages</SectionEyebrow>
          <SectionTitle centered>Pourquoi nous choisir ?</SectionTitle>
          <ContentBlock centered>
            <p>Les avantages de notre service de placement de personnel</p>
          </ContentBlock>
        </div>
        <div className="advantages-grid">
          {placementData.advantages.map((advantage, index) => (
            <div key={index} className="advantage-card">
              <div className="advantage-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h3>{advantage.title}</h3>
              <p>{advantage.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="processSection">
        <div className="section-head text-center">
          <SectionEyebrow className="eyebrow-with-line">Notre processus</SectionEyebrow>
          <SectionTitle centered>Processus de recrutement</SectionTitle>
          <ContentBlock centered>
            <p>Les étapes de notre processus de sélection</p>
          </ContentBlock>
        </div>
        <div className="timeline">
          {placementData.process.map((step, index) => (
            <div key={index} className="timeline-item">
              <div className="timeline-number">{step.step}</div>
              <div className="timeline-content">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="statsSection" className="stats-section" reveal={false} sectionRef={statsRef}>
        <div className="section-head text-center">
          <SectionEyebrow className="eyebrow-with-line">Nos statistiques</SectionEyebrow>
          <SectionTitle centered>Chiffres clés</SectionTitle>
        </div>
        <div className="stats-grid">
          {placementData.stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-number" data-target={stat.value}>0</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="testimonialsSection" className="testimonials-section">
        <div className="section-head text-center">
          <SectionEyebrow className="eyebrow-with-line">Témoignages</SectionEyebrow>
          <SectionTitle centered>Ce que disent nos clients</SectionTitle>
          <ContentBlock centered>
            <p>Découvrez les retours de nos clients sur nos services</p>
          </ContentBlock>
        </div>
        <div className="testimonials-carousel">
          {placementData.testimonials.map((testimonial, index) => (
            <div key={index} className={`testimonial-card ${activeTestimonial === index ? 'active' : ''}`}>
              <div className="testimonial-content">
                <p>"{testimonial.text}"</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">{testimonial.name.split(' ').map(n => n[0]).join('')}</div>
                <div className="author-info">
                  <div className="author-name">{testimonial.name}</div>
                  <div className="author-location">{testimonial.company}</div>
                </div>
              </div>
            </div>
          ))}
          <div className="testimonials-nav">
            <button className="testimonial-nav-btn prev" onClick={prevTestimonial}>←</button>
            <button className="testimonial-nav-btn next" onClick={nextTestimonial}>→</button>
          </div>
        </div>
      </Section>

      <Section id="faqSection">
        <div className="section-head text-center">
          <SectionEyebrow className="eyebrow-with-line">FAQ</SectionEyebrow>
          <SectionTitle centered>Questions fréquentes</SectionTitle>
          <ContentBlock centered>
            <p>Les réponses à vos questions sur notre service de placement</p>
          </ContentBlock>
        </div>
        <div className="faq-container">
          {placementData.faq.map((item, index) => (
            <div key={index} className={`faq-item ${activeFaq === index ? 'active' : ''}`}>
              <div className="faq-header" onClick={() => toggleFaq(index)}>
                <h3>{item.question}</h3>
                <span className="faq-icon">{activeFaq === index ? '−' : '+'}</span>
              </div>
              <div className="faq-content">
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="formSection">
        <div className="section-head text-center">
          <SectionEyebrow className="eyebrow-with-line">Formulaire de demande</SectionEyebrow>
          <SectionTitle centered>Envoyez-nous votre demande de placement</SectionTitle>
          <ContentBlock centered>
            <p>Remplissez le formulaire ci-dessous pour nous faire part de vos besoins en personnel</p>
          </ContentBlock>
        </div>
        <div className="contact-form-wrapper">
          <form id="placementForm" className="contact-form" onSubmit={handlePlacementFormSubmit}>
            {placementData.form.fields.map((field, index) => (
              <div key={index} className="field">
                <label>{field.label}</label>
                {field.type === 'select' ? (
                  <select name={field.name} required={field.required} value={placementFormData[field.name]} onChange={handlePlacementFormChange}>
                    <option value="">Choisissez...</option>
                    {field.options.map((opt, i) => (
                      <option key={i} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea name={field.name} required={field.required} value={placementFormData[field.name]} onChange={handlePlacementFormChange}></textarea>
                ) : (
                  <input type={field.type} name={field.name} required={field.required} value={placementFormData[field.name]} onChange={handlePlacementFormChange} />
                )}
              </div>
            ))}
            <button type="submit" className="btn btn-primary btn-block">Envoyer ma demande</button>
            <div className="form-msg">{placementFormMsg}</div>
          </form>
        </div>
      </Section>

      <Section className="cta-section">
        <h2>Trouvez le personnel idéal pour votre entreprise</h2>
        <p>Notre équipe vous accompagne dans le recrutement et le placement de personnel qualifié</p>
        <div className="cta-section-buttons">
          <button className="btn btn-primary" onClick={openRdvModal}>Prendre rendez-vous</button>
          <Link to="/contact#agencies" className="btn btn-secondary">Nous contacter</Link>
        </div>
      </Section>

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
                  <option>Placement de personnel</option>
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

export default PlacementPersonnel;
