import { defineStore } from 'pinia';
import api from '../services/apiService';
import { getNotificationsByUserId } from '../services/notificationService';
import { showToast } from '../utils/toast';
import { getSocket, disconnectSocket } from "../services/socketClient";

/* =========================
   TYPES
========================= */

export type User = {
  id: number;
  name: string;
  email: string;
  last_name?: string;
  dni?: string;
  phone?: string;
  address?: string;
  role?: string;
  profile_picture?: string;
  termsAccepted: boolean;
  acceptedTermsVersion: string | null;
  created_at: Date;
  updated_at: Date;
};

type TermsState = {
  requiredVersion: string | null;
  documentUrl: string | null;
  outdated: boolean;
};

type Notification = {
  id?: number;
  reservation_id?: number;
  type?: string;
  status?: string;
  changed_at?: string;
  [key: string]: any;
};

/* =========================
   STORE
========================= */

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,

    socketConnected: false,
    socketSubscribed: false,

    loading: false,
    error: null as string | null,

    sessionExpired: true,
    token: null as string | null,

    notifications: [] as Notification[],
    notificationsLoaded: false,
    toastShown: false,

    reservations: [] as any[],

    terms: null as TermsState | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
  },

  actions: {

    /* =========================
       USER SESSION
    ========================= */

    async fetchUser() {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.get('/auth/google-session', {
          withCredentials: true
        });

        const user = response.data?.user ?? response.data;

        if (!user?.id) {
          throw new Error('No se recibió user válido');
        }

        this.user = user as User;
        this.token = response.data?.token ?? null;
        this.terms = response.data?.terms ?? null;

        this.sessionExpired = false;

        await this.connectSocket();
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

    setUser(partialUser: Partial<User>) {
      if (!this.user) return;

      const cleanUpdate = Object.fromEntries(
        Object.entries(partialUser).filter(([_, v]) => v !== undefined)
      ) as Partial<User>;

      this.user = {
        ...this.user,
        ...cleanUpdate,
      };
    },

    clearUser() {
      this.user = null;
      this.error = null;
      this.sessionExpired = false;
      this.disconnectSocket();
    },

    expireSession() {
      this.sessionExpired = true;
      this.clearUser();
    },

    setSessionExpired(value: boolean) {
      this.sessionExpired = value;
    },

    /* =========================
       NOTIFICATIONS
    ========================= */

    async fetchNotifications(
      userId: number,
      opts: { initialLoad?: boolean } = {}
    ) {
      try {
        const notifications = await getNotificationsByUserId(userId);

        const sorted = [...notifications].sort(
          (a: any, b: any) =>
            new Date(b.changed_at).getTime() -
            new Date(a.changed_at).getTime()
        );

        this.notifications = sorted;
        this.notificationsLoaded = true;

        if (opts.initialLoad && !this.toastShown) {
          const hasPending = sorted.some(
            (n: any) => n.status === 'pending'
          );

          if (hasPending) {
            showToast?.('¡Tienes nuevas notificaciones!', 'success');
            this.toastShown = true;
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

    setNotifications(list: Notification[]) {
      this.notifications = list;
    },

    addNotification(notification: any) {
      const n = notification?.notification ?? notification;
      if (!n) return;

      const key = `${n.reservation_id ?? ""}|${n.type ?? ""}|${n.changed_at ?? ""}`;

      const exists = this.notifications.some((x: any) => {
        const k = `${x.reservation_id ?? ""}|${x.type ?? ""}|${x.changed_at ?? ""}`;
        return k === key;
      });

      if (exists) return;

      this.notifications.unshift(n);
      this.notifications = [...this.notifications];

      if (n.status === "pending") {
        showToast?.("¡Tienes una nueva notificación!", "success");
      }
    },

    markAllAsRead() {
      this.notifications = this.notifications.map((n: any) => ({
        ...n,
        status: 'read'
      }));
    },

    markAsRead(id: number) {
      const idx = this.notifications.findIndex(
        (n: any) => n.id === id
      );

      if (idx >= 0) {
        this.notifications[idx].status = 'read';
        this.notifications = [...this.notifications];
      }
    },

    clearNotifications() {
      this.notifications = [];
    },

    /* =========================
       RESERVATIONS
    ========================= */

    setReservations(reservas: any[]) {
      this.reservations = reservas;
    },

    /* =========================
       SOCKET
    ========================= */

    async connectSocket() {
      if (!this.user?.id) return;

      const s = getSocket();

      s.removeAllListeners("connect");
      s.removeAllListeners("disconnect");
      s.removeAllListeners("connect_error");
      s.removeAllListeners("notification");
      s.removeAllListeners("subscribed");

      s.on("connect", () => {
        this.socketConnected = true;
      });

      s.on("subscribed", () => {
        this.socketSubscribed = true;
      });

      s.on("disconnect", () => {
        this.socketConnected = false;
        this.socketSubscribed = false;
      });

      s.on("connect_error", (err: any) => {
        this.socketConnected = false;
        this.socketSubscribed = false;
        console.warn("[socket] connect_error:", err?.message || err);
      });

      s.on("notification", (data: any) => {
        const n = data?.notification ?? data;
        if (!n) return;
        this.addNotification(n);
      });

      if (!s.connected) s.connect();
    },

    disconnectSocket() {
      this.socketConnected = false;
      this.socketSubscribed = false;
      disconnectSocket();
    },
  },
});