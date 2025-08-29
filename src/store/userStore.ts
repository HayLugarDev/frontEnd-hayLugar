import { defineStore } from 'pinia';
import api from '../services/apiService';
import { getNotificationsByUserId } from '../services/notificationService';

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
    notifications: [] as any[],
    reservations: [] as any[],
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
        console.log(response.data.user);
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

    setNotifications(list: any[]) {
      this.notifications = list;
    },
    addNotification(notification: any) {
      this.notifications.unshift(notification);
    },
    clearNotifications() {
      this.notifications = [];
    },
    markAsRead(id: number) {
      const n = this.notifications.find((n:any) => n.id === id);
      if (n) n.status = "read";
    },

    setReservations(reservas: any[]) {
      this.reservations = reservas;
    },

    // checkReservationsForUpcoming() {
    //   const ahora = Date.now();
    //   this.reservations.forEach((reserva: any) => {
    //     const inicio = new Date(reserva.start_time).getTime();
    //     const diffMinutos = (inicio - ahora) / (1000 * 60);

    //     if (diffMinutos > 0 && diffMinutos <= 10) {
    //       this.addNotification({
    //         id: Date.now(),
    //         message: `Tu reserva comienza en ${Math.round(diffMinutos)} minutos`,
    //         status: "pending",
    //         changed_at: new Date(),
    //         type: "reminder",
    //       });
    //     }
    //   });
    // },
  },
});
