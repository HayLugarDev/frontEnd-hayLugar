import api from '../services/apiService';

export const verifyActiveSession = async (): Promise<boolean> => {
  try {
    const response = await api.get('/auth/verify-session', { withCredentials: true });

    return !!response.data?.user?.id;
  } catch (error: any) {
    if (error.response?.status === 401) {
      return false; // Token inválido o expirado
    }
    console.error('Error al verificar sesión:', error);
    return false;
  }
};
