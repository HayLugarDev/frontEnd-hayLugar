// services/meteredParkingService.ts
import api from './apiService'

// --- Tipos usados por el diálogo (opcionales pero útiles)
export type MeteredStatus = 'free' | 'limited' | 'full' | 'unknown'

export interface MeteredBlockDTO {
  id: number
  geo: { center: { lat: number; lng: number } | null; path: Array<{ lat: number; lng: number }> }
  region: { country_code: string; admin1: string | null; admin2: string | null; city: string | null; neighborhood: string | null }
  street: string
  segment_ref: string | null
  status: MeteredStatus
  availability_pct: number | null
  length_m: number
  pricing: { price_per_hour: number; currency: string } | null
  sensors: { count: number; source: string | null }
  active: boolean
  updated_at: string | Date
}

// --- filtros que ya usas
export type ListFilters = Partial<{
  country_code: string
  admin1: string
  admin2: string
  city: string
  neighborhood: string
  status: MeteredStatus
  active: boolean
  limit: number
}>

// ⚠️ Mantengo lo que ya tenías y SOLO agrego los stubs que faltan.
// Si ya tienes getBlocks / updateBlock / updateBlocksBatch / subscribeToRealtime, déjalos igual.
// Aquí pongo ejemplos mínimos de getBlocks y los mocks nuevos.

export const meteredParkingService = {
  // EXISTENTE: listar bloques
  async getBlocks(filters?: ListFilters): Promise<MeteredBlockDTO[]> {
    const { data } = await api.get('/metered/blocks', { params: filters })
    // El backend puede devolver {data:[...] } o directamente [...]
    return Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : []
  },

  // (Opcional) EXISTENTES si los tienes:
  // async updateBlock(payload: any) { ... }
  // async updateBlocksBatch(updates: any[]) { ... }
  // subscribeToRealtime(...) { ... }

  // ============================
  // 🔹 STUBS para destrabar el front
  // ============================

  /** Tarifa por bloque/zona. Si el endpoint no existe, devolvemos un valor de fallback. */
  async getTariff(zone_id: number): Promise<{ hourly_rate: number }> {
    try {
      // Si más adelante creas el endpoint real, simplemente descomenta:
      // const { data } = await api.get(`/metered/zone/${zone_id}/tariff`)
      // return data
      // MOCK:
      return Promise.resolve({ hourly_rate: 250 }) // fallback demo
    } catch {
      return { hourly_rate: 250 }
    }
  },

  /** Asegura/crea vehículo por patente. Si no existe endpoint, resolvemos con un id mock. */
  async ensureVehicle(patente: string): Promise<number> {
    try {
      // Endpoint real futuro:
      // const { data } = await api.post('/vehicles/ensure', { plate: patente })
      // return data?.id
      // MOCK simple (hash naive para que sea estable):
      const id = Math.abs(hashString(patente)) % 100000 + 1000
      return Promise.resolve(id)
    } catch {
      // fallback
      return Promise.resolve(12345)
    }
  },

  /** Crea sesión de estacionamiento. Devuelve un payload con forma similar a la real. */
  async createMeteredSession(payload: {
    user_id: number
    block_id?: number
    zone_id?: number
    start_time: string
    end_time: string
    estimated_total: number
    vehicle_id: number
    payment_method: 'mercadopago'|'tarjeta'
    payment_data: any
  }): Promise<any> {
    try {
      // Cuando tengas endpoint real:
      // const { data } = await api.post('/metered/sessions', payload)
      // return data

      // MOCK consistente con el diálogo:
      const end = new Date(payload.end_time)
      const session = {
        id: Math.floor(Math.random() * 900000) + 100000,
        user_id: payload.user_id,
        block_id: payload.block_id ?? payload.zone_id ?? null,
        start_time: payload.start_time,
        end_time: payload.end_time,
        end_time_fmt: end.toLocaleTimeString(),
        status: 'in_progress',
        estimated_total: payload.estimated_total,
        vehicle_id: payload.vehicle_id,
        payment_method: payload.payment_method,
      }
      const payment = {
        status: 'approved',
        method: payload.payment_method,
        amount_authorized: payload.estimated_total,
      }
      return Promise.resolve({ session, payment })
    } catch (e) {
      // fallback de prueba
      const now = new Date()
      const end = new Date(now.getTime() + 60 * 60 * 1000)
      return {
        session: {
          id: Math.floor(Math.random() * 900000) + 100000,
          user_id: payload.user_id,
          block_id: payload.block_id ?? payload.zone_id ?? null,
          start_time: now.toISOString(),
          end_time: end.toISOString(),
          end_time_fmt: end.toLocaleTimeString(),
          status: 'in_progress',
          estimated_total: payload.estimated_total,
          vehicle_id: payload.vehicle_id,
          payment_method: payload.payment_method,
        },
        payment: { status: 'approved', method: payload.payment_method, amount_authorized: payload.estimated_total },
      }
    }
  },
}

// Utilidad local para mock de ensureVehicle
function hashString(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h) + s.charCodeAt(i)
    h |= 0
  }
  return h
}
