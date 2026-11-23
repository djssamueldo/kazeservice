import apiClient, { isApiConfigured } from '../lib/apiClient';

export async function createAppointment(payload) {
  if (!isApiConfigured) {
    console.warn('[createAppointment] API non configuré — rendez-vous non enregistré :', payload);
    return { ok: true, simulated: true };
  }
  const { data } = await apiClient.post('/appointments', {
    nom: payload.nom,
    telephone: payload.telephone,
    email: payload.email,
    motif: payload.motif,
    date_souhaitee: payload.date || null,
    creneau: payload.creneau || null,
    bien_id: payload.bien_id || null,
    message: payload.message || null,
  });
  return { ok: true, simulated: false };
}

export async function getMyAppointments(email) {
  if (!isApiConfigured || !email) return [];
  const { data } = await apiClient.get('/appointments/my', { params: { email } });
  return data;
}

export async function getAllAppointments() {
  if (!isApiConfigured) return [];
  const { data } = await apiClient.get('/appointments');
  return data;
}

export async function updateAppointmentStatus(id, statut) {
  if (!isApiConfigured) throw new Error('API non configuré');
  const { data } = await apiClient.patch(`/appointments/${id}/status`, { statut });
  return data;
}
