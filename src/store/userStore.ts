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
      phone: string;
      address: string;
      role: string;
      profile_picture: string;
    },
    loading: false,
    error: null as string | null,
    sessionExpired: false,
    token: localStorage.getItem('token') || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token, // Devuelve true si hay token
  },

  actions: {
    async fetchUser() {
      this.loading = true;
      this.error = null;
      try {
        const token = this.token;
        console.log(token);
        if (!token) {
          throw new Error('No hay token en el store');
        }

        const response = await api.get('/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        this.user = response.data.user;
        console.log('Usuario cargado:', this.user);
      } catch (error) {
        console.error('Error en fetchUser:', error);
        if (error.response?.status === 401) {
          this.expireSession();
        }
        this.error = 'No se pudo cargar la información del usuario';
      } finally {
        this.loading = false;
      }
    },

    setToken(token: string | null) {
      this.token = token;
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    },

    clearUser() {
      this.user = null;
      this.setToken(null);
      this.error = null;
    },

    expireSession() {
      this.sessionExpired = true;
      this.clearUser();
    },

    setSessionExpired(value: boolean) {
      this.sessionExpired = value;
    },
  },
});
