import api from "./apiService";

export const getAllVehicles = async () => {
  try {
    const response = await api.get("/vehicles/my", { withCredentials: true });
    const raw = response.data;
    if (!Array.isArray(raw)) return [];
    return raw;
  } catch (error) {
    console.error("Error al obtener los vehículos:", error);
    return [];
  }
};

export const getVehicleById = async (vehicle_id: number) => {
  try {
    const response = await api.get(`/vehicles/${vehicle_id}`, { withCredentials: true });
    return response.data
  } catch (error) {
    console.error("Error al obtener el vehículo:", error);
    return [];
  }
}

export const updateVehicle = async (id: number, data: any) => {
  const response = await api.put(`/vehicles/${id}`, data, { withCredentials: true });
  return response.data;
};