// ==========================================================
// Données de démonstration — utilisées tant que Supabase n'est pas
// configuré, ou en secours si la connexion échoue. Source unique pour
// Formations.jsx (liste) et FormationDetail.jsx (fiche détaillée).
// ==========================================================

  export const DEMO_FORMATIONS = [
    {
      slug: "gestion-locative-professionnelle",
      titre: "Gestion Locative Professionnelle",
      description_courte: "Maîtrisez les fondamentaux de la gestion locative et optimisez vos revenus immobiliers.",
      description_complete: "Cette formation complète vous permet d'acquérir toutes les compétences nécessaires pour gérer efficacement un parc immobilier. Vous apprendrez à sélectionner les locataires, gérer les baux, assurer la maintenance des biens et optimiser votre rentabilité.",
      programme: [
        "Introduction à la gestion locative",
        "Sélection et qualification des locataires",
        "Rédaction et gestion des baux",
        "Gestion des charges et loyers",
        "Maintenance et entretien des biens",
        "Gestion des litiges et contentieux",
        "Optimisation fiscale de la location",
        "Outils et logiciels de gestion"
      ],
      duree: "40 heures",
      prix: "850€",
      niveauKey: "formations.level.beginner_intermediate",
      formatKey: "formations.format.in_person",
      langueKey: "formations.language.french",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop",
      objectifs: [
        "Gestion administrative : Maîtriser la gestion des baux, charges et loyers",
        "Relation locataire : Sélectionner et fidéliser vos locataires",
        "Rentabilité : Optimiser vos revenus locatifs"
      ],
      public_cible: [
        "Propriétaires bailleurs",
        "Gestionnaires immobiliers débutants",
        "Investisseurs immobiliers",
        "Agents immobiliers"
      ]
    },
    {
      slug: "investissement-immobilier-intelligent",
      titre: "Investissement Immobilier Intelligent",
      description_courte: "Apprenez à investir dans l'immobilier avec une stratégie rentable et sécurisée.",
      description_complete: "Découvrez les stratégies d'investissement immobilier les plus performantes. Cette formation vous guide dans l'analyse des opportunités, le financement, l'optimisation fiscale et la création d'un patrimoine immobilier durable.",
      programme: [
        "Analyse du marché immobilier",
        "Stratégies d'investissement",
        "Financement et optimisation du crédit",
        "Fiscalité immobilière avancée",
        "Sélection des biens rentables",
        "Gestion du patrimoine",
        "SCPI et autres véhicules d'investissement",
        "Études de cas pratiques"
      ],
      duree: "35 heures",
      prix: "950€",
      niveauKey: "formations.level.intermediate",
      formatKey: "formations.format.in_person",
      langueKey: "formations.language.french",
      image: "https://images.unsplash.com/photo-1560520656-9a0e4c059f7c?w=800&auto=format&fit=crop",
      objectifs: [
        "Analyse de marché : Identifier les meilleures opportunités",
        "Financement : Optimiser votre crédit immobilier",
        "Rentabilité : Maximiser votre retour sur investissement"
      ],
      public_cible: [
        "Investisseurs débutants",
        "Particuliers souhaitant investir",
        "Professionnels en reconversion",
        "Propriétaires souhaitant optimiser"
      ]
    },
    {
      slug: "architecture-interieur-design",
      titre: "Architecture d'Intérieur & Design",
      description_courte: "Développez votre créativité et maîtrisez les techniques d'architecture d'intérieur.",
      description_complete: "Plongez dans l'univers de l'architecture d'intérieur et du design. Cette formation vous permet d'acquérir les compétences techniques et artistiques pour concevoir des espaces harmonieux, fonctionnels et esthétiques.",
      programme: [
        "Fondamentaux du design d'intérieur",
        "Théorie des couleurs et matières",
        "Planification et agencement",
        "Logiciels de CAO/DAO",
        "Éclairage et ambiance",
        "Mobilier et décoration",
        "Normes et réglementations",
        "Projet de fin de formation"
      ],
      duree: "60 heures",
      prix: "1200€",
      niveauKey: "formations.level.all_levels",
      formatKey: "formations.format.in_person",
      langueKey: "formations.language.french",
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop",
      objectifs: [
        "Créativité : Développer votre sens artistique",
        "Technique : Maîtriser les outils professionnels",
        "Conception : Créer des espaces harmonieux"
      ],
      public_cible: [
        "Débutants en design",
        "Architectes d'intérieur en formation",
        "Décorateurs",
        "Particuliers passionnés"
      ]
    },
    {
      slug: "droit-immobilier-pratique",
      titre: "Droit Immobilier Pratique",
      description_courte: "Maîtrisez les aspects juridiques de l'immobilier pour sécuriser vos transactions.",
      description_complete: "Cette formation pratique couvre tous les aspects juridiques de l'immobilier : contrats, baux, copropriété, fiscalité et contentieux. Acquérez les compétences nécessaires pour naviguer dans le cadre légal immobilier.",
      programme: [
        "Droit des contrats immobiliers",
        "Bail d'habitation et commercial",
        "Régime de copropriété",
        "Fiscalité immobilière",
        "Contentieux immobiliers",
        "Formalités administratives",
        "Assurance et garanties",
        "Études de cas juridiques"
      ],
      duree: "30 heures",
      prix: "750€",
      niveauKey: "formations.level.intermediate",
      formatKey: "formations.format.in_person",
      langueKey: "formations.language.french",
      image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&auto=format&fit=crop",
      objectifs: [
        "Juridique : Comprendre le cadre légal",
        "Pratique : Gérer les formalités",
        "Sécurité : Éviter les risques juridiques"
      ],
      public_cible: [
        "Agents immobiliers",
        "Gestionnaires locatifs",
        "Propriétaires bailleurs",
        "Juristes débutants"
      ]
    },
    {
      slug: "commercialisation-immobiliere",
      titre: "Commercialisation Immobilière",
      description_courte: "Développez vos compétences en vente et négociation immobilière.",
      description_complete: "Apprenez les techniques de vente et de négociation spécifiques à l'immobilier. Cette formation vous permet de maîtriser l'ensemble du processus de commercialisation : de l'estimation à la signature.",
      programme: [
        "Techniques de vente immobilière",
        "Négociation et psychologie",
        "Estimation et valorisation",
        "Marketing immobilier",
        "Visites et présentation",
        "Gestion de clientèle",
        "Closing et signature",
        "Suivi post-vente"
      ],
      duree: "25 heures",
      prix: "650€",
      niveauKey: "formations.level.all_levels",
      formatKey: "formations.format.in_person",
      langueKey: "formations.language.french",
      image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&auto=format&fit=crop",
      objectifs: [
        "Vente : Optimiser vos techniques",
        "Négociation : Maximiser vos résultats",
        "Clientèle : Fidéliser vos contacts"
      ],
      public_cible: [
        "Agents immobiliers",
        "Commerciaux en immobilier",
        "Débutants en vente",
        "Entrepreneurs immobiliers"
      ]
    },
    {
      slug: "gestion-de-projet-construction",
      titre: "Gestion de Projet Construction",
      description_courte: "Maîtrisez la gestion complète de projets de construction et rénovation.",
      description_complete: "Cette formation complète vous permet de gérer des projets de construction de A à Z : planification, coordination, suivi de chantier, gestion des délais et budgets. Acquérez les compétences d'un chef de projet immobilier.",
      programme: [
        "Planification de projet",
        "Gestion des délais et budgets",
        "Coordination des intervenants",
        "Suivi de chantier",
        "Normes et sécurité",
        "Gestion des imprévus",
        "Livraison et réception",
        "Gestion post-projet"
      ],
      duree: "45 heures",
      prix: "1100€",
      niveauKey: "formations.level.intermediate_advanced",
      formatKey: "formations.format.in_person",
      langueKey: "formations.language.french",
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop",
      objectifs: [
        "Gestion : Piloter vos projets",
        "Coordination : Optimiser les ressources",
        "Qualité : Garantir les standards"
      ],
      public_cible: [
        "Chefs de projet",
        "Architectes",
        "Entrepreneurs",
        "Gestionnaires immobiliers"
      ]
    }
  ];
