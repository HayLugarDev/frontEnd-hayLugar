// stores/userStore.ts
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
      // Otros campos que necesites
    },
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchUser() {
      this.loading = true;
      this.error = null;
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Suponiendo que el endpoint envía { success: true, user: { ... } }
        this.user = response.data.user;
        console.log("USER",response)
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
  },
});
