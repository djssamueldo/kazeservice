import apiClient, { isApiConfigured } from '../lib/apiClient';

/**
 * Envoie un message générique (contact, demande d'estimation, gestion locative,
 * investissement, formation, partenariat, service informatique, placement de
 * personnel, transaction immobilière...). Remplace les anciens appels Formspree
 * qui n'étaient jamais configurés (ID placeholder "YOUR_FORMSPREE_ID").
 *
 * @param {string} type - identifie le formulaire d'origine, ex: 'contact', 'estimation'
 * @param {object} payload - { nom, email, telephone, message, ...autresChamps }
 */
export async function submitMessage(type, payload) {
  const { nom, email, telephone, message, ...donnees } = payload;

  if (!isApiConfigured) {
    console.warn(`[submitMessage:${type}] API non configuré — message non envoyé :`, payload);
    return { ok: true, simulated: true };
  }

  const { data } = await apiClient.post('/messages', {
    type,
    nom: nom || donnees.name || '',
    email: email || null,
    telephone: telephone || null,
    message: message || null,
    donnees,
  });

  return { ok: true, simulated: false };
}

/** Liste des messages pour l'admin, avec filtre optionnel par type. */
export async function getMessages(type = null) {
  if (!isApiConfigured) return [];
  const params = type ? { type } : {};
  const { data } = await apiClient.get('/messages', { params });
  return data;
}

export async function updateMessageStatus(id, statut) {
  if (!isApiConfigured) throw new Error('API non configuré');
  const { data } = await apiClient.patch(`/messages/${id}/status`, { statut });
  return data;
}
