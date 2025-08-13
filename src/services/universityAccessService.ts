// services/universityAccessService.ts
import api from './apiService'

export async function verifyLegajo(user_id: number, university_id: number) {
  // Backend ya tiene verifyLegajo (POST). Si lo tenés como GET, ajustalo acá.
  const { data } = await api.post('/university-members/verify', { user_id, university_id })
  if (!data?.verified) throw new Error('Legajo no verificado')
  return data
}

// Endpoint sugerido: lookup-or-create (si no existe, probamos dos pasos)
export async function lookupOrCreateVehicle(plate: string) {
  plate = plate.trim().toUpperCase()

  // 1) intento endpoint directo (si lo tenés)
  try {
    const { data } = await api.post('/vehicles/lookup-or-create', { plate })
    return data?.id || data?.vehicle_id
  } catch (_) {
    // 2) fallback “lookup” → si falla, “create”
    try {
      const { data } = await api.get('/vehicles/by-plate', { params: { plate } })
      if (data?.id) return data.id
    } catch {}
    const { data: created } = await api.post('/vehicles', { plate, type: 'car' })
    return created?.id
  }
}

export async function createUniversityReservation(payload: any) {
  const { data } = await api.post('/reservations/create', payload)
  return data
}
