import apiClient, { isApiConfigured } from '../lib/apiClient';

// Agences de démonstration — utilisées tant que l'API n'est pas configuré,
// pour que la page Contact continue de fonctionner sans backend branché.
const DEMO_AGENCES = [
  {
    id: 'demo-1',
    nom: 'Agence Centrale',
    adresse: '966 avenue AKEI, Lomé, Togo',
    telephones: ['+228 92 99 97 38'],
    whatsapp: '+228 92 99 97 38',
    email: 'kazeservices@gmail.com',
    horaires: ['Lun - Ven: 8h - 18h', 'Sam: 9h - 13h'],
    latitude: 6.123456789,
    longitude: 1.123456789,
  },
];

// L'interface publique de cette API expose "latitude" et "longitude" pour OpenStreetMap
// alors que les colonnes Laravel s'appellent "latitude" et "longitude" (même nom)
function fromApiShape(row) {
  // Convertir horaires string en tableau si nécessaire
  if (row.horaires && typeof row.horaires === 'string') {
    row.horaires = row.horaires.split('|').map(h => h.trim()).filter(Boolean);
  }
  return row;
}
function toApiShape(agence) {
  // Ne pas convertir horaires - le backend attend un tableau
  return { ...agence };
}

export async function getAgences() {
  if (!isApiConfigured) return DEMO_AGENCES;
  try {
    const { data } = await apiClient.get('/agencies');
    return data.map(fromApiShape);
  } catch (error) {
    console.error('getAgences:', error.message);
    return DEMO_AGENCES;
  }
}

export async function createAgence(agence) {
  if (!isApiConfigured) throw new Error('API non configuré');
  const { data } = await apiClient.post('/agencies', toApiShape(agence));
  return fromApiShape(data);
}

export async function updateAgence(id, agence) {
  if (!isApiConfigured) throw new Error('API non configuré');
  const { data } = await apiClient.put(`/agencies/${id}`, toApiShape(agence));
  return fromApiShape(data);
}

export async function deleteAgence(id) {
  if (!isApiConfigured) throw new Error('API non configuré');
  await apiClient.delete(`/agencies/${id}`);
}
