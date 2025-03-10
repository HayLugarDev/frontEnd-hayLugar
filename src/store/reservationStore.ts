// stores/reservationStore.ts
import { defineStore } from 'pinia';
import api from '../services/apiService'; // Asegúrate de que apiService esté configurado
import { useUserStore } from './userStore';

export const useReservationStore = defineStore('reservation', {
  state: () => ({
    reservation: {
      id: null as number | null, 
      user_id: null as number | null, 
      owner_id: null as number | null,
      space_id: null as number | null,
      start_time: null as string | null,
      end_time: null as string | null,
      total: 0,
      status: 'pending',  
    },
    loading: false,
    error: null as string | null,
  }),
  actions: {
    /**
     * Actualiza la reserva con los datos proporcionados.  
     * Si no se pasa user_id, se asigna automáticamente desde el store de usuario.
     */
    setReservationData(data: Partial<typeof this.reservation>) {
      const userStore = useUserStore();
      // Si no se provee user_id y el usuario está autenticado, asignarlo
      if (!data.user_id && userStore.user) {
        data.user_id = userStore.user.id;
      }
      this.reservation = { ...this.reservation, ...data };
    },
    /**
     * Envía la reserva al backend para guardarla en la base de datos.
     */
    async submitReservation() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.post('/reservations/create', this.reservation);
        this.reservation.id = response.data.id; // Se actualiza el id según la respuesta
        return response.data;
      } catch (error) {
        this.error = 'Error al crear la reserva';
        console.error('Error en submitReservation:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    /**
     * Limpia los datos de la reserva.
     */
    clearReservation() {
      this.reservation = {
        id: null,
        user_id: null,
        owner_id: null,
        space_id: null,
        start_time: null,
        end_time: null,
        total: 0,
        status: 'pending',
      };
    },
  },
});
