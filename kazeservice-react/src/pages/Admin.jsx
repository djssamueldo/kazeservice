import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PropertyImageUploader from '../components/PropertyImageUploader';
import PropertyCharacteristicEditor from '../components/PropertyCharacteristicEditor';
import { PROPERTY_TYPES, formatPrice } from '../data/propertyTypes';
import '../styles/style.css';
import { getSession, getMyProfile } from '../api/auth';
import {
  getProperties, createProperty, updateProperty, deleteProperty, updatePropertyStatus,
  uploadPropertyImages, deletePropertyImage
} from '../api/properties';
import { getAllAppointments, updateAppointmentStatus } from '../api/appointments';
import { getMessages, updateMessageStatus } from '../api/messages';
import {
  getAllPartners, createPartner, updatePartner, updatePartnerStatus, deletePartner, uploadPartnerLogo,
} from '../api/partners';
import { getAgences, createAgence, updateAgence, deleteAgence } from '../api/agences';
import { getFormations, createFormation, updateFormation, deleteFormation } from '../api/formations';
import { getSettings, updateSettings } from '../api/settings';
import { getAllProfiles, updateProfilePermissions, GRANTABLE_PERMISSIONS, isStaffProfile } from '../api/profiles';
import apiClient from '../lib/apiClient';
import { normalizeFormationImageUrl, isValidImageUrlForUpload } from '../utils/imageUtils';
import { generateSlug } from '../utils/stringUtils';
import { getEditablePropertyImages } from '../utils/propertyImages';

const EMPTY_PROPERTY = {
  titre: '', type: 'vente', type_bien: 'maison', ville: '', prix: '',
  image: '', description: '', statut: 'disponible',
};

const EMPTY_AGENCE = {
  nom: '', adresse: '', telephonesText: '', whatsapp: '', email: '', horaires: [''], latitude: '', longitude: '',
};

const EMPTY_FORMATION = {
  titre: '', slug: '', description_courte: '', description_complete: '',
  duree: '', prix: '', niveau: '', format: '', langue: '', image: '',
  prerequisText: '', certification: '', places_disponibles: '', date_debut: '',
  programmeText: '', objectifsText: '', publicCibleText: '', statut: 'publie',
};

