import apiClient, { isApiConfigured } from '../lib/apiClient';

// Valeurs par défaut tant que l'API n'est pas configuré, ou en secours
// si la connexion échoue — le site continue de fonctionner normalement.
const DEMO_SETTINGS = {
  telephone: '+228 92 99 97 38',
  email: 'kazeservices@gmail.com',
  whatsapp: '+228 92 99 97 38',
  adresse: '966 avenue AKEI, Lomé, Togo',
  horaires: 'Lun - Ven: 8h - 18h | Sam: 9h - 13h',
  facebook: '',
  instagram: '',
  linkedin: '',
};

export async function getSettings() {
  if (!isApiConfigured) return DEMO_SETTINGS;
  try {
    const { data } = await apiClient.get('/settings');
    return data;
  } catch (error) {
    console.error('getSettings:', error.message);
    return DEMO_SETTINGS;
  }
}

export async function updateSettings(settings) {
  if (!isApiConfigured) throw new Error('API non configuré');
  const { data } = await apiClient.put('/settings', settings);
  return data;
}

/** Construit une URL wa.me à partir du numéro WhatsApp enregistré. */
export function buildWhatsAppUrl(whatsapp, message = 'Bonjour Kazeservices, je souhaite avoir des informations') {
  const digits = (whatsapp || '').replace(/[^\d]/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
