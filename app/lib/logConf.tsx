import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080', // Remplace par l'URL de ton backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async (username: string, password: string) => {
  try {
    const response = await apiClient.post('/api/auth/authenticate', {
      username: username,
      password: password,
    });
    return response.data; // Contient le token JWT
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la connexion');
  }
};

export const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};
