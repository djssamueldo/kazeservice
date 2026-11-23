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

const ServicesInformatiques = () => {
  const [isRdvModalOpen, setIsRdvModalOpen] = useState(false);
  const [rdvFormData, setRdvFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    date: '',
    creneau: '',
    bien: '',
    message: ''
  });
  const [rdvFormMsg, setRdvFormMsg] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [itServicesFormData, setItServicesFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  const [itServicesFormMsg, setItServicesFormMsg] = useState('');
  const [animatedStats, setAnimatedStats] = useState(false);
  const statsRef = useRef(null);

  const itServicesData = {
    hero: {
      background: "/service-informatique.png",
      eyebrow: "Services numériques",
      title: "Solutions Informatiques & Génie Logiciel",
      subtitle: "Nous concevons des solutions numériques performantes, sécurisées et évolutives pour accompagner la transformation digitale des entreprises.",
      button1: "Découvrir nos solutions",
      button2: "Demander un devis"
    },
    presentation: {
      eyebrow: "Notre département informatique",
      title: "Expertise en Génie Logiciel et Solutions Numériques",
      description: "Notre pôle Génie Logiciel et Solutions Numériques accompagne les entreprises dans leur transformation digitale. Nous développons des solutions sur mesure adaptées à vos besoins spécifiques.",
      description2: "De la conception à la maintenance, notre équipe d'experts vous accompagne à chaque étape de vos projets informatiques pour garantir leur succès.",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800"
    },
    services: [
      { title: "Développement de sites web", description: "Création de sites web modernes, responsives et optimisés pour les moteurs de recherche.", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800", button: "En savoir plus" },
      { title: "Développement d'applications web", description: "Applications web performantes et évolutives pour vos besoins métiers.", image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800", button: "En savoir plus" },
      { title: "Développement mobile Android", description: "Applications natives Android optimisées pour l'expérience utilisateur.", image: "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=800", button: "En savoir plus" },
      { title: "Développement mobile iOS", description: "Applications iOS natives respectant les standards Apple.", image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800", button: "En savoir plus" },
      { title: "Développement multiplateforme", description: "Solutions cross-platform pour un développement optimisé.", image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800", button: "En savoir plus" },
      { title: "Logiciels de gestion", description: "ERP et logiciels métiers sur mesure pour votre entreprise.", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800", button: "En savoir plus" },
      { title: "Développement SaaS", description: "Solutions Software as a Service évolutives et sécurisées.", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800", button: "En savoir plus" },
      { title: "API et architecture logicielle", description: "Conception d'API robustes et architectures logicielles performantes.", image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800", button: "En savoir plus" },
      { title: "Bases de données", description: "Administration, migration et optimisation de bases de données.", image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800", button: "En savoir plus" },
      { title: "Maintenance logicielle", description: "Maintenance préventive et corrective de vos applications.", image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800", button: "En savoir plus" },
      { title: "Cybersécurité", description: "Sécurité des applications et protection de vos données.", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800", button: "En savoir plus" },
      { title: "Cloud Computing", description: "Solutions cloud, hébergement et virtualisation.", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800", button: "En savoir plus" },
      { title: "DevOps et automatisation", description: "Mise en place de pipelines CI/CD et automatisation des processus.", image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800", button: "En savoir plus" },
      { title: "Intelligence artificielle", description: "Solutions IA et Machine Learning pour vos projets.", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800", button: "En savoir plus" },
      { title: "Business Intelligence", description: "Data Analytics et BI pour la prise de décision.", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800", button: "En savoir plus" },
      { title: "UI/UX Design", description: "Design d'interfaces utilisateur et expérience utilisateur optimisée.", image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800", button: "En savoir plus" },
      { title: "SEO et Marketing Digital", description: "Référencement naturel et stratégies marketing digital.", image: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=800", button: "En savoir plus" },
      { title: "Réseaux et infrastructure", description: "Installation et configuration de réseaux informatiques.", image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800", button: "En savoir plus" },
      { title: "Assistance technique", description: "Support technique et dépannage informatique.", image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800", button: "En savoir plus" },
      { title: "Formation informatique", description: "Formation aux technologies et bonnes pratiques informatiques.", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800", button: "En savoir plus" }
    ],
    process: [
      { step: 1, title: "Analyse", description: "Analyse approfondie de vos besoins et définition des spécifications." },
      { step: 2, title: "Conception", description: "Conception de l'architecture et des interfaces utilisateur." },
      { step: 3, title: "Développement", description: "Développement itératif avec validation régulière." },
      { step: 4, title: "Tests", description: "Tests complets et assurance qualité." },
      { step: 5, title: "Déploiement", description: "Mise en production et configuration." },
      { step: 6, title: "Maintenance", description: "Maintenance continue et support technique." }
    ],
    advantages: [
      { icon: "code", title: "Expertise technique", description: "Équipe d'experts certifiés dans les technologies modernes." },
      { icon: "settings", title: "Solutions sur mesure", description: "Solutions adaptées à vos besoins spécifiques." },
      { icon: "trending-up", title: "Technologies modernes", description: "Utilisation des dernières technologies du marché." },
      { icon: "shield", title: "Sécurité", description: "Solutions sécurisées et conformes aux normes." },
      { icon: "users", title: "Accompagnement", description: "Suivi personnalisé tout au long du projet." },
      { icon: "refresh", title: "Maintenance", description: "Support continu et maintenance proactive." },
      { icon: "headphones", title: "Support", description: "Assistance technique réactive et disponible." },
      { icon: "lightbulb", title: "Innovation", description: "Approche innovante et solutions créatives." }
    ],
    technologies: {
      categories: [
        { name: "Langages de Programmation", technologies: [{ name: "Java", logo: "assets/tech/java.png" }, { name: "JavaScript", logo: "assets/tech/javascript.png" }, { name: "TypeScript", logo: "assets/tech/typescript.png" }, { name: "PHP", logo: "assets/tech/php.png" }, { name: "Python", logo: "assets/tech/python.png" }, { name: "C#", logo: "assets/tech/csharp.png" }, { name: "C++", logo: "assets/tech/cpp.png" }, { name: "SQL", logo: "assets/tech/sql.png" }] },
        { name: "Frameworks & Librairies", technologies: [{ name: "Symfony", logo: "assets/tech/symfony.png" }, { name: "Laravel", logo: "assets/tech/laravel.png" }, { name: "React", logo: "assets/tech/react.png" }, { name: "Next.js", logo: "assets/tech/nextjs.png" }, { name: "Vue.js", logo: "assets/tech/vue.png" }, { name: "Angular", logo: "assets/tech/angular.png" }, { name: "Node.js", logo: "assets/tech/nodejs.png" }, { name: "Express.js", logo: "assets/tech/express.png" }] },
        { name: "CMS", technologies: [{ name: "WordPress", logo: "assets/tech/wordpress.png" }, { name: "Drupal", logo: "assets/tech/drupal.png" }, { name: "Joomla", logo: "assets/tech/joomla.png" }] },
        { name: "Bases de Données", technologies: [{ name: "MySQL", logo: "assets/tech/mysql.png" }, { name: "PostgreSQL", logo: "assets/tech/postgresql.png" }, { name: "MariaDB", logo: "assets/tech/mariadb.png" }, { name: "MongoDB", logo: "assets/tech/mongodb.png" }] },
        { name: "DevOps & Cloud", technologies: [{ name: "Docker", logo: "assets/tech/docker.png" }, { name: "Kubernetes", logo: "assets/tech/kubernetes.png" }, { name: "Git", logo: "assets/tech/git.png" }, { name: "GitHub", logo: "assets/tech/github.png" }, { name: "AWS", logo: "assets/tech/aws.png" }, { name: "Azure", logo: "assets/tech/azure.png" }] }
      ]
    },
    portfolio: [
      { title: "Plateforme E-commerce", description: "Développement d'une plateforme e-commerce complète avec gestion des stocks et paiements.", category: "E-commerce", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800", link: "#" },
      { title: "Application Mobile Banking", description: "Application mobile sécurisée pour la gestion bancaire.", category: "Mobile", image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800", link: "#" },
      { title: "Système de Gestion ERP", description: "ERP personnalisé pour la gestion d'entreprise multi-sites.", category: "ERP", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800", link: "#" },
      { title: "Dashboard Analytics", description: "Tableau de bord interactif pour l'analyse de données business.", category: "Analytics", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800", link: "#" },
      { title: "Application de Livraison", description: "Application de livraison avec tracking en temps réel.", category: "Logistique", image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800", link: "#" },
      { title: "Plateforme de Réservation", description: "Système de réservation en ligne avec gestion des disponibilités.", category: "SaaS", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800", link: "#" }
    ],
    stats: [
      { value: 150, label: "Projets réalisés" },
      { value: 50, label: "Clients satisfaits" },
      { value: 25, label: "Experts techniques" },
      { value: 99, label: "% Satisfaction" }
    ],
    testimonials: [
      { name: "Pierre Durand", company: "Tech Solutions", text: "KAZESERVICES a développé notre plateforme e-commerce avec professionnalisme. Le résultat dépasse nos attentes.", rating: 5 },
      { name: "Marie Lefebvre", company: "Digital Corp", text: "Excellente équipe technique. Ils ont su comprendre nos besoins et livrer une solution sur mesure de qualité.", rating: 5 },
      { name: "Jean-Pierre Martin", company: "Innovate Group", text: "Partenaire de confiance pour nos projets informatiques. Réactivité et expertise au rendez-vous.", rating: 5 }
    ],
    faq: [
      { question: "Quels types de développement logiciel proposez-vous ?", answer: "Nous proposons le développement de sites web, d'applications web, d'applications mobiles (Android, iOS, multiplateforme), de logiciels de gestion, d'ERP, de CRM, de solutions SaaS, d'API, et d'architectures logicielles personnalisées." },
      { question: "Quelles technologies utilisez-vous ?", answer: "Nous maîtrisons un large éventail de technologies : Java, Python, PHP, Laravel, React, Angular, Vue, Flutter, Django, Spring, Node.js, .NET, MySQL, PostgreSQL, MongoDB, Docker, Kubernetes, Git, Linux, AWS, Azure, Google Cloud, et bien d'autres." },
      { question: "Combien de temps faut-il pour développer un projet ?", answer: "Le délai dépend de la complexité du projet. Un site web simple peut prendre 2 à 4 semaines, une application web 4 à 8 semaines, et un projet complexe plusieurs mois. Nous établissons un planning détaillé lors de l'analyse initiale." },
      { question: "Proposez-vous des services de maintenance ?", answer: "Oui, nous proposons des contrats de maintenance incluant la surveillance, les mises à jour, le support technique et les corrections de bugs. Nous assurons également l'évolution de vos solutions selon vos besoins." },
      { question: "Comment assurez-vous la sécurité des applications ?", answer: "Nous appliquons les meilleures pratiques de sécurité : chiffrement des données, authentification sécurisée, protection contre les attaques courantes, conformité aux normes (RGPD, etc.), et tests de pénétration réguliers." }
    ],
    form: {
      fields: [
        { name: "name", label: "Nom complet", type: "text", required: true },
        { name: "email", label: "Email", type: "email", required: true },
        { name: "phone", label: "Téléphone", type: "tel", required: false },
        { name: "service", label: "Service souhaité", type: "select", required: true, options: ["Développement web", "Développement mobile", "Logiciel de gestion", "Consulting", "Autre"] },
        { name: "message", label: "Description du projet", type: "textarea", required: true }
      ]
    },
    cta: {
      title: "Prêt à transformer votre entreprise ?",
      subtitle: "Contactez nos experts pour discuter de vos projets informatiques",
      button1: "Prendre rendez-vous",
      button2: "Nous contacter"
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
        motif: 'Services informatiques',
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
        date: '',
        creneau: '',
        bien: '',
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
    setActiveTestimonial((activeTestimonial + 1) % itServicesData.testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((activeTestimonial - 1 + itServicesData.testimonials.length) % itServicesData.testimonials.length);
  };

  const handleItServicesFormChange = (e) => {
    setItServicesFormData({
      ...itServicesFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleItServicesFormSubmit = async (e) => {
    e.preventDefault();
    setItServicesFormMsg('Envoi en cours...');

    try {
      await submitMessage('service_informatique', {
        nom: itServicesFormData.name,
        email: itServicesFormData.email,
        telephone: itServicesFormData.phone,
        message: `Service : ${itServicesFormData.service || '—'}\n${itServicesFormData.message || ''}`,
      });
      setItServicesFormMsg("Votre demande a été envoyée avec succès. Nous vous contacterons bientôt.");
      setItServicesFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: ''
      });
    } catch (error) {
      setItServicesFormMsg("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  const scrollToServices = () => {
    document.getElementById('servicesSection')?.scrollIntoView({ behavior: 'smooth' });
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

      <section className="hero-section" style={{ backgroundImage: "url('/service-informatique.png')" }}>
        <div className="hero-background" style={{ backgroundImage: "url('/service-informatique.png')" }}></div>
        <div className="unified-hero-overlay"></div>
        <div className="hero-content-wrapper">
          <p className="hero-eyebrow">Services numériques</p>
          <h1 className="hero-title">Solutions Informatiques & Génie Logiciel</h1>
          <p className="hero-subtitle">Nous concevons des solutions numériques performantes, sécurisées et évolutives pour accompagner la transformation digitale des entreprises.</p>
          <div className="hero-buttons">
            <button onClick={scrollToServices} className="btn btn-primary btn-large">Découvrir nos solutions</button>
            <button onClick={scrollToForm} className="btn btn-secondary btn-large">Demander un devis</button>
          </div>
        </div>
      </section>

      <AboutSection
        eyebrow="Notre département informatique"
        title="Expertise en Génie Logiciel et Solutions Numériques"
        description="Notre pôle Génie Logiciel et Solutions Numériques accompagne les entreprises dans leur transformation digitale. Nous développons des solutions sur mesure adaptées à vos besoins spécifiques."
        description2="De la conception à la maintenance, notre équipe d'experts vous accompagne à chaque étape de vos projets informatiques pour garantir leur succès."
        image={itServicesData.presentation.image}
        alt="Services informatiques"
        eyebrowClassName="eyebrow-with-line"
      />

      <Section id="servicesSection">
        <div className="section-head text-center">
          <SectionEyebrow className="eyebrow-with-line">Nos services</SectionEyebrow>
          <SectionTitle centered>Nos solutions informatiques</SectionTitle>
          <ContentBlock centered>
            <p>Découvrez notre gamme complète de services informatiques</p>
          </ContentBlock>
        </div>
        <div className="properties-grid">
          {itServicesData.services.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-card-image" style={{ width: '100%', height: '200px', overflow: 'hidden', borderRadius: 'var(--rayon-arche)' }}>
                <img src={service.image} alt={service.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div className="service-card-content">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <button className="btn btn-secondary btn-small">{service.button}</button>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="processSection">
        <div className="section-head text-center">
          <SectionEyebrow className="eyebrow-with-line">Notre processus</SectionEyebrow>
          <SectionTitle centered>Notre méthodologie de travail</SectionTitle>
          <ContentBlock centered>
            <p>Les étapes de notre processus de développement</p>
          </ContentBlock>
        </div>
        <div className="timeline">
          {itServicesData.process.map((step, index) => (
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

      <Section id="advantagesSection" className="advantages-section">
        <div className="section-head text-center">
          <SectionEyebrow className="eyebrow-with-line">Nos avantages</SectionEyebrow>
          <SectionTitle centered>Pourquoi nous choisir ?</SectionTitle>
          <ContentBlock centered>
            <p>Les avantages de nos services informatiques</p>
          </ContentBlock>
        </div>
        <div className="advantages-grid">
          {itServicesData.advantages.map((advantage, index) => (
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

      <Section id="technologiesSection">
        <div className="section-head text-center">
          <SectionEyebrow className="eyebrow-with-line">Technologies</SectionEyebrow>
          <SectionTitle centered>Nos technologies</SectionTitle>
          <ContentBlock centered>
            <p>Les technologies que nous maîtrisons</p>
          </ContentBlock>
        </div>
        <div className="technologies-categories">
          {itServicesData.technologies.categories.map((category, catIndex) => (
            <div key={catIndex} className="tech-category">
              <h3 className="tech-category-title">{category.name}</h3>
              <div className="tech-grid">
                {category.technologies.map((tech, techIndex) => (
                  <div key={techIndex} className="tech-card">
                    <div className="tech-logo">
                      <img src={tech.logo} alt={tech.name} onError={(e) => { e.target.style.display='none'; e.target.nextElementSibling.style.display='flex'; }} />
                      <div className="tech-fallback" style={{ display: 'none' }}>{tech.name.charAt(0)}</div>
                    </div>
                    <span className="tech-name">{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="portfolioSection">
        <div className="section-head text-center">
          <SectionEyebrow className="eyebrow-with-line">Portfolio</SectionEyebrow>
          <SectionTitle centered>Nos réalisations</SectionTitle>
          <ContentBlock centered>
            <p>Découvrez quelques-uns de nos projets informatiques récents</p>
          </ContentBlock>
        </div>
        <div className="properties-grid">
          {itServicesData.portfolio.map((project, index) => (
            <div key={index} className="service-card">
              <div className="ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
              </div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <a href={project.link} className="btn btn-secondary btn-small">Voir le projet</a>
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
          {itServicesData.stats.map((stat, index) => (
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
            <p>Découvrez les retours de nos clients sur nos services informatiques</p>
          </ContentBlock>
        </div>
        <div className="testimonials-carousel">
          {itServicesData.testimonials.map((testimonial, index) => (
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
            <p>Les réponses à vos questions sur nos services</p>
          </ContentBlock>
        </div>
        <div className="faq-container">
          {itServicesData.faq.map((item, index) => (
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
          <SectionEyebrow className="eyebrow-with-line">Formulaire de contact</SectionEyebrow>
          <SectionTitle centered>Décrivez votre projet</SectionTitle>
          <ContentBlock centered>
            <p>Remplissez le formulaire ci-dessous pour nous faire part de vos besoins</p>
          </ContentBlock>
        </div>
        <div className="contact-form-wrapper">
          <form id="itServicesForm" className="contact-form" onSubmit={handleItServicesFormSubmit}>
            {itServicesData.form.fields.map((field, index) => (
              <div key={index} className="field">
                <label>{field.label}</label>
                {field.type === 'select' ? (
                  <select name={field.name} required={field.required} value={itServicesFormData[field.name]} onChange={handleItServicesFormChange}>
                    <option value="">Choisissez...</option>
                    {field.options.map((opt, i) => (
                      <option key={i} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea name={field.name} required={field.required} rows="4" value={itServicesFormData[field.name]} onChange={handleItServicesFormChange}></textarea>
                ) : (
                  <input type={field.type} name={field.name} required={field.required} value={itServicesFormData[field.name]} onChange={handleItServicesFormChange} />
                )}
              </div>
            ))}
            <button type="submit" className="btn btn-primary">Envoyer</button>
            <div className="form-msg">{itServicesFormMsg}</div>
          </form>
        </div>
      </Section>

      <Section className="cta-section">
        <h2>Développez vos projets numériques avec nous</h2>
        <p>Notre équipe d'experts vous accompagne dans la conception et la réalisation de vos projets informatiques</p>
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
                <label>Date souhaitée</label>
                <input type="date" name="date" required value={rdvFormData.date} onChange={handleRdvFormChange} />
              </div>
              <div className="field">
                <label>Créneau horaire</label>
                <select name="creneau" required value={rdvFormData.creneau} onChange={handleRdvFormChange}>
                  <option value="">Sélectionnez un créneau</option>
                  <option value="Matin (9h-12h)">Matin (9h-12h)</option>
                  <option value="Après-midi (14h-17h)">Après-midi (14h-17h)</option>
                  <option value="Soir (17h-19h)">Soir (17h-19h)</option>
                </select>
              </div>
              <div className="field">
                <label>Bien concerné (optionnel)</label>
                <input type="text" name="bien" value={rdvFormData.bien} onChange={handleRdvFormChange} />
              </div>
              <div className="field">
                <label>Message (optionnel)</label>
                <textarea name="message" rows="3" value={rdvFormData.message} onChange={handleRdvFormChange}></textarea>
              </div>
              <button type="submit" className="btn btn-primary">Envoyer ma demande</button>
              <div className="form-msg">{rdvFormMsg}</div>
            </form>
          </div>
        </div>
      )}

      <WhatsAppFloat />
    </div>
  );
};

export default ServicesInformatiques;
