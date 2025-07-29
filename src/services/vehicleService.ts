import api from "./apiService";

export const getAllVehicles = async () => {
  try {
    const response = await api.get("/vehicles/my");
    const raw = response.data;
    if (!Array.isArray(raw)) return [];
    return raw;
  } catch (error) {
    console.error("Error al obtener los vehículos:", error);
    return [];
  }
};