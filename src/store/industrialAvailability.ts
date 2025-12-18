// src/store/industrialAvailabilityStore.ts
import { defineStore } from 'pinia'
import api from '../services/apiService'

export interface IndustrialAvailability {
  status: 'available' | 'busy' | 'unknown'
  next_available?: string
  slots?: Array<{ start: string; end: string }>
}

export const useIndustrialAvailabilityStore = defineStore('industrialAvailability', {
  state: () => ({
    availability: null as IndustrialAvailability | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchAvailability(spaceId: number) {
      this.loading = true
      this.error = null

      try {
        const res = await api.get(`/industrial/reservations/check-availability/${spaceId}`)

        this.availability =
          res.data?.data ||
          res.data ||
          { status: 'unknown' } // fallback seguro
      } catch (err) {
        console.error('Error fetching availability:', err)
        this.error = 'No se pudo cargar disponibilidad'
        this.availability = { status: 'unknown' }
      } finally {
        this.loading = false
      }
    },
  },
})
