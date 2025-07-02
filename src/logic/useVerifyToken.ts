import { useUserStore } from '../store/userStore';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { verifyActiveSession } from '../middleware/verifyToken';
import api from '../services/apiService';

export function useVerifyToken() {
  const userStore = useUserStore();
  const router = useRouter();
  const isSessionInvalid = ref(false);

  const verifyToken = async (route?: string) => {
    try {
      const result = await verifyActiveSession();

      // Cierre de sesión explícito
      if (route === '/quit') {
        await api.post('/auth/signout', {}, { withCredentials: true });
        userStore.clearUser();
        userStore.expireSession();
        await router.push('/dashboard');
        window.location.reload();
        return;
      }

      // Si no está autenticado o token inválido
      if (!result || !userStore.isAuthenticated) {
        userStore.clearUser();
        isSessionInvalid.value = true;
        return;
      }

      // Si está todo OK
      isSessionInvalid.value = false;

      // Redirigir si hay ruta válida
      if (route && route !== '/quit') {
        await router.push(route);
      }
    } catch (error) {
      console.error('Error verifying session:', error);
      userStore.clearUser();
      isSessionInvalid.value = true;
    }
  };

  // Validar sin redirección
  const isSessionValid = async () => {
    try {
      const result = await verifyActiveSession();
      return result && userStore.isAuthenticated;
    } catch (e) {
      userStore.clearUser();
      return false;
    }
  };

  return {
    verifyToken,
    isSessionInvalid,
    isSessionValid,
  };
}
