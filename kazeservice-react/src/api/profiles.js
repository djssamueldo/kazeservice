import apiClient, { isApiConfigured } from '../lib/apiClient';

/**
 * Pages qu'un admin secondaire ("Administrateur", techniquement role='staff')
 * peut se voir attribuer, individuellement. Chaque case est indépendante :
 * on peut donner Biens sans donner Partenaires, etc. Il n'y a plus de page
 * "toujours réservée" — tout est décidé au cas par cas par l'admin principal.
 */
export const GRANTABLE_PERMISSIONS = [
  { key: 'biens', label: 'Biens' },
  { key: 'partenaires', label: 'Partenaires' },
  { key: 'agences', label: 'Agences' },
  { key: 'formations', label: 'Formations' },
  { key: 'rendezvous', label: 'Rendez-vous' },
  { key: 'messages', label: 'Messages' },
  { key: 'reglages', label: 'Réglages du site' },
];

/** Liste tous les profils enregistrés (réservé à l'admin principal, via RLS). */
export async function getAllProfiles() {
  if (!isApiConfigured) return [];
  const { data } = await apiClient.get('/profiles');
  return data;
}

/**
 * Un profil est considéré "staff" (à afficher dans l'onglet Accès) s'il est
 * l'admin principal, ou s'il a au moins une permission accordée. Un simple
 * client/partenaire/visiteur sans aucune case cochée n'apparaît jamais ici.
 */
export function isStaffProfile(profile) {
  return profile.role === 'admin' || Object.values(profile.permissions || {}).some(Boolean);
}

/**
 * Coche/décoche une permission pour un profil. Dès qu'une première
 * permission est accordée à un simple client, son rôle passe automatiquement
 * à 'staff' — ce qui lui affiche le badge "Administrateur" sur son compte,
 * sans jamais lui donner un accès complet (ça reste 100% basé sur les
 * cases cochées, l'admin principal reste le seul avec role='admin').
 */
export async function updateProfilePermissions(userId, currentRole, permissions) {
  if (!isApiConfigured) throw new Error('API non configuré');
  const { data } = await apiClient.patch(`/profiles/${userId}/permissions`, {
    permissions,
    currentRole,
  });
  return data;
}