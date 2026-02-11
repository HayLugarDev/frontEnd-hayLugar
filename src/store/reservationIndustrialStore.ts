// stores/reservationIndustrialStore.ts
import { defineStore } from 'pinia'
import api from '../services/apiService'
import { useUserStore } from './userStore'
import { useSpaceStore } from './spaceStore'

export const useReservationIndustrialStore = defineStore('reservationIndustrial', {
  state: () => ({
    reservation: {
      id: null as number | null,
      user_id: null as number | null,
      owner_id: null as number | null,
      space_id: null as number | null,
      slug: null as string | null,
      space_name: null as string | null,
      start_time: '' as string,
      end_time: '' as string,
      pricing_unit: 'day' as 'hour' | 'day' | 'week' | 'month',
      price_per_unit: 0,
      estimated_total: 0,
      method: 'wallet' as 'wallet' | 'mercadopago' | 'manual_contract',
      notes: '' as string,
      status: 'draft' as 'draft' | 'pending' | 'confirmed' | 'contract_required' | 'cancelled',
      payment_data: null as Record<string, any> | null,
    },

    // nuevas propiedades
    availability: {
      checked: false,
      available: null as boolean | null,
      conflicts: [] as any[],
    },

    loading: false,
    error: null as string | null,
  }),

  getters: {
    isReadyForSubmission: (state) =>
      !!state.reservation.space_id &&
      !!state.reservation.start_time &&
      !!state.reservation.end_time &&
      state.reservation.estimated_total > 0,
  },

  actions: {
    /* ============================================
     * Inicializa / Actualiza la reserva
     * ============================================ */
    setReservationData(data: Partial<typeof this.reservation>) {
      const userStore = useUserStore()
      const spaceStore = useSpaceStore()

      if (!data.user_id && userStore.user) {
        data.user_id = userStore.user.id
      }

      if (!data.owner_id && spaceStore.selectedSpace?.owner_id) {
        data.owner_id = spaceStore.selectedSpace.owner_id
      }

      if (!data.space_name && spaceStore.selectedSpace?.name) {
        (data as any).space_name = spaceStore.selectedSpace.name
      }

      this.reservation = { ...this.reservation, ...data }
    },

    /* ============================================
     * Calcular monto estimado
     * ============================================ */
    estimateTotal(startISO: string, endISO: string, pricingUnit: string, pricePerUnit: number) {
      const start = new Date(startISO)
      const end = new Date(endISO)
      if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) return 0

      const ms = end.getTime() - start.getTime()
      const hours = ms / 36e5
      const days = Math.ceil(hours / 24)
      const weeks = Math.ceil(days / 7)
      const months = Math.ceil(days / 30)

      const units =
        pricingUnit === 'hour'
          ? Math.ceil(hours)
          : pricingUnit === 'day'
          ? Math.max(1, days)
          : pricingUnit === 'week'
          ? Math.max(1, weeks)
          : Math.max(1, months)

      const total = Math.round(units * (pricePerUnit || 0))
      this.reservation.estimated_total = total
      return total
    },

    /* ============================================
     * NUEVO: Check Availability real
     * ============================================ */
    async checkAvailability() {
      this.loading = true
      this.error = null

      try {
        if (!this.reservation.space_id) throw new Error("SPACE_ID_REQUIRED")

        const params = {
          space_id: this.reservation.space_id,
          start_time: this.reservation.start_time,
          end_time: this.reservation.end_time,
        }

        const res = await api.get('/industrial-reservations/check-availability', { params })

        this.availability = {
          checked: true,
          available: res.data.available,
          conflicts: res.data.conflicts,
        }

        return res.data
      } catch (err: any) {
        console.error('Availability error:', err)
        this.error = 'Error verificando disponibilidad'
        throw err
      } finally {
        this.loading = false
      }
    },

    /* ============================================
     * NUEVO: Validación antes de crear la reserva
     * ============================================ */
    async validateBeforeSubmit() {
      const result = await this.checkAvailability()
      if (!result.available) {
        throw new Error('NO_AVAILABLE')
      }
      return true
    },

    /* ============================================
     * Enviar la reserva al backend
     * ============================================ */
    async submitIndustrialReservation() {
      this.loading = true
      this.error = null

      try {
        // validar disponibilidad real antes
        await this.validateBeforeSubmit()

        const endpoint = '/industrial-reservations/create'

        this.reservation.status =
          this.reservation.method === 'manual_contract'
            ? 'contract_required'
            : 'pending'

        const response = await api.post(endpoint, this.reservation)

        this.reservation.id =
          response.data?.id ||
          response.data?.reservation?.id ||
          null

        this.reservation.status =
          this.reservation.method === 'manual_contract'
            ? 'contract_required'
            : 'confirmed'

        return response.data
      } catch (err: any) {
        console.error('Error creando reserva industrial:', err)
        this.error = err.message || 'Error al crear la reserva industrial'
        throw err
      } finally {
        this.loading = false
      }
    },

    /* ============================================
     * Limpiar el store
     * ============================================ */
    clearReservation() {
      this.reservation = {
        id: null,
        user_id: null,
        owner_id: null,
        space_id: null,
        slug: null,
        space_name: null,
        start_time: '',
        end_time: '',
        pricing_unit: 'day',
        price_per_unit: 0,
        estimated_total: 0,
        method: 'wallet',
        notes: '',
        status: 'draft',
        payment_data: null,
      }

      this.availability = {
        checked: false,
        available: null,
        conflicts: [],
      }
    },
  },
})
