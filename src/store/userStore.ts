import { defineStore } from 'pinia';
import api from '../services/apiService';
import { getNotificationsByUserId } from '../services/notificationService';
import { showToast } from '../utils/toast';

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
      termsAccepted: boolean
      acceptedTermsVersion: string | null
      created_at: Date
      updated_at: Date
    },
    socketConnected: false,
    socketSubscribed: false,
    loading: false,
    error: null as string | null,
    sessionExpired: true,
    token: null as string | null,
    notifications: [] as any[],
    notificationsLoaded: false, // <- para saber si ya cargamos la primera vez
    reservations: [] as any[],
    toastShown: false, // <- nuevo flag
    terms: null as null | { //<- estado de términos
      requiredVersion: string | null;
      documentUrl: string | null;
      outdated: boolean;
    },
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
        // Manejo defensivo de la forma de la respuesta
        const user = response.data?.user ?? response.data;
        if (!user?.id) {
          throw new Error('No se recibió user desde /auth/google-session');
        }

        this.user = user;
        this.token = response.data?.token ?? null; // por si acaso
        this.terms = response.data?.terms ?? null; // 👈 guardamos términos
        this.sessionExpired = false;

        // Conectar al socket
        await this.connectSocket();

        // Esperamos a que el user esté seteado antes de pedir notificaciones
        await this.fetchNotifications(user.id, { initialLoad: true });
      } catch (error: any) {
        if (error.response?.status === 401) {
          this.expireSession();
        }
        this.error = 'No se pudo cargar la información del usuario';
      } finally {
        this.loading = false;
      }
    },

    async fetchNotifications(userId: number, opts: { initialLoad?: boolean } = {}) {
      try {
        const notifications = await getNotificationsByUserId(userId);

        const sorted = [...notifications].sort(
          (a: any, b: any) =>
            new Date(b.changed_at).getTime() - new Date(a.changed_at).getTime()
        );

        this.notifications = sorted;
        this.notificationsLoaded = true;

        // 🔑 Solo mostrar en la primera carga después de login
        if (opts.initialLoad && !this.toastShown) {
          const hasPending = sorted.some((n: any) => n.status === 'pending');
          if (hasPending) {
            showToast?.('¡Tienes nuevas notificaciones!', 'success');
            this.toastShown = true; // marcamos que ya mostramos el toast inicial
          }
        }

        return sorted;
      } catch (err: any) {
        console.error(
          'fetchNotifications error:',
          err.response?.data ?? err.message ?? err
        );
        this.notifications = [];
        this.notificationsLoaded = true;
        return [];
      }
    },

    setUser(partialUser: Partial<typeof this.user>) {
      this.user = {
        ...this.user,
        ...partialUser
      };
    },

    clearUser() {
      this.disconnectSocket();
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

    setNotifications(list: any[]) {
      this.notifications = list;
    },

    addNotification(notification: any) {
      this.notifications.unshift(notification);
      this.notifications = [...this.notifications];

      // 📩 Si la nueva notificación está pendiente, mostramos toast
      if (notification.status === 'pending') {
        showToast?.('¡Tienes una nueva notificación!', 'success');
      }
    },

    markAllAsRead() {
      this.notifications = this.notifications.map((n: any) => ({
        ...n,
        status: 'read'
      }));
    },

    markAsRead(id: number) {
      const idx = this.notifications.findIndex((n: any) => n.id === id);
      if (idx >= 0) {
        this.notifications[idx].status = 'read';
        // forzar reactividad
        this.notifications = [...this.notifications];
      }
    },

    clearNotifications() {
      this.notifications = [];
    },

    setReservations(reservas: any[]) {
      this.reservations = reservas;
    },
  },
});
