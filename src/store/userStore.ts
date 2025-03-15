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
  }),
  actions: {
    async fetchUser() {
      this.loading = true;
      this.error = null;
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.user = response.data.user;
        console.log("USER", response);
      } catch (error) {
        this.error = 'No se pudo cargar la información del usuario';
        console.error('Error en fetchUser:', error);
      } finally {
        this.loading = false;
      }
    },
    clearUser() {
      this.user = null;
      this.error = null;
    },
    setSessionExpired(value: boolean) {
      this.sessionExpired = value;
    },
  },
});
