import { useUserStore } from '../store/userStore';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { verifyActiveSession } from '../middleware/verifyToken';
import api from '../services/apiService';

export function useVerifyToken() {
  const userStore = useUserStore();
  const router = useRouter();
  const isSessionInvalid = ref(false);

  const verifyToken = async (route: string) => {
    try {
      const result = await verifyActiveSession(route, userStore.sessionExpired);

      console.log('Autenticado? : ', userStore.isAuthenticated);
      console.log('Autenticado? : ', userStore.sessionExpired);

      if (route === '/quit') {
        await api.post('/auth/signout', {}, { withCredentials: true });
        userStore.clearUser();
        await router.push('/dashboard');
        userStore.expireSession();
        return;
      }

      if (!result || !userStore.isAuthenticated) {
        userStore.clearUser();
        isSessionInvalid.value = true;
        return;
      }

      isSessionInvalid.value = false;
      await router.push(route);
    } catch (error) {
      console.error('Error verifying session:', error);
      userStore.clearUser();
      isSessionInvalid.value = true;
    }
  };

  return {
    verifyToken,
    isSessionInvalid
  };
}
