import api from "./apiService";


export const getReservationById = async (reservation_id: number) => {
  try {
    const response = await api.get(`/reservations/${reservation_id}`, { withCredentials: true });
    return response.data
  } catch (error) {
    console.error("Error al obtener el ID de la reserva:", error);
    return [];
  }
}