// src/services/meteredParkingService.ts
import api from './apiService'

// ---- Tipos (usados por el dashboard y el diálogo)
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

export type ListFilters = Partial<{
  country_code: string
  admin1: string
  admin2: string
  city: string
  neighborhood: string
  status: MeteredStatus
  active: boolean
  limit: number
  offset: number
}>

// ---- Helpers
const normList = (data: any) => (Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [])
const isAxiosStatus = (e: any, code: number) => (e?.response?.status === code)

// ---- Service
export const meteredParkingService = {
  /** Bloques/segmentos para pintar en el mapa */
  async getBlocks(filters?: ListFilters): Promise<MeteredBlockDTO[]> {
    const { data } = await api.get('/metered/blocks', { params: filters })
    return normList(data)
  },

  /**
   * Tarifa por zona/bloque.
   * Endpoint esperado (ya creado): GET /metered/zones/:zone_id/tariff -> { hourly_rate, currency? }
   * Si no estuviera o devuelve 404, devolvemos { hourly_rate: 0 } y la UI aplica fallback.
   */
  async getTariff(zone_id: number): Promise<{ hourly_rate: number; currency?: string }> {
    try {
      const { data } = await api.get(`/metered/zones/${zone_id}/tariff`)
      if (data && typeof data.hourly_rate === 'number') return data
    } catch (e) {
      // si tira 404 usamos fallback (la UI ya contempla fallback visual)
      if (!isAxiosStatus(e, 404)) {
        // otros códigos: seguimos igualmente al fallback
      }
    }
    return { hourly_rate: 0, currency: 'ARS' }
  },

  /**
   * Asegura/crea vehículo por patente y devuelve su ID.
   * Flujo:
   *  A) POST /vehicles/ensure (si existiera)
   *  B) GET  /vehicles/my  → buscar patente
   *  C) POST /vehicles/create  → crear
   */
  async ensureVehicle(license_plate: string, type: 'car'|'motorcycle'|'bicycle'|'van' = 'car'): Promise<number> {
    if (!license_plate && type !== 'bicycle') throw new Error('Patente requerida')

    // A) ensure (si existe)
    try {
      const { data } = await api.post('/vehicles/ensure', { license_plate, type })
      if (data?.id) return Number(data.id)
      if (data?.vehicle?.id) return Number(data.vehicle.id)
    } catch (e) {
      if (!isAxiosStatus(e, 404)) {
        // si no es 404, igual seguimos con fallback
      }
    }

    // B) buscar en mis vehículos
    try {
      const { data } = await api.get('/vehicles/my')
      const list = normList(data) as Array<{ id: number; license_plate?: string | null }>
      const found = list.find(v => (v.license_plate || '').toUpperCase() === (license_plate || '').toUpperCase())
      if (found?.id) return Number(found.id)
    } catch { /* noop */ }

    // C) crear vehículo
    const { data } = await api.post('/vehicles/create', { license_plate, type })
    const id = data?.vehicle?.id ?? data?.id
    if (!id) throw new Error('No se pudo asegurar/crear el vehículo')
    return Number(id)
  },

  /**
   * Crea sesión de estacionamiento (ticket).
   * Backend actual montado en /api/meteredS:
   *  POST /meteredS/sessions  -> { session, ... }
   */
  async createMeteredSession(payload: {
    user_id: number
    zone_id: number
    start_time: string
    end_time: string
    estimated_total: number
    vehicle_id: number
    payment_method: 'mercadopago'|'tarjeta'
    payment_data: any
  }): Promise<any> {
    const { data } = await api.post('/meteredS/sessions', payload)
    return data
  },

  /**
   * Finaliza una sesión (recalcula prorrata).
   * POST /meteredS/sessions/:id/complete -> { session, total }
   */
  async completeMeteredSession(session_id: number): Promise<{ session: any; total: number }> {
    const { data } = await api.post(`/meteredS/sessions/${session_id}/complete`)
    return data
  },

  /**
   * Cancela una sesión (opcional).
   * POST /meteredS/sessions/:id/cancel -> { session }
   */
  async cancelMeteredSession(session_id: number): Promise<{ session: any }> {
    const { data } = await api.post(`/meteredS/sessions/${session_id}/cancel`)
    return data
  },
async completeSession(session_id: number): Promise<any> {
  const { data } = await api.patch(`/meteredS/sessions/${session_id}/complete`)
  return data
},

  /**
   * Listar sesiones activas por usuario.
   * GET /meteredS/sessions/active?user_id=123 -> { data: [...] }
   */
  async listActiveSessionsByUser(user_id: number): Promise<any[]> {
    const { data } = await api.get('/meteredS/sessions/active', { params: { user_id } })
    return normList(data)
  },

  /**
   * Métrica rápida: cuántas sesiones activas tiene una zona.
   * GET /meteredS/sessions/zone/:zone_id/active-count -> { zone_id, active_count }
   */
  async activeCountByZone(zone_id: number): Promise<{ zone_id: number; active_count: number }> {
    const { data } = await api.get(`/meteredS/sessions/zone/${zone_id}/active-count`)
    return data
  },
}
