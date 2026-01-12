// stores/reservationStore.ts
import { defineStore } from 'pinia';
import api from '../services/apiService';
import { useUserStore } from './userStore';

export const useReservationStore = defineStore('reservation', {
  state: () => ({
    reservation: {
      id: null as number | null,
      user_id: null as number | null,
      owner_id: null as number | null,
      space_id: null as number | null,
      vehicle_id: null as number | null,
      vehicle_type: null as string | null,
      start_time: null as string | null,
      end_time: null as string | null,
      deadLine: null as number | null,
      total: 0, // ⚠️ monto base en ARS (decimal, como venía del FE)
      service_fee_cents: null as number | null, // calculado al setear
      guest_total_cents: null as number | null, // calculado al setear
      payment_method: null as string | null,
      payment_data: null as Record<string, any> | null,
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
      if (!data.user_id && userStore.user) {
        data.user_id = userStore.user.id;
      }

      // Si tenemos un total (ARS decimal), calculamos fee y total huésped en centavos
      if (typeof data.total === "number" && data.total > 0) {
        const SERVICE_FEE_PCT = Number((import.meta as any).env?.VITE_SERVICE_FEE_PCT ?? 0.15);

        const baseCents = Math.round(data.total * 100); // ARS → centavos
        const serviceFeeCents = Math.round(baseCents * SERVICE_FEE_PCT);
        const guestTotalCents = baseCents + serviceFeeCents;

        data.service_fee_cents = serviceFeeCents;
        data.guest_total_cents = guestTotalCents;
      }

      this.reservation = { ...this.reservation, ...data };
    },


    /**     
     * * Sincroniza la reserva actual con el backend (actualiza los datos).
     */
    async syncReservation() {
      if (!this.reservation.id) {
        throw new Error("Reserva sin ID");
      }

      await api.put(
        `/reservations/${this.reservation.id}/payment-data`,
        {
          payment_method: this.reservation.payment_method,
          payment_data: this.reservation.payment_data,
          service_fee_cents: this.reservation.service_fee_cents,
          guest_total_cents: this.reservation.guest_total_cents,
        },
        { withCredentials: true }
      );
    },

    /**
     * Envía la reserva al backend para guardarla en la base de datos.
     */
    async submitReservation() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.post('/reservations/create', this.reservation);
        this.reservation.id = response.data.reservation.id;
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
     * Limpia el estado de la reserva (reset).
     */
    clearReservation() {
      this.reservation = {
        id: null,
        user_id: null,
        owner_id: null,
        space_id: null,
        vehicle_id: null,
        vehicle_type: null,
        start_time: null,
        end_time: null,
        deadLine: null,
        total: 0,
        service_fee_cents: null,
        guest_total_cents: null,
        payment_method: null,
        payment_data: null,
      };
    },
  },
});
