import apiClient, { isApiConfigured } from '../lib/apiClient';
import { DEMO_FORMATIONS } from '../data/formations';
import { slugify } from '../utils/stringUtils';

export async function getFormations() {
  if (isApiConfigured) {
    try {
      const { data } = await apiClient.get('/formations');
      return data;
    } catch (error) {
      console.error('getFormations:', error.message);
    }
  }
  return DEMO_FORMATIONS;
}

export async function getFormationBySlug(slug) {
  if (isApiConfigured) {
    try {
      const { data } = await apiClient.get(`/formations/${slug}`);
      return data;
    } catch (error) {
      console.error('getFormationBySlug:', error.message);
    }
  }
  return DEMO_FORMATIONS.find((f) => f.slug === slug) || null;
}

export async function createFormation(formation) {
  if (!isApiConfigured) throw new Error('API non configuré');
  const payload = { ...formation, slug: formation.slug || slugify(formation.titre) };
  const { data } = await apiClient.post('/formations', payload);
  return data;
}

export async function updateFormation(id, formation) {
  if (!isApiConfigured) throw new Error('API non configuré');
  const { data } = await apiClient.put(`/formations/${id}`, formation);
  return data;
}

export async function deleteFormation(id) {
  if (!isApiConfigured) throw new Error('API non configuré');
  await apiClient.delete(`/formations/${id}`);
}
