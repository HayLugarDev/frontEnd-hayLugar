import { computed } from 'vue';
import { useRoute } from 'vue-router';

export interface RouteConfig {
  showSalirButton?: boolean;
  showNotificationButton: boolean;
  showPublicarButton?: boolean;
  showLoginButton?: boolean;
  showUserMenuButton?: boolean;
  showBackButton?: boolean;
}

export function useHeaderVisibility() {
  const route = useRoute();

  const routeConfig = computed<RouteConfig>(() => {
    const path = route.path;

    return {
      showSalirButton: path === '/add-space' || path === '/add-vehicle' || path === '/pago' || path === 'login',
      showNotificationButton: path !== '/pago' && path !== '/add-space' && path !== '/add-vehicle',
      showPublicarButton: path === '/dashboard' || path.startsWith('/espacio'),
      showLoginButton: path === '/login' || path === '/profile',
      showUserMenuButton: path !== '/login' && path !== '/pago',
      showBackButton: path.startsWith('/espacio') || path === '/login' || path === '/register' || path === '/profile' || path === '/notifications',
    };
  });

  return { routeConfig };
}
