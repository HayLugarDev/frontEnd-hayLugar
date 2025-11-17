import api from "./apiService";


export const getNotificationsByUserId = async (id: number) => {
  try {
    const response = await api.get(`/notifications/${id}`, { withCredentials: true });

    // Normalizamos: siempre devolver un array
    if (Array.isArray(response.data)) {
      return response.data;
    }
    if (response.data?.notifications) {
      return response.data.notifications;
    }
    return [];
  } catch (error) {
    console.error("Error al obtener las notificaciones:", error);
    return [];
  }
};