const Admin = () => {
  // --- Accès ---
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);       // admin principal : accès à tout
  const [permissions, setPermissions] = useState({});  // admin secondaire : accès page par page
  const [isStaff, setIsStaff] = useState(false);       // admin OU au moins une permission accordée
  const [activeTab, setActiveTab] = useState(null);

  // --- Biens ---
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [propertySearch, setPropertySearch] = useState('');
  const [propertySort, setPropertySort] = useState('date_desc');

  // --- Rendez-vous ---
  const [appointments, setAppointments] = useState([]);

  // --- Messages ---
  const [messages, setMessages] = useState([]);
  const [messageFilter, setMessageFilter] = useState('');
  const [messageStatusFilter, setMessageStatusFilter] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);

  // --- Partenaires ---
  const [partners, setPartners] = useState([]);
  const [partnerFile, setPartnerFile] = useState(null);
  const [partnerName, setPartnerName] = useState('');
  const [partnerUploading, setPartnerUploading] = useState(false);
  const [isEditingPartner, setIsEditingPartner] = useState(false);
  const [editingPartner, setEditingPartner] = useState({});

  // --- Agences ---
  const [agences, setAgences] = useState([]);
  const [isEditingAgence, setIsEditingAgence] = useState(false);
  const [editingAgence, setEditingAgence] = useState(EMPTY_AGENCE);

  // --- Formations ---
  const [formations, setFormations] = useState([]);
  const [isEditingFormation, setIsEditingFormation] = useState(false);
  const [editingFormation, setEditingFormation] = useState(EMPTY_FORMATION);
  const [formationImageFile, setFormationImageFile] = useState(null);
  const [formationUploading, setFormationUploading] = useState(false);

  // --- Réglages du site ---
  const [settingsForm, setSettingsForm] = useState(null);
  const [settingsMsg, setSettingsMsg] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);

  // --- Accès (admin principal uniquement) ---
  const [allProfiles, setAllProfiles] = useState([]);
  const [savingProfileId, setSavingProfileId] = useState(null);
  const [accessSearch, setAccessSearch] = useState('');

  // Vérifie l'accès de l'utilisateur connecté : admin principal (tout),
  // ou profil secondaire avec des permissions page par page.
  useEffect(() => {
    const checkAccess = async () => {
      const session = await getSession();
      if (!session?.user) {
        setChecking(false);
        return;
      }
      const profile = await getMyProfile(session.user.id);
      const admin = profile?.role === 'admin';
      const perms = profile?.permissions || {};
      const staff = admin || Object.values(perms).some(Boolean);

      setIsAdmin(admin);
      setPermissions(perms);
      setIsStaff(staff);
      setChecking(false);
    };
    checkAccess();
  }, []);

  // Détermine les onglets visibles selon les droits, et sélectionne le premier par défaut
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return '';
    // Si c'est un timestamp (nombre), le convertir en date
    if (typeof dateValue === 'number') {
      const date = new Date(dateValue);
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
    // Si c'est une chaîne de date (format ISO ou autre), la convertir
    if (typeof dateValue === 'string') {
      const date = new Date(dateValue);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
      }
    }
    // Fallback : retourner la valeur originale
    return dateValue;
  };

  const canSee = (tab) => {
    if (isAdmin) return true;
    if (tab === 'acces') return false; // réservé à l'admin principal
    return !!permissions[tab];
  };
  const visibleTabs = ['biens', 'rendezvous', 'messages', 'partenaires', 'agences', 'formations', 'reglages', 'acces']
    .filter(canSee);

  useEffect(() => {
    if (isStaff && !activeTab && visibleTabs.length > 0) {
      setActiveTab(visibleTabs[0]);
    }
  }, [isStaff, visibleTabs.join(','), activeTab]);

  // Charge les données de l'onglet actif une fois l'accès confirmé
  useEffect(() => {
    if (!isStaff) return;
    if (canSee('biens')) getProperties().then(props => {
      // Trier les biens par date de création (plus récents en premier)
      const sorted = [...props].sort((a, b) => {
        const dateA = new Date(a.created_at || 0);
        const dateB = new Date(b.created_at || 0);
        const validDateA = isNaN(dateA.getTime()) ? 0 : dateA.getTime();
        const validDateB = isNaN(dateB.getTime()) ? 0 : dateB.getTime();
        return validDateB - validDateA;
      });
      setProperties(sorted);
    });
    if (canSee('rendezvous')) getAllAppointments().then(setAppointments);
    if (canSee('messages')) getMessages().then(setMessages);
    if (canSee('partenaires')) getAllPartners().then(setPartners);
    if (canSee('agences')) getAgences().then(setAgences);
    if (canSee('formations')) getFormations().then(setFormations);
    if (canSee('reglages')) getSettings().then(setSettingsForm);
    if (canSee('acces')) getAllProfiles().then(setAllProfiles);
  }, [isStaff]);

  // ----- Biens -----
  const openAddProperty = () => {
    setEditingProperty(EMPTY_PROPERTY);
    setExistingImages([]);
    setNewImages([]);
    setIsEditing(true);
  };

  const openEditProperty = (property) => {
    setEditingProperty(property);
    // Fusionner images[] et image (principale) : les anciens biens qui
    // n'ont que 'image' remplie doivent voir leur photo dans l'éditeur.
    setExistingImages(getEditablePropertyImages(property));
    setNewImages([]);
    setIsEditing(true);
  };

  const handleCharacteristicChange = (characteristics) => {
    // Remplacer complètement les caractéristiques (pas de fusion)
    // pour permettre la suppression de caractéristiques personnalisées
    const nonCharacteristicKeys = [
      'id', 'reference', 'titre', 'type', 'type_bien', 'ville', 'prix',
      'description', 'image', 'images', 'statut', 'published_at', 'created_at', 'updated_at',
      'caracteristiques'
    ];

    const updatedProperty = { ...editingProperty };

    // Supprimer toutes les anciennes caractéristiques
    Object.keys(updatedProperty).forEach(key => {
      if (!nonCharacteristicKeys.includes(key)) {
        delete updatedProperty[key];
      }
    });

    // Ajouter les nouvelles caractéristiques
    Object.entries(characteristics).forEach(([key, value]) => {
      updatedProperty[key] = value;
    });

    setEditingProperty(updatedProperty);
  };

  const handlePropertyFieldChange = (e) => {
    setEditingProperty({ ...editingProperty, [e.target.name]: e.target.value });
  };

  const handleSaveProperty = async (e) => {
    e.preventDefault();
    setUploadingImages(true);
    try {
      let propertyId = editingProperty.id;
      let finalImages = [...existingImages];

      // Pour un nouveau bien : créer d'abord le bien pour obtenir l'ID réel
      if (!propertyId) {
        const propertyWithoutImages = {
          ...editingProperty,
          images: finalImages,
          image: finalImages[0] || null
        };
        const created = await createProperty(propertyWithoutImages);
        propertyId = created.id;
        console.log('[Save Property] Bien créé avec ID:', propertyId);
      }

      // Upload des nouvelles images avec l'ID réel
      if (newImages.length > 0) {
        console.log('[Save Property] Upload des images avec ID réel:', propertyId);
        const uploadResult = await uploadPropertyImages(newImages, propertyId);

        // Si tous les uploads ont échoué, ne pas sauvegarder le bien
        if (uploadResult.successful.length === 0 && uploadResult.failed.length > 0) {
          const errorMessages = uploadResult.failed.map(f => `- ${f.file}: ${f.error}`).join('\n');
          throw new Error(`Aucune image n'a pu être uploadée:\n${errorMessages}\n\nVeuillez vérifier les permissions Laravel Storage.`);
        }

        // Si certains uploads ont échoué, afficher un avertissement mais continuer
        if (uploadResult.failed.length > 0) {
          const errorMessages = uploadResult.failed.map(f => `- ${f.file}: ${f.error}`).join('\n');
          alert(`Certaines images n'ont pas pu être uploadées:\n${errorMessages}\n\nLes autres images seront enregistrées.`);
        }

        // Ajouter les images uploadées avec succès
        finalImages = [...finalImages, ...uploadResult.successful];
      }

      // Mettre à jour le bien avec les images (avec l'ID réel)
      const propertyWithImages = {
        ...editingProperty,
        id: propertyId,
        images: finalImages,
        image: finalImages[0] || null
      };

      await updateProperty(propertyId, propertyWithImages);
      console.log('[Save Property] Bien mis à jour avec images:', finalImages.length);

      const refreshed = await getProperties();
      setProperties(refreshed);
      setIsEditing(false);
      setExistingImages([]);
      setNewImages([]);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      alert("Erreur lors de l'enregistrement : " + error.message);
      // Ne pas réinitialiser le formulaire en cas d'erreur
      return;
    } finally {
      setUploadingImages(false);
    }
  };

  const handleDeleteProperty = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce bien ?')) return;
    try {
      await deleteProperty(id);
      setProperties(properties.filter((p) => p.id !== id));
    } catch (error) {
      alert("Erreur lors de la suppression : " + error.message);
    }
  };

  const handleToggleStatus = async (property) => {
    const nextStatus = property.statut === 'disponible' ? 'vendu' : 'disponible';
    try {
      await updatePropertyStatus(property.id, nextStatus);
      setProperties(properties.map((p) => (p.id === property.id ? { ...p, statut: nextStatus } : p)));
    } catch (error) {
      alert('Erreur : ' + error.message);
    }
  };

  // ----- Rendez-vous -----
  const handleAppointmentStatus = async (id, statut) => {
    try {
      await updateAppointmentStatus(id, statut);
      setAppointments(appointments.map((a) => (a.id === id ? { ...a, statut } : a)));
    } catch (error) {
      alert('Erreur : ' + error.message);
    }
  };

  // ----- Messages -----
  const filteredMessages = messages.filter((m) => {
    const typeMatch = !messageFilter || m.type === messageFilter;
    const statusMatch = !messageStatusFilter || m.statut === messageStatusFilter;
    return typeMatch && statusMatch;
  });
  const messageTypes = [...new Set(messages.map((m) => m.type))];

  const handleMessageStatus = async (id, statut) => {
    try {
      await updateMessageStatus(id, statut);
      setMessages(messages.map((m) => (m.id === id ? { ...m, statut } : m)));
    } catch (error) {
      alert('Erreur : ' + error.message);
    }
  };

  // ----- Partenaires -----
  const handlePartnerSubmit = async (e) => {
    e.preventDefault();
    setPartnerUploading(true);
    try {
      if (editingPartner.id) {
        // Modification : uploader l'image si fournie
        let logoUrl = editingPartner.logo;
        if (partnerFile) {
          try {
            logoUrl = await uploadPartnerLogo(partnerFile, editingPartner.id);
          } catch (uploadError) {
            console.error('Erreur upload logo:', uploadError);
            alert("Erreur lors de l'upload du logo : " + uploadError.message);
            // Continuer avec l'ancien logo
          }
        }

        // N'envoyer le logo que s'il a changé
        const payload = {
          nom: editingPartner.nom || '',
          description: editingPartner.description || '',
          site_web: editingPartner.site_web || '',
        };

        // Le logo est déjà uploadé via l'endpoint spécifique, ne pas l'envoyer dans le payload PUT

        if (!payload.nom) {
          alert('Le nom du partenaire est requis');
          return;
        }

        await updatePartner(editingPartner.id, payload);

        setPartners(partners.map((p) => (p.id === editingPartner.id ? { ...p, ...payload, logo: logoUrl || p.logo } : p)));
      } else {
        // Création : d'abord créer le partenaire sans image
        const newPartner = await createPartner({
          nom: editingPartner.nom,
          description: editingPartner.description,
          site_web: editingPartner.site_web,
        });

        // Ensuite uploader l'image si fournie (ne pas bloquer si erreur)
        if (partnerFile) {
          try {
            const logoUrl = await uploadPartnerLogo(partnerFile, newPartner.id);
            // Le logo est déjà uploadé via l'endpoint spécifique, pas besoin de mettre à jour le partenaire
          } catch (uploadError) {
            console.error('Erreur upload logo:', uploadError);
            // Ne pas afficher d'alerte pour ne pas bloquer l'utilisateur
          }
        }

        // Mettre à jour le statut
        await updatePartnerStatus(newPartner.id, 'publie');

        const refreshed = await getAllPartners();
        setPartners(refreshed);
      }

      setPartnerFile(null);
      setIsEditingPartner(false);
      setEditingPartner({});
      e.target.reset();
    } catch (error) {
      console.error('[handlePartnerSubmit] Error:', error);
      alert("Erreur lors de l'enregistrement du partenaire : " + error.message);
    } finally {
      setPartnerUploading(false);
    }
  };

  const handlePartnerStatus = async (id, statut) => {
    try {
      await updatePartnerStatus(id, statut);
      setPartners(partners.map((p) => (p.id === id ? { ...p, statut } : p)));
    } catch (error) {
      alert('Erreur : ' + error.message);
    }
  };

  const handleDeletePartner = async (id) => {
    if (!window.confirm('Supprimer ce partenaire ?')) return;
    try {
      await deletePartner(id);
      setPartners(partners.filter((p) => p.id !== id));
    } catch (error) {
      alert('Erreur : ' + error.message);
    }
  };

  const openEditPartner = (partner) => {
    setEditingPartner({ ...partner });
    setIsEditingPartner(true);
  };

  // ----- Agences -----
  const openAddAgence = () => {
    setEditingAgence(EMPTY_AGENCE);
    setIsEditingAgence(true);
  };

  const openEditAgence = (agence) => {
    setEditingAgence({
      ...agence,
      telephonesText: (agence.telephones || []).join(', '),
      horaires: (agence.horaires || []).join('\n'),
    });
    setIsEditingAgence(true);
  };

  const handleAgenceFieldChange = (e) => {
    setEditingAgence({ ...editingAgence, [e.target.name]: e.target.value });
  };

  const handleSaveAgence = async (e) => {
    e.preventDefault();
    const { telephonesText, horaires, ...rest } = editingAgence;
    const payload = {
      ...rest,
      telephones: telephonesText.split(',').map((t) => t.trim()).filter(Boolean),
      horaires: typeof horaires === 'string' ? horaires.split('\n').map(h => h.trim()).filter(Boolean) : (horaires || []),
    };
    try {
      if (editingAgence.id) {
        await updateAgence(editingAgence.id, payload);
      } else {
        await createAgence(payload);
      }
      const refreshed = await getAgences();
      setAgences(refreshed);
      setIsEditingAgence(false);
    } catch (error) {
      alert("Erreur lors de l'enregistrement : " + error.message);
    }
  };

  const handleDeleteAgence = async (id) => {
    if (!window.confirm('Supprimer cette agence ?')) return;
    try {
      await deleteAgence(id);
      setAgences(agences.filter((a) => a.id !== id));
    } catch (error) {
      alert('Erreur lors de la suppression : ' + error.message);
    }
  };

  // ----- Formations -----
  const openAddFormation = () => {
    setEditingFormation(EMPTY_FORMATION);
    setIsEditingFormation(true);
  };

  const openEditFormation = (formation) => {
    // Parser les champs qui peuvent être des chaînes JSON ou des tableaux
    const parseArray = (value) => {
      if (Array.isArray(value)) return value;
      if (typeof value === 'string') {
        try {
          return JSON.parse(value);
        } catch {
          return [];
        }
      }
      return [];
    };

    const parsedProgramme = parseArray(formation.programme);
    const parsedObjectifs = parseArray(formation.objectifs);
    const parsedPublicCible = parseArray(formation.public_cible);
    const parsedPrerequis = parseArray(formation.prerequis);

    const newEditingFormation = {
      id: formation.id,
      titre: formation.titre || '',
      slug: formation.slug || '',
      description_courte: formation.description_courte || '',
      description_complete: formation.description || '',
      duree: formation.duree || '',
      prix: formation.prix || '',
      niveau: formation.niveau || '',
      format: formation.format || '',
      langue: formation.langue || '',
      certification: formation.certification || '',
      places_disponibles: formation.places_disponibles || '',
      date_debut: formation.date_debut ? formation.date_debut.split('T')[0] : '',
      statut: formation.publie ? 'publie' : 'brouillon',
      image: formation.image || '',
      programmeText: parsedProgramme.join('\n'),
      objectifsText: parsedObjectifs.join('\n'),
      publicCibleText: parsedPublicCible.join('\n'),
      prerequisText: parsedPrerequis.join('\n'),
    };

    setEditingFormation(newEditingFormation);
    setFormationImageFile(null);
    setIsEditingFormation(true);
  };

  const handleFormationFieldChange = (e) => {
    setEditingFormation({ ...editingFormation, [e.target.name]: e.target.value });
  };

  const handleSaveFormation = async (e) => {
    e.preventDefault();
    setFormationUploading(true);

    try {
      const { programmeText, objectifsText, publicCibleText, prerequisText, duree, prix, places_disponibles, ...rest } = editingFormation;

      // Vérifier si l'image actuelle est un chemin temporaire et l'exclure du payload
      const isTempImage = rest.image && (rest.image.startsWith('C:\\') || rest.image.includes('Temp'));
      const payloadWithoutImage = { ...rest };
      if (isTempImage) {
        delete payloadWithoutImage.image;
      }

      // Adapter les noms de champs pour le backend
      const adaptedPayload = {
        titre: payloadWithoutImage.titre || '',
        slug: payloadWithoutImage.slug || generateSlug(payloadWithoutImage.titre || ''),
        description_courte: payloadWithoutImage.description_courte || '',
        description: payloadWithoutImage.description_complete || '',
        duree: duree || '',
        prix: parseFloat(prix) || 0,
        niveau: payloadWithoutImage.niveau || '',
        format: payloadWithoutImage.format || '',
        langue: payloadWithoutImage.langue || '',
        certification: payloadWithoutImage.certification || '',
        date_debut: payloadWithoutImage.date_debut || null,
        places_disponibles: places_disponibles ? parseInt(places_disponibles) : null,
        prerequis: JSON.stringify(prerequisText.split('\n').map((s) => s.trim()).filter(Boolean)),
        programme: JSON.stringify(programmeText.split('\n').map((s) => s.trim()).filter(Boolean)),
        objectifs: JSON.stringify(objectifsText.split('\n').map((s) => s.trim()).filter(Boolean)),
        public_cible: JSON.stringify(publicCibleText.split('\n').map((s) => s.trim()).filter(Boolean)),
        publie: payloadWithoutImage.statut === 'publie',
      };

      // Si une image est fournie, utiliser FormData avec l'image incluse
      if (formationImageFile) {
        const formData = new FormData();
        formData.append('titre', adaptedPayload.titre);
        formData.append('slug', adaptedPayload.slug);
        formData.append('description_courte', adaptedPayload.description_courte);
        formData.append('description', adaptedPayload.description);
        formData.append('duree', adaptedPayload.duree);
        formData.append('prix', adaptedPayload.prix);
        formData.append('niveau', adaptedPayload.niveau);
        formData.append('format', adaptedPayload.format);
        formData.append('langue', adaptedPayload.langue);
        formData.append('certification', adaptedPayload.certification);
        formData.append('date_debut', adaptedPayload.date_debut || '');
        formData.append('prerequis', adaptedPayload.prerequis);
        if (adaptedPayload.places_disponibles !== null && adaptedPayload.places_disponibles !== undefined) {
          formData.append('places_disponibles', adaptedPayload.places_disponibles);
        }
        formData.append('programme', adaptedPayload.programme);
        formData.append('objectifs', adaptedPayload.objectifs);
        formData.append('public_cible', adaptedPayload.public_cible);
        formData.append('publie', adaptedPayload.publie);
        formData.append('image', formationImageFile);

        if (editingFormation.id) {
          await apiClient.put(`/formations/${editingFormation.id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        } else {
          await apiClient.post('/formations', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        }
      } else {
        // Sans image, envoyer JSON normal
        const payload = adaptedPayload;

        if (editingFormation.id) {
          await updateFormation(editingFormation.id, payload);
        } else {
          await createFormation(payload);
        }
      }

      const refreshed = await getFormations();
      setFormations(refreshed);
      setIsEditingFormation(false);
      setFormationImageFile(null);
    } catch (error) {
      alert("Erreur lors de l'enregistrement : " + error.message);
    } finally {
      setFormationUploading(false);
    }
  };

  const handleDeleteFormation = async (id) => {
    if (!window.confirm('Supprimer cette formation ?')) return;
    try {
      await deleteFormation(id);
      setFormations(formations.filter((f) => f.id !== id));
    } catch (error) {
      alert('Erreur lors de la suppression : ' + error.message);
    }
  };

  // ----- Réglages du site -----
  const handleSettingsFieldChange = (e) => {
    setSettingsForm({ ...settingsForm, [e.target.name]: e.target.value });
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsMsg('');
    try {
      const { id, updated_at, ...payload } = settingsForm;
      await updateSettings(payload);
      setSettingsMsg('Réglages enregistrés avec succès.');
    } catch (error) {
      setSettingsMsg('Erreur : ' + error.message);
    } finally {
      setSavingSettings(false);
    }
  };

  // ----- Accès (admin principal uniquement) -----
  const handleTogglePermission = async (profileId, currentRole, currentPermissions, key, checked) => {
    setSavingProfileId(profileId);
    const nextPermissions = { ...currentPermissions, [key]: checked };
    const hasAnyPermission = Object.values(nextPermissions).some(Boolean);
    const nextRole = currentRole === 'admin' ? 'admin' : (hasAnyPermission ? 'staff' : 'client');
    try {
      await updateProfilePermissions(profileId, nextRole, nextPermissions);
      setAllProfiles(allProfiles.map((p) => (p.id === profileId ? { ...p, permissions: nextPermissions, role: nextRole } : p)));
    } catch (error) {
      alert('Erreur : ' + error.message);
    } finally {
      setSavingProfileId(null);
    }
  };

  // Filtrer et trier les biens
  const getFilteredAndSortedProperties = () => {
    let filtered = properties;

    // Filtrer par recherche
    if (propertySearch) {
      const searchLower = propertySearch.toLowerCase();
      filtered = filtered.filter(prop =>
        prop.titre?.toLowerCase().includes(searchLower) ||
        prop.ville?.toLowerCase().includes(searchLower) ||
        prop.type_bien?.toLowerCase().includes(searchLower) ||
        prop.type?.toLowerCase().includes(searchLower)
      );
    }

    // Trier
    const sorted = [...filtered].sort((a, b) => {
      switch (propertySort) {
        case 'date_desc':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'date_asc':
          return new Date(a.created_at) - new Date(b.created_at);
        case 'price_desc':
          return parseFloat(b.prix) - parseFloat(a.prix);
        case 'price_asc':
          return parseFloat(a.prix) - parseFloat(b.prix);
        case 'title_asc':
          return (a.titre || '').localeCompare(b.titre || '');
        case 'title_desc':
          return (b.titre || '').localeCompare(a.titre || '');
        default:
          return 0;
      }
    });

    return sorted;
  };

  if (checking) return null;

  if (!isStaff) {
    return (
      <div className="container blocked-view" style={{ maxWidth: 480, margin: '80px auto', textAlign: 'center' }}>
        <h1>Accès réservé</h1>
        <p style={{ color: 'var(--encre-douce)' }}>
          Cette page est réservée à l'équipe administrative de Kazeservices. Connectez-vous avec un compte autorisé pour continuer.
        </p>
        <Link to="/compte" className="btn btn-primary">Aller à la page de connexion</Link>
      </div>
    );
  }

  return (
    <>
      <header className="dashboard-header">
        <div className="container nav-row">
          <Link to="/" className="logo"><img src="/logo-kazeservice.jpg" alt="Kazeservices" className="header-logo-img" /></Link>
          <span className="dashboard-label">Tableau de bord</span>
          <div className="dashboard-header-right">
            <Link to="/" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Voir le site</Link>
            <Link to="/compte" className="account-avatar" aria-label="Mon compte" title="Mon compte">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12c2.485 0 4.5-2.015 4.5-4.5S14.485 3 12 3 7.5 5.015 7.5 7.5 9.515 12 12 12zm0 2.25c-3.004 0-9 1.508-9 4.5V21h18v-2.25c0-2.992-5.996-4.5-9-4.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>
            </Link>
          </div>
        </div>
      </header>

      <section className="section" id="adminContent">
        <div className="container">
          <h1>Administration</h1>

          <div className="admin-tabs">
            {canSee('biens') && <button className={`admin-tab ${activeTab === 'biens' ? 'active' : ''}`} onClick={() => setActiveTab('biens')}>Biens</button>}
            {canSee('rendezvous') && <button className={`admin-tab ${activeTab === 'rendezvous' ? 'active' : ''}`} onClick={() => setActiveTab('rendezvous')}>Rendez-vous</button>}
            {canSee('messages') && <button className={`admin-tab ${activeTab === 'messages' ? 'active' : ''}`} onClick={() => setActiveTab('messages')}>Messages</button>}
            {canSee('partenaires') && <button className={`admin-tab ${activeTab === 'partenaires' ? 'active' : ''}`} onClick={() => setActiveTab('partenaires')}>Partenaires</button>}
            {canSee('agences') && <button className={`admin-tab ${activeTab === 'agences' ? 'active' : ''}`} onClick={() => setActiveTab('agences')}>Agences</button>}
            {canSee('formations') && <button className={`admin-tab ${activeTab === 'formations' ? 'active' : ''}`} onClick={() => setActiveTab('formations')}>Formations</button>}
            {canSee('reglages') && <button className={`admin-tab ${activeTab === 'reglages' ? 'active' : ''}`} onClick={() => setActiveTab('reglages')}>Réglages</button>}
            {canSee('acces') && <button className={`admin-tab ${activeTab === 'acces' ? 'active' : ''}`} onClick={() => setActiveTab('acces')}>Accès</button>}
          </div>

          {/* ---------- BIENS ---------- */}
          <div className={`admin-panel ${activeTab === 'biens' ? 'active' : ''}`}>
            <div className="admin-panel-header">
              <h2>Gestion des biens</h2>
              <button className="btn btn-primary" onClick={openAddProperty}>+ Ajouter un bien</button>
            </div>

            {/* Recherche et tri */}
            <div className="admin-controls" style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '250px' }}>
                <input
                  type="text"
                  placeholder="Rechercher un bien (titre, ville, type...)"
                  value={propertySearch}
                  onChange={(e) => setPropertySearch(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                />
              </div>
              <div style={{ minWidth: '200px' }}>
                <select
                  value={propertySort}
                  onChange={(e) => setPropertySort(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                >
                  <option value="date_desc">Date (récent → ancien)</option>
                  <option value="date_asc">Date (ancien → récent)</option>
                  <option value="price_desc">Prix (élevé → bas)</option>
                  <option value="price_asc">Prix (bas → élevé)</option>
                  <option value="title_asc">Titre (A → Z)</option>
                  <option value="title_desc">Titre (Z → A)</option>
                </select>
              </div>
            </div>

            <table className="admin-table">
              <thead>
                <tr>
                  <th>Titre</th><th>Type</th><th>Prix</th><th>Ville</th><th>Statut</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredAndSortedProperties().map((prop) => (
                  <tr key={prop.id}>
                    <td>{prop.titre}</td>
                    <td>{prop.type_bien || prop.type}</td>
                    <td>{formatPrice(prop.prix)}</td>
                    <td>{prop.ville}</td>
                    <td>
                      <span className={`status-badge ${prop.statut === 'disponible' ? 'available' : 'sold'}`}>
                        {prop.statut || 'disponible'}
                      </span>
                    </td>
                    <td className="row-actions">
                      <button className="mini-btn" onClick={() => openEditProperty(prop)}>Modifier</button>
                      <button className="mini-btn" onClick={() => handleToggleStatus(prop)}>Statut</button>
                      <button className="mini-btn danger" onClick={() => handleDeleteProperty(prop.id)}>Supprimer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {getFilteredAndSortedProperties().length === 0 && properties.length > 0 && (
              <div className="empty-state"><p>Aucun bien ne correspond à votre recherche.</p></div>
            )}
            {properties.length === 0 && (
              <div className="empty-state"><p>Aucun bien enregistré. Cliquez sur "Ajouter un bien" pour commencer.</p></div>
            )}

            {isEditing && (
              <div className="admin-modal-overlay" onClick={() => setIsEditing(false)}>
                <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                  <h3>{editingProperty.id ? 'Modifier le bien' : 'Ajouter un bien'}</h3>
                  <form onSubmit={handleSaveProperty}>
                    <div className="field-row">
                      <div className="field"><label>Titre</label><input name="titre" value={editingProperty.titre} onChange={handlePropertyFieldChange} required /></div>
                      <div className="field"><label>Type</label>
                        <select name="type" value={editingProperty.type} onChange={handlePropertyFieldChange}>
                          <option value="vente">Vente</option>
                          <option value="location">Location</option>
                        </select>
                      </div>
                    </div>
                    <div className="field-row">
                      <div className="field"><label>Type de bien</label>
                        <select name="type_bien" value={editingProperty.type_bien} onChange={handlePropertyFieldChange}>
                          {Object.entries(PROPERTY_TYPES).map(([key, config]) => (
                            <option key={key} value={key}>{config.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="field"><label>Ville / quartier</label><input name="ville" value={editingProperty.ville} onChange={handlePropertyFieldChange} required /></div>
                    </div>
                    <div className="field-row">
                      <div className="field"><label>Prix</label><input name="prix" value={editingProperty.prix} onChange={handlePropertyFieldChange} required /></div>
                    </div>

                    <div className="field">
                      <label>Photos du bien</label>
                      <PropertyImageUploader
                        key={editingProperty.id || 'new'}
                        existingImages={existingImages}
                        newImages={newImages}
                        onChange={(existing, newImg) => {
                          setExistingImages(existing);
                          setNewImages(newImg);
                        }}
                      />
                    </div>

                    <PropertyCharacteristicEditor
                      typeBien={editingProperty.type_bien || 'maison'}
                      characteristics={(() => {
                        // Filtrer pour ne passer que les caractéristiques, pas les champs système
                        const nonCharacteristicKeys = [
                          'id', 'reference', 'titre', 'type', 'type_bien', 'ville', 'prix',
                          'description', 'image', 'images', 'statut', 'published_at', 'created_at', 'updated_at',
                          'caracteristiques'
                        ];
                        const filtered = {};
                        Object.keys(editingProperty).forEach(key => {
                          if (!nonCharacteristicKeys.includes(key)) {
                            filtered[key] = editingProperty[key];
                          }
                        });
                        return filtered;
                      })()}
                      onChange={handleCharacteristicChange}
                    />

                    <div className="field"><label>Description</label><textarea name="description" value={editingProperty.description || ''} onChange={handlePropertyFieldChange} /></div>
                    <div className="admin-modal-actions">
                      <button type="button" className="btn btn-outline" onClick={() => setIsEditing(false)}>Annuler</button>
                      <button type="submit" className="btn btn-primary" disabled={uploadingImages}>
                        {uploadingImages ? 'Enregistrement en cours...' : 'Enregistrer'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>

          {/* ---------- RENDEZ-VOUS ---------- */}
          <div className={`admin-panel ${activeTab === 'rendezvous' ? 'active' : ''}`}>
            <h2>Demandes de rendez-vous</h2>
            <table className="admin-table">
              <thead><tr><th>Nom</th><th>Motif</th><th>Date</th><th>Contact</th><th>Statut</th><th>Actions</th></tr></thead>
              <tbody>
                {appointments.map((rdv) => (
                  <tr key={rdv.id}>
                    <td>{rdv.nom}</td>
                    <td>{rdv.motif}</td>
                    <td>{formatDate(rdv.date_souhaitee)} {rdv.creneau ? `(${rdv.creneau})` : ''}</td>
                    <td>{rdv.telephone}<br />{rdv.email}</td>
                    <td>{rdv.statut}</td>
                    <td className="row-actions">
                      <button className="mini-btn" onClick={() => handleAppointmentStatus(rdv.id, 'confirme')}>Confirmer</button>
                      <button className="mini-btn danger" onClick={() => handleAppointmentStatus(rdv.id, 'annule')}>Annuler</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {appointments.length === 0 && <div className="empty-state"><p>Aucune demande pour le moment.</p></div>}
          </div>

          {/* ---------- MESSAGES ---------- */}
          <div className={`admin-panel ${activeTab === 'messages' ? 'active' : ''}`}>
            <div className="admin-panel-header">
              <h2>Messages &amp; demandes</h2>
              <div className="admin-panel-filters">
                <select value={messageFilter} onChange={(e) => setMessageFilter(e.target.value)}>
                  <option value="">Tous les types</option>
                  {messageTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <select value={messageStatusFilter} onChange={(e) => setMessageStatusFilter(e.target.value)}>
                  <option value="">Tous les statuts</option>
                  <option value="nouveau">Nouveau</option>
                  <option value="lu">Lu</option>
                  <option value="traite">Traité</option>
                  <option value="archive">Archivé</option>
                </select>
              </div>
            </div>
            <table className="admin-table">
              <thead><tr><th>Type</th><th>Nom</th><th>Contact</th><th>Message</th><th>Date</th><th>Statut</th><th>Actions</th></tr></thead>
              <tbody>
                {filteredMessages.map((m) => (
                  <tr key={m.id}>
                    <td><span className="message-type-badge">{m.type}</span></td>
                    <td>{m.nom}</td>
                    <td>
                      {m.telephone && <div>{m.telephone}</div>}
                      {m.email && <div style={{ fontSize: '0.85rem', color: '#666' }}>{m.email}</div>}
                    </td>
                    <td style={{ maxWidth: 300 }}>
                      <div style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        cursor: 'pointer'
                      }} onClick={() => setSelectedMessage(m)} title="Cliquez pour voir le message complet">
                        {m.message || '(Pas de message)'}
                      </div>
                    </td>
                    <td>{formatDate(m.created_at)}</td>
                    <td>
                      <span className={`status-badge ${m.statut === 'nouveau' ? 'available' : m.statut === 'traite' ? 'sold' : 'pending'}`}>
                        {m.statut}
                      </span>
                    </td>
                    <td className="row-actions">
                      {m.statut === 'nouveau' && <button className="mini-btn" onClick={() => handleMessageStatus(m.id, 'lu')}>Marquer lu</button>}
                      {m.statut === 'lu' && <button className="mini-btn" onClick={() => handleMessageStatus(m.id, 'traite')}>Marquer traité</button>}
                      {m.statut !== 'archive' && <button className="mini-btn danger" onClick={() => handleMessageStatus(m.id, 'archive')}>Archiver</button>}
                      <button className="mini-btn" onClick={() => setSelectedMessage(m)}>Voir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredMessages.length === 0 && <div className="empty-state"><p>Aucun message pour le moment.</p></div>}
          </div>

          {/* ---------- MODAL MESSAGE DÉTAIL ---------- */}
          {selectedMessage && (
            <div className="admin-modal-overlay" onClick={() => setSelectedMessage(null)}>
              <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 600 }}>
                <button className="modal-close" onClick={() => setSelectedMessage(null)}>✕</button>
                <h3>Détail du message</h3>
                <div className="message-detail">
                  <div className="message-detail-row">
                    <strong>Type :</strong>
                    <span>{selectedMessage.type}</span>
                  </div>
                  <div className="message-detail-row">
                    <strong>Nom :</strong>
                    <span>{selectedMessage.nom}</span>
                  </div>
                  <div className="message-detail-row">
                    <strong>Email :</strong>
                    <span>{selectedMessage.email || '-'}</span>
                  </div>
                  <div className="message-detail-row">
                    <strong>Téléphone :</strong>
                    <span>{selectedMessage.telephone || '-'}</span>
                  </div>
                  <div className="message-detail-row">
                    <strong>Date :</strong>
                    <span>{formatDate(selectedMessage.created_at)}</span>
                  </div>
                  <div className="message-detail-row">
                    <strong>Statut :</strong>
                    <span className={`status-badge ${selectedMessage.statut === 'nouveau' ? 'available' : selectedMessage.statut === 'traite' ? 'sold' : 'pending'}`}>
                      {selectedMessage.statut}
                    </span>
                  </div>
                  <div className="message-detail-row message-detail-message">
                    <strong>Message :</strong>
                    <div className="message-content">{selectedMessage.message || '(Pas de message)'}</div>
                  </div>
                  {selectedMessage.donnees && Object.keys(selectedMessage.donnees).length > 0 && JSON.stringify(selectedMessage.donnees) !== '{}' && JSON.stringify(selectedMessage.donnees) !== '{"donnees":[]}' && (
                    <div className="message-detail-row">
                      <strong>Données additionnelles :</strong>
                      <pre style={{ background: '#f5f5f5', padding: 10, borderRadius: 4, fontSize: '0.85rem' }}>
                        {JSON.stringify(selectedMessage.donnees, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
                <div className="admin-modal-actions">
                  {selectedMessage.statut === 'nouveau' && <button className="btn btn-primary" onClick={() => { handleMessageStatus(selectedMessage.id, 'lu'); setSelectedMessage(null); }}>Marquer lu</button>}
                  {selectedMessage.statut === 'lu' && <button className="btn btn-primary" onClick={() => { handleMessageStatus(selectedMessage.id, 'traite'); setSelectedMessage(null); }}>Marquer traité</button>}
                  {selectedMessage.statut !== 'archive' && <button className="btn btn-secondary" onClick={() => { handleMessageStatus(selectedMessage.id, 'archive'); setSelectedMessage(null); }}>Archiver</button>}
                  <button className="btn btn-outline" onClick={() => setSelectedMessage(null)}>Fermer</button>
                </div>
              </div>
            </div>
          )}

          {/* ---------- PARTENAIRES ---------- */}
          <div className={`admin-panel ${activeTab === 'partenaires' ? 'active' : ''}`}>
            <div className="admin-panel-header">
              <h2>Gestion des partenaires</h2>
              <button className="btn btn-primary" onClick={() => setIsEditingPartner(true)}>+ Ajouter un partenaire</button>
            </div>

            {isEditingPartner && (
              <div className="admin-modal-overlay" onClick={() => setIsEditingPartner(false)}>
                <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                  <h3>{editingPartner.id ? "Modifier le partenaire" : 'Ajouter un partenaire'}</h3>
                  <form onSubmit={handlePartnerSubmit}>
                    <div className="field"><label>Nom de l'entreprise *</label>
                      <input value={editingPartner.nom || ''} onChange={(e) => setEditingPartner({...editingPartner, nom: e.target.value})} required />
                    </div>
                    <div className="field"><label>Description</label>
                      <textarea value={editingPartner.description || ''} onChange={(e) => setEditingPartner({...editingPartner, description: e.target.value})} rows="3" />
                    </div>
                    <div className="field"><label>Site web</label>
                      <input value={editingPartner.site_web || ''} onChange={(e) => setEditingPartner({...editingPartner, site_web: e.target.value})} />
                    </div>
                    <div className="field"><label>Logo (max 10MB)</label>
                      <input type="file" accept="image/*" onChange={(e) => setPartnerFile(e.target.files[0])} />
                      {editingPartner.logo && !partnerFile && (
                        <img src={editingPartner.logo} alt="Aperçu actuel" style={{ width: 100, marginTop: 10, borderRadius: 8 }} />
                      )}
                    </div>
                    <div className="admin-modal-actions">
                      <button type="button" className="btn btn-outline" onClick={() => setIsEditingPartner(false)}>Annuler</button>
                      <button type="submit" className="btn btn-primary" disabled={partnerUploading}>
                        {partnerUploading ? 'Envoi en cours…' : 'Enregistrer'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="partners-grid-admin">
              {partners.map((p) => (
                <div key={p.id} className="partner-card-admin">
                  <div className="partner-card-admin-image">
                    <img src={p.logo || p.image || 'https://via.placeholder.com/200'} alt={p.nom || p.nom_entreprise || 'Partenaire'} />
                    <span className={`status-badge ${p.statut === 'publie' ? 'available' : 'sold'}`}>
                      {p.statut || 'en_attente'}
                    </span>
                  </div>
                  <div className="partner-card-admin-content">
                    <h4>{p.nom || p.nom_entreprise || 'Partenaire sans nom'}</h4>
                    {p.description && <p style={{ fontSize: '0.85rem', color: 'var(--encre-douce)' }}>{p.description}</p>}
                    {p.site_web && <a href={p.site_web} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.85rem', color: 'var(--brique)' }}>Site web</a>}
                    <div className="partner-card-admin-actions">
                      {p.statut !== 'publie' && <button className="mini-btn" onClick={() => handlePartnerStatus(p.id, 'publie')}>Publier</button>}
                      {p.statut === 'publie' && <button className="mini-btn" onClick={() => handlePartnerStatus(p.id, 'brouillon')}>Dépublier</button>}
                      <button className="mini-btn" onClick={() => openEditPartner(p)}>Modifier</button>
                      <button className="mini-btn danger" onClick={() => handleDeletePartner(p.id)}>Supprimer</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {partners.length === 0 && <div className="empty-state"><p>Aucun partenaire pour le moment. Cliquez sur "Ajouter un partenaire" pour commencer.</p></div>}
          </div>

          {/* ---------- AGENCES ---------- */}
          <div className={`admin-panel ${activeTab === 'agences' ? 'active' : ''}`}>
            <div className="admin-panel-header">
              <h2>Gestion des agences</h2>
              <button className="btn btn-primary" onClick={openAddAgence}>+ Ajouter une agence</button>
            </div>
            <table className="admin-table">
              <thead><tr><th>Nom</th><th>Adresse</th><th>Téléphone(s)</th><th>Email</th><th>Actions</th></tr></thead>
              <tbody>
                {agences.map((agence) => (
                  <tr key={agence.id}>
                    <td>{agence.nom}</td>
                    <td>{agence.adresse}</td>
                    <td>{(agence.telephones || []).join(', ')}</td>
                    <td>{agence.email}</td>
                    <td className="row-actions">
                      <button className="mini-btn" onClick={() => openEditAgence(agence)}>Modifier</button>
                      <button className="mini-btn danger" onClick={() => handleDeleteAgence(agence.id)}>Supprimer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {agences.length === 0 && (
              <div className="empty-state"><p>Aucune agence enregistrée. Cliquez sur "Ajouter une agence" pour commencer.</p></div>
            )}

            {isEditingAgence && (
              <div className="admin-modal-overlay" onClick={() => setIsEditingAgence(false)}>
                <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                  <h3>{editingAgence.id ? "Modifier l'agence" : 'Ajouter une agence'}</h3>
                  <form onSubmit={handleSaveAgence}>
                    <div className="field"><label>Nom de l'agence</label><input name="nom" value={editingAgence.nom} onChange={handleAgenceFieldChange} required /></div>
                    <div className="field"><label>Adresse</label><input name="adresse" value={editingAgence.adresse} onChange={handleAgenceFieldChange} required /></div>
                    <div className="field"><label>Téléphone(s)
                      <span style={{ fontWeight: 400, color: 'var(--encre-douce)', fontSize: '.8rem' }}> — séparés par une virgule si plusieurs</span>
                    </label>
                      <input name="telephonesText" value={editingAgence.telephonesText} onChange={handleAgenceFieldChange} placeholder="+228 90 00 00 00, +228 91 00 00 00" required />
                    </div>
                    <div className="field-row">
                      <div className="field"><label>WhatsApp</label><input name="whatsapp" value={editingAgence.whatsapp} onChange={handleAgenceFieldChange} /></div>
                      <div className="field"><label>Email</label><input name="email" type="email" value={editingAgence.email} onChange={handleAgenceFieldChange} /></div>
                    </div>
                    <div className="field"><label>Horaires
                      <span style={{ fontWeight: 400, color: 'var(--encre-douce)', fontSize: '.8rem' }}> — une ligne par plage horaire</span>
                    </label>
                      <textarea name="horaires" value={editingAgence.horaires} onChange={handleAgenceFieldChange} placeholder="Lun - Ven: 8h - 18h&#10;Sam: 9h - 13h" rows="3" style={{ width: '100%', padding: '10px', border: '1px solid var(--ligne)', borderRadius: '6px', fontFamily: 'inherit', fontSize: '14px', resize: 'vertical' }} /></div>
                    <div className="field-row">
                      <div className="field"><label>Latitude</label><input name="latitude" type="number" step="any" value={editingAgence.latitude || ''} onChange={handleAgenceFieldChange} placeholder="6.123456789" /></div>
                      <div className="field"><label>Longitude</label><input name="longitude" type="number" step="any" value={editingAgence.longitude || ''} onChange={handleAgenceFieldChange} placeholder="1.123456789" /></div>
                    </div>
                    <div className="admin-modal-actions">
                      <button type="button" className="btn btn-outline" onClick={() => setIsEditingAgence(false)}>Annuler</button>
                      <button type="submit" className="btn btn-primary">Enregistrer</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>

          {/* ---------- FORMATIONS ---------- */}
          <div className={`admin-panel ${activeTab === 'formations' ? 'active' : ''}`}>
            <div className="admin-panel-header">
              <h2>Gestion des formations</h2>
              <button className="btn btn-primary" onClick={openAddFormation}>+ Ajouter une formation</button>
            </div>
            <table className="admin-table">
              <thead><tr><th>Titre</th><th>Durée</th><th>Niveau</th><th>Prix</th><th>Statut</th><th>Actions</th></tr></thead>
              <tbody>
                {[...formations].sort((a, b) => (b.id || 0) - (a.id || 0)).map((formation) => (
                  <tr key={formation.id || formation.slug}>
                    <td>{formation.titre}</td>
                    <td>{formation.duree}</td>
                    <td>{formation.niveau}</td>
                    <td>{formation.prix}</td>
                    <td>
                      <span className={`status-badge ${formation.publie ? 'available' : 'sold'}`}>
                        {formation.publie ? 'publié' : 'brouillon'}
                      </span>
                    </td>
                    <td className="row-actions">
                      <button className="mini-btn" onClick={() => openEditFormation(formation)}>Modifier</button>
                      <button className="mini-btn danger" onClick={() => handleDeleteFormation(formation.id)}>Supprimer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {formations.length === 0 && (
              <div className="empty-state"><p>Aucune formation enregistrée. Cliquez sur "Ajouter une formation" pour commencer.</p></div>
            )}

            {isEditingFormation && (
              <div className="admin-modal-overlay" onClick={() => setIsEditingFormation(false)}>
                <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                  <h3>{editingFormation.id ? 'Modifier la formation' : 'Ajouter une formation'}</h3>
                  <form onSubmit={handleSaveFormation}>
                    {/* Informations générales */}
                    <div className="field"><label>Titre de la formation</label>
                      <input name="titre" value={editingFormation.titre} onChange={handleFormationFieldChange} required placeholder="Gestion locative professionnelle" />
                    </div>
                    <div className="field"><label>Slug (URL)
                      <span style={{ fontWeight: 400, color: 'var(--encre-douce)', fontSize: '.8rem' }}> — laissez vide pour générer automatiquement</span>
                    </label>
                      <input name="slug" value={editingFormation.slug} onChange={handleFormationFieldChange} placeholder="gestion-locative-professionnelle" />
                    </div>
                    <div className="field"><label>Description courte (résumé)</label>
                      <textarea name="description_courte" value={editingFormation.description_courte} onChange={handleFormationFieldChange} rows={2} placeholder="Une brève description pour les cartes et listes..." />
                    </div>
                    <div className="field"><label>Description complète</label>
                      <textarea name="description_complete" value={editingFormation.description_complete} onChange={handleFormationFieldChange} rows={5} placeholder="Description détaillée de la formation..." />
                    </div>
                    <div className="field"><label>Image de couverture</label>
                      <input type="file" accept="image/*" onChange={(e) => setFormationImageFile(e.target.files[0])} />
                      {editingFormation.image && !formationImageFile && (
                        <img
                          src={normalizeFormationImageUrl(editingFormation.image)}
                          alt="Aperçu actuel"
                          style={{ width: 100, marginTop: 10, borderRadius: 8 }}
                          onError={(e) => { e.target.onerror = null; e.target.src = normalizeFormationImageUrl(null); }}
                        />
                      )}
                      {formationImageFile && (
                        <img
                          src={URL.createObjectURL(formationImageFile)}
                          alt="Aperçu nouveau"
                          style={{ width: 100, marginTop: 10, borderRadius: 8 }}
                        />
                      )}
                    </div>

                    {/* Détails pratiques */}
                    <div className="field-row">
                      <div className="field"><label>Durée</label>
                        <input name="duree" value={editingFormation.duree} onChange={handleFormationFieldChange} placeholder="40 heures" />
                      </div>
                      <div className="field"><label>Prix</label>
                        <input name="prix" value={editingFormation.prix} onChange={handleFormationFieldChange} placeholder="850€" />
                      </div>
                    </div>
                    <div className="field-row">
                      <div className="field"><label>Niveau</label>
                        <input name="niveau" value={editingFormation.niveau} onChange={handleFormationFieldChange} placeholder="Débutant à Intermédiaire" />
                      </div>
                      <div className="field"><label>Format</label>
                        <input name="format" value={editingFormation.format} onChange={handleFormationFieldChange} placeholder="Présentiel / En ligne" />
                      </div>
                    </div>
                    <div className="field-row">
                      <div className="field"><label>Langue</label>
                        <input name="langue" value={editingFormation.langue} onChange={handleFormationFieldChange} placeholder="Français" />
                      </div>
                      <div className="field"><label>Certification</label>
                        <input name="certification" value={editingFormation.certification} onChange={handleFormationFieldChange} placeholder="Certificat de completion" />
                      </div>
                    </div>
                    <div className="field-row">
                      <div className="field"><label>Places disponibles</label>
                        <input name="places_disponibles" value={editingFormation.places_disponibles} onChange={handleFormationFieldChange} placeholder="20" />
                      </div>
                      <div className="field"><label>Date de début</label>
                        <input name="date_debut" type="date" value={editingFormation.date_debut} onChange={handleFormationFieldChange} />
                      </div>
                    </div>

                    {/* Contenu pédagogique */}
                    <div className="field"><label>Prérequis
                      <span style={{ fontWeight: 400, color: 'var(--encre-douce)', fontSize: '.8rem' }}> — un prérequis par ligne</span>
                    </label>
                      <textarea name="prerequisText" value={editingFormation.prerequisText} onChange={handleFormationFieldChange} rows={3} placeholder="Aucun prérequis\nConnaissances de base en immobilier..." />
                    </div>
                    <div className="field"><label>Programme
                      <span style={{ fontWeight: 400, color: 'var(--encre-douce)', fontSize: '.8rem' }}> — une étape par ligne</span>
                    </label>
                      <textarea name="programmeText" value={editingFormation.programmeText} onChange={handleFormationFieldChange} rows={5} placeholder="Module 1: Introduction\nModule 2: Gestion locative\nModule 3: Législation..." />
                    </div>
                    <div className="field"><label>Objectifs pédagogiques
                      <span style={{ fontWeight: 400, color: 'var(--encre-douce)', fontSize: '.8rem' }}> — un objectif par ligne</span>
                    </label>
                      <textarea name="objectifsText" value={editingFormation.objectifsText} onChange={handleFormationFieldChange} rows={3} placeholder="Maîtriser les bases de la gestion locative\nComprendre la législation en vigueur..." />
                    </div>
                    <div className="field"><label>Public visé
                      <span style={{ fontWeight: 400, color: 'var(--encre-douce)', fontSize: '.8rem' }}> — un profil par ligne</span>
                    </label>
                      <textarea name="publicCibleText" value={editingFormation.publicCibleText} onChange={handleFormationFieldChange} rows={3} placeholder="Propriétaires bailleurs\nInvestisseurs immobiliers\nGestionnaires débutants..." />
                    </div>

                    <div className="field"><label>Statut</label>
                      <select name="statut" value={editingFormation.statut} onChange={handleFormationFieldChange}>
                        <option value="publie">Publiée</option>
                        <option value="brouillon">Brouillon</option>
                      </select>
                    </div>
                    <div className="admin-modal-actions">
                      <button type="button" className="btn btn-outline" onClick={() => setIsEditingFormation(false)}>Annuler</button>
                      <button type="submit" className="btn btn-primary" disabled={formationUploading}>
                        {formationUploading ? 'Envoi en cours…' : 'Enregistrer'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>

          {/* ---------- RÉGLAGES DU SITE ---------- */}
          <div className={`admin-panel ${activeTab === 'reglages' ? 'active' : ''}`}>
            <h2>Réglages du site</h2>
            <p style={{ color: 'var(--encre-douce)', fontSize: '.9rem', marginBottom: 20 }}>
              Ces informations sont utilisées partout sur le site : bouton WhatsApp, pied de page, page Contact.
            </p>
            {settingsForm && (
              <div className="form-card" style={{ maxWidth: 620 }}>
                <form onSubmit={handleSaveSettings}>
                  <div className="field-row">
                    <div className="field"><label>Téléphone</label><input name="telephone" value={settingsForm.telephone || ''} onChange={handleSettingsFieldChange} /></div>
                    <div className="field"><label>WhatsApp</label><input name="whatsapp" value={settingsForm.whatsapp || ''} onChange={handleSettingsFieldChange} placeholder="+228 90 00 00 00" /></div>
                  </div>
                  <div className="field"><label>Email</label><input name="email" type="email" value={settingsForm.email || ''} onChange={handleSettingsFieldChange} /></div>
                  <div className="field"><label>Adresse</label><input name="adresse" value={settingsForm.adresse || ''} onChange={handleSettingsFieldChange} /></div>
                  <div className="field"><label>Horaires</label><input name="horaires" value={settingsForm.horaires || ''} onChange={handleSettingsFieldChange} /></div>
                  <div className="field-row">
                    <div className="field"><label>Facebook</label><input name="facebook" value={settingsForm.facebook || ''} onChange={handleSettingsFieldChange} placeholder="https://facebook.com/..." /></div>
                    <div className="field"><label>Instagram</label><input name="instagram" value={settingsForm.instagram || ''} onChange={handleSettingsFieldChange} placeholder="https://instagram.com/..." /></div>
                  </div>
                  <div className="field"><label>LinkedIn</label><input name="linkedin" value={settingsForm.linkedin || ''} onChange={handleSettingsFieldChange} placeholder="https://linkedin.com/..." /></div>
                  <button type="submit" className="btn btn-primary" disabled={savingSettings}>
                    {savingSettings ? 'Enregistrement...' : 'Enregistrer les réglages'}
                  </button>
                  {settingsMsg && <p style={{ marginTop: 12, fontSize: '.9rem', color: 'var(--brique)' }}>{settingsMsg}</p>}
                </form>
              </div>
            )}
          </div>

          {/* ---------- ACCÈS (admin principal uniquement) ---------- */}
          <div className={`admin-panel ${activeTab === 'acces' ? 'active' : ''}`}>
            <h2>Gestion des accès</h2>
            <p style={{ color: 'var(--encre-douce)', fontSize: '.9rem', marginBottom: 20 }}>
              Cochez, pour chaque compte, les pages qu'il peut gérer — biens et partenaires compris.
              Dès qu'une case est cochée, le compte reçoit le badge "Administrateur" (son accès reste
              limité aux cases cochées, jamais plus). Les clients et partenaires ordinaires, sans aucune
              case cochée, n'apparaissent pas dans cette liste.
            </p>

            {(() => {
              const staffProfiles = allProfiles.filter(isStaffProfile);
              const searchResults = accessSearch.trim()
                ? allProfiles.filter((p) =>
                    !isStaffProfile(p) &&
                    ((p.nom || '').toLowerCase().includes(accessSearch.toLowerCase()) ||
                     (p.email || '').toLowerCase().includes(accessSearch.toLowerCase()))
                  )
                : [];

              const renderRow = (profile) => (
                <tr key={profile.id}>
                  <td>{profile.nom || '—'}</td>
                  <td>{profile.role === 'admin' ? 'Admin principal' : 'Administrateur'}</td>
                  {GRANTABLE_PERMISSIONS.map((perm) => (
                    <td key={perm.key}>
                      {profile.role === 'admin' ? (
                        <span style={{ color: 'var(--encre-douce)', fontSize: '.85rem' }}>✓ (toujours)</span>
                      ) : (
                        <input
                          type="checkbox"
                          checked={!!(profile.permissions || {})[perm.key]}
                          disabled={savingProfileId === profile.id}
                          onChange={(e) => handleTogglePermission(profile.id, profile.role, profile.permissions || {}, perm.key, e.target.checked)}
                        />
                      )}
                    </td>
                  ))}
                </tr>
              );

              return (
                <>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Nom</th><th>Rôle</th>
                        {GRANTABLE_PERMISSIONS.map((perm) => <th key={perm.key}>{perm.label}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {staffProfiles.map(renderRow)}
                    </tbody>
                  </table>
                  {staffProfiles.length === 0 && (
                    <div className="empty-state"><p>Aucun administrateur secondaire pour le moment.</p></div>
                  )}

                  <div style={{ marginTop: 36 }}>
                    <h3 style={{ marginBottom: 12 }}>Donner un premier accès à un client</h3>
                    <p style={{ color: 'var(--encre-douce)', fontSize: '.85rem', marginBottom: 12 }}>
                      Les clients et partenaires ordinaires n'apparaissent pas ci-dessus. Recherchez un compte
                      par nom ou email pour lui accorder sa première permission — il apparaîtra alors dans la
                      liste des administrateurs, juste au-dessus.
                    </p>
                    <input
                      type="text"
                      value={accessSearch}
                      onChange={(e) => setAccessSearch(e.target.value)}
                      placeholder="Rechercher par nom ou email..."
                      style={{ maxWidth: 360, marginBottom: 16, padding: '10px 14px', border: '1px solid var(--ligne)', borderRadius: 8 }}
                    />
                    {accessSearch.trim() && (
                      searchResults.length > 0 ? (
                        <table className="admin-table">
                          <thead>
                            <tr>
                              <th>Nom</th><th>Rôle</th>
                              {GRANTABLE_PERMISSIONS.map((perm) => <th key={perm.key}>{perm.label}</th>)}
                            </tr>
                          </thead>
                          <tbody>
                            {searchResults.map(renderRow)}
                          </tbody>
                        </table>
                      ) : (
                        <p style={{ color: 'var(--encre-douce)', fontSize: '.9rem' }}>Aucun compte trouvé pour "{accessSearch}".</p>
                      )
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Admin;