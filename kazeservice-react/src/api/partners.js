import apiClient, { isApiConfigured } from '../lib/apiClient';
import { STATUS_CONFIG } from '../lib/config';
import { validateImageFile } from '../utils/fileValidation';

const DEMO_PARTNERS = [];

export async function getPartners() {
  if (!isApiConfigured) return DEMO_PARTNERS;
  try {
    const { data } = await apiClient.get('/partners');
    return data;
  } catch (error) {
    console.error('getPartners:', error.message);
    return DEMO_PARTNERS;
  }
}

export async function getAllPartners() {
  if (!isApiConfigured) return [];
  const { data } = await apiClient.get('/partners/all');
  return data;
}

export async function createPartner(payload) {
  if (!isApiConfigured) throw new Error('API non configuré');
  const { data } = await apiClient.post('/partners', payload);
  return data;
}

export async function updatePartner(id, payload) {
  if (!isApiConfigured) throw new Error('API non configuré');
  const { data } = await apiClient.put(`/partners/${id}`, payload);
  return data;
}

export async function updatePartnerStatus(id, statut) {
  if (!isApiConfigured) throw new Error('API non configuré');
  const { data } = await apiClient.patch(`/partners/${id}/status`, { statut });
  return data;
}

export async function deletePartner(id) {
  if (!isApiConfigured) throw new Error('API non configuré');
  await apiClient.delete(`/partners/${id}`);
}

export async function uploadPartnerLogo(file, id) {
  if (!isApiConfigured) throw new Error('API non configuré');

  if (!file) throw new Error('Aucun fichier fourni');

  // Validation du fichier
  const validation = validateImageFile(file);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  const formData = new FormData();
  formData.append('logo', file);

  try {
    const { data } = await apiClient.post(`/partners/${id}/logo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data.url;
  } catch (error) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw error;
  }
}
