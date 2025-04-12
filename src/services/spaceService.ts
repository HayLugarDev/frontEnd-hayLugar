import api from "./apiService";

export const getAllSpaces = async () => {
  try {
    const response = await api.get("/spaces/getAll");
    const data = Array.isArray(response.data) ? response.data.map((e: { dataValues: { images: string | []; }; }) => {
      if (typeof e.dataValues.images === 'string') {
        try {
          e.dataValues.images = JSON.parse(e.dataValues.images);
        } catch (error) {
          console.error('Error al parsear images:', error);
          e.dataValues.images = [];
        }
      }
      return e.dataValues;
    }) : [];
    return data;
  } catch (error) {
    console.error("Error al obtener los espacios:", error);
  }
}

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