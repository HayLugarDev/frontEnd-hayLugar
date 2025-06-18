import { useUserStore } from '../store/userStore';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { verifyActiveSession } from '../middleware/verifyToken';

export function useVerifyToken() {
  const userStore = useUserStore();
  const router = useRouter();
  const isSessionInvalid = ref(false);

  const verifyToken = async (route: string) => {
  try {
    const result = await verifyActiveSession(route, userStore.sessionExpired);

    if (!result) {
      userStore.clearUser();
      isSessionInvalid.value = true;
      return;
    }

    if (!userStore.isAuthenticated) {
      isSessionInvalid.value = true;
      return;
    }

    if (route === '/quit') {
      userStore.clearUser();
      router.replace('/dashboard');
      return;
    }

    isSessionInvalid.value = false;
    router.push(route);
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
