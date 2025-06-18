import { computed } from 'vue';
import { useRoute } from 'vue-router';

export interface RouteConfig {
  showSalirButton?: boolean;
  showPublicarButton?: boolean;
  showLoginButton?: boolean;
  showUserMenuButton?: boolean;
}

export function useHeaderVisibility() {
  const route = useRoute();

  const routeConfig = computed<RouteConfig>(() => {
    const path = route.path;

    return {
      showSalirButton: path === '/add-space',
      showPublicarButton: path === '/dashboard' || path.startsWith('/espacio'),
      showLoginButton: path === '/login',
      showUserMenuButton: path !== '/login',
    };
  });

  return { routeConfig };
}
