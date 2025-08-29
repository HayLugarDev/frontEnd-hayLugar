import { computed } from 'vue';
import { useRoute } from 'vue-router';

export interface RouteConfig {
  showSalirButton?: boolean;
  showNotificationButton: boolean;
  showPublicarButton?: boolean;
  showLoginButton?: boolean;
  showUserMenuButton?: boolean;
}

export function useHeaderVisibility() {
  const route = useRoute();

  const routeConfig = computed<RouteConfig>(() => {
    const path = route.path;

    return {
      showSalirButton: path === '/add-space' || path === '/add-vehicle' || path === '/pago',
      showNotificationButton: path !== '/pago',
      showPublicarButton: path === '/dashboard' || path.startsWith('/espacio'),
      showLoginButton: path === '/login' || path === '/profile',
      showUserMenuButton: path !== '/login' && path !== '/pago',
    };
  });

  return { routeConfig };
}
