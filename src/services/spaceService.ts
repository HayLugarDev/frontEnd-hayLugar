import api from "./apiService";

export const getSpaceById = async (id: number) => {
  try {
    const response = await api.get(`/spaces/getbyid/${id}`);
    if (typeof response.data.images === 'string') {
      try {
        response.data.images = JSON.parse(response.data.images);
      } catch (error) {
        console.error('Error al parsear images:', error);
        response.data.images = [];
      }
    }
    return response.data;
  } catch (error) {
    console.error("Error al obtener el espacio:", error);
  }
};