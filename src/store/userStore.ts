import { defineStore } from 'pinia';
import api from '../services/apiService';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as null | {
      id: number;
      name: string;
      email: string;
      last_name?: string;
      dni?: string;
      phone?: string;
      address?: string;
      role?: string;
      profile_picture?: string;
    },
    loading: false,
    error: null as string | null,
    sessionExpired: true,

    // 🔔 NUEVO: estado para notificaciones
    notifications: [] as string[],
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
  },

  actions: {
    async fetchUser() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get('/auth/google-session', { withCredentials: true });
        this.user = response.data.user;
        this.sessionExpired = false;
      } catch (error: any) {
        if (error.response?.status === 401) {
          this.expireSession();
        }
        this.error = 'No se pudo cargar la información del usuario';
      } finally {
        this.loading = false;
      }
    },

    setUser(user: {
      id: number;
      name: string;
      email: string;
      last_name?: string;
      dni?: string;
      phone?: string;
      address?: string;
      role?: string;
      profile_picture?: string;
    }) {
      this.user = user;
      this.sessionExpired = false;
    },

    clearUser() {
      this.user = null;
      this.error = null;
      this.sessionExpired = false;
    },

    expireSession() {
      this.sessionExpired = true;
      this.clearUser();
    },

    setSessionExpired(value: boolean) {
      this.sessionExpired = value;
    },

    // 🔔 NUEVO: agregar una notificación
    addNotification(message: string) {
      this.notifications.push(message);
    },

    // 🔔 NUEVO: limpiar todas las notificaciones
    clearNotifications() {
      this.notifications = [];
    },
  },
});
