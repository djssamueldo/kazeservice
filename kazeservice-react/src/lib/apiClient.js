import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Indispensable pour les cookies cross-origin
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  withXSRFToken: true, // Nécessaire depuis axios 1.6+ pour les requêtes cross-origin
});

// Intercepteur pour gérer les erreurs
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthCheck = error.config?.url?.includes('/auth/me');
    if (error.response?.status === 401 && !isAuthCheck && window.location.pathname !== '/compte') {
      window.location.href = '/compte';
    }
    return Promise.reject(error);
  }
);

// Fonction pour obtenir le cookie CSRF avant login/register
export async function getCsrfCookie() {
  try {
    await axios.get(`${API_URL.replace('/api', '')}/sanctum/csrf-cookie`, {
      withCredentials: true,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du cookie CSRF:', error);
  }
}

export const isApiConfigured = Boolean(import.meta.env.VITE_API_URL);

export default apiClient;
