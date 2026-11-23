import apiClient, { isApiConfigured, getCsrfCookie } from '../lib/apiClient';

export async function signUp({ nom, email, password, role = 'client' }) {
  if (!isApiConfigured) throw new Error('API non configuré');

  // Obtenir le cookie CSRF avant register
  await getCsrfCookie();

  const { data } = await apiClient.post('/auth/register', {
    nom,
    email,
    password,
    role,
  });

  return data;
}

export async function signIn({ email, password }) {
  if (!isApiConfigured) throw new Error('API non configuré');

  // Obtenir le cookie CSRF avant login
  await getCsrfCookie();

  const { data } = await apiClient.post('/auth/login', {
    email,
    password,
  });

  return data;
}

export async function signOut() {
  if (!isApiConfigured) return;

  try {
    await apiClient.post('/auth/logout');
  } catch (error) {
    console.error('Erreur logout:', error);
  }
}

export async function getSession() {
  if (!isApiConfigured) return null;

  try {
    const { data } = await apiClient.get('/auth/me');
    return {
      user: data,
      access_token: null, // Plus de token avec les cookies
    };
  } catch (error) {
    return null;
  }
}

export async function getMyProfile(userId) {
  if (!isApiConfigured || !userId) return null;

  try {
    const { data } = await apiClient.get(`/auth/profile/${userId}`);
    return data;
  } catch (error) {
    console.error('Erreur getMyProfile:', error);
    return null;
  }
}

export function onAuthStateChange(callback) {
  const checkAuth = async () => {
    const session = await getSession();
    callback(session?.user || null);
  };

  checkAuth();
  const interval = setInterval(checkAuth, 30000);

  return () => clearInterval(interval);
}

export async function changePassword({ currentPassword, newPassword }) {
  if (!isApiConfigured) throw new Error('API non configuré');

  try {
    const { data } = await apiClient.post('/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('La fonctionnalité de changement de mot de passe n\'est pas encore implémentée sur le serveur.');
    }
    throw error;
  }
}

export async function sendVerificationEmail() {
  if (!isApiConfigured) throw new Error('API non configuré');

  try {
    const { data } = await apiClient.post('/auth/send-verification-email');
    return data;
  } catch (error) {
    throw error;
  }
}

export async function forgotPassword(email) {
  if (!isApiConfigured) throw new Error('API non configuré');

  try {
    const { data } = await apiClient.post('/auth/forgot-password', { email });
    return data;
  } catch (error) {
    throw error;
  }
}

export async function resetPassword({ token, email, password, password_confirmation }) {
  if (!isApiConfigured) throw new Error('API non configuré');

  try {
    const { data } = await apiClient.post('/auth/reset-password', {
      token,
      email,
      password,
      password_confirmation,
    });
    return data;
  } catch (error) {
    throw error;
  }
}

export async function checkEmail(email) {
  if (!isApiConfigured) throw new Error('API non configuré');

  try {
    const { data } = await apiClient.post('/auth/check-email', { email });
    return data;
  } catch (error) {
    throw error;
  }
}