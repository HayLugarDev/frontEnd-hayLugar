import api from "./apiService";


export const getNotificationsByUserId = async (id: number) => {
  try {
    const response = await api.get(`/notifications/${id}`, { withCredentials: true });
    console.log(response.data);
    return response.data
  } catch (error) {
    console.error("Error al obtener el ID de la reserva:", error);
    return [];
  }
}