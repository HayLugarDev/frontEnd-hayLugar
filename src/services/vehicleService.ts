// src/services/vehicleService.ts
import api from './apiService'

export type VehicleType = 'car' | 'motorcycle' | 'bicycle' | 'van'

export interface Vehicle {
  id: number
  user_id: number
  license_plate: string | null
  type: VehicleType
  brand?: string | null
  model?: string | null
  color?: string | null
  created_at?: string
}

function normalizePlate(p?: string | null) {
  return (p ?? '').trim().toUpperCase()
}

/** Lista los vehículos del usuario autenticado */
export async function getAllVehicles(): Promise<Vehicle[]> {
  try {
    // Tu backend retorna un array plano: res.json(vehicles)
    const { data } = await api.get<Vehicle[]>('/vehicles/my', { withCredentials: true })
    return Array.isArray(data) ? data : []
  } catch (err) {
    console.error('getAllVehicles error:', err)
    return []
  }
}

/** Trae un vehículo por id (o null si no existe) */
export async function getVehicleById(vehicle_id: number): Promise<Vehicle | null> {
  try {
    const { data } = await api.get<Vehicle>(`/vehicles/${vehicle_id}`, { withCredentials: true })
    return data ?? null
  } catch (err) {
    console.error('getVehicleById error:', err)
    return null
  }
}

/** Crea un vehículo nuevo */
export async function createVehicle(payload: {
  license_plate?: string | null
  type: VehicleType
  brand?: string | null
  model?: string | null
  color?: string | null
}): Promise<Vehicle> {
  const body = {
    ...payload,
    license_plate: payload.type === 'bicycle' ? null : normalizePlate(payload.license_plate),
  }
  const { data } = await api.post('/vehicles/create', body, { withCredentials: true })
  // tu controller responde { message, vehicle }
  return data?.vehicle
}

/** Actualiza un vehículo existente */
export async function updateVehicle(id: number, payload: {
  license_plate?: string | null
  type: VehicleType
  brand?: string | null
  model?: string | null
  color?: string | null
}): Promise<Vehicle> {
  const body = {
    ...payload,
    license_plate: payload.type === 'bicycle' ? null : normalizePlate(payload.license_plate),
  }
  const { data } = await api.put(`/vehicles/${id}`, body, { withCredentials: true })
  // { message, vehicle }
  return data?.vehicle
}

/** Elimina un vehículo */
export async function deleteVehicle(id: number): Promise<boolean> {
  try {
    await api.delete(`/vehicles/${id}`, { withCredentials: true })
    return true
  } catch (err) {
    console.error('deleteVehicle error:', err)
    return false
  }
}
export const vehiclesService = {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle
}