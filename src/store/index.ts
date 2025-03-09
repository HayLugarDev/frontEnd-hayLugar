// src/stores/reservationStore.js
import { defineStore } from 'pinia';
import api from '../services/apiService';

export const useReservationStore = defineStore('reservation', {
  state: () => ({
    reservation: {
      id: null, 
      user_id: null, 
      owner_id: null,
      space_id: null,
      start_time: null,
      end_time: null,
      total: 0,
      status: 'pending',  
    },
  }),
  actions: {
    /**
     * Actualiza la reserva con los datos.

     * setReservationData({
     *   user_id: 2,
     *   owner_id: 3,
     *   space_id: 5,
     *   start_time: "2025-04-01T08:00:00Z",
     *   end_time: "2025-04-01T10:00:00Z",
     *   total: 1000,
     *   status: "pending"
     * });
     */
    setReservationData(data: { id: null; user_id: null; owner_id: null; space_id: null; start_time: null; end_time: null; total: number; status: string; }) {
      this.reservation = { ...this.reservation, ...data };
    },
    /**
     * Envía la reserva al backend para guardarla en la base de datos.
     * Se espera que el endpoint '/reservations/create' reciba un objeto JSON con los datos de la reserva.
     */
    async submitReservation() {
      try {
        const response = await api.post('/reservations/create', this.reservation);
        this.reservation.id = response.data.id; // Se actualiza el id según la respuesta
        return response.data;
      } catch (error) {
        console.error('Error al crear la reserva:', error);
        throw error;
      }
    },
    /**
     * Limpia los datos de la reserva en el store.
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
