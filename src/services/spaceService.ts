// services/spaceService.ts
import api from "./apiService";

export const getAllSpaces = async () => {
  try {
    const response = await api.get("/spaces/getAll");
    const raw = response.data;
    if (!Array.isArray(raw)) return [];

    return raw.map((item: any) => {
      // parseamos images
      if (typeof item.dataValues.images === "string") {
        try {
          item.dataValues.images = JSON.parse(item.dataValues.images);
        } catch {
          item.dataValues.images = [];
        }
      } else if (Array.isArray(item.dataValues.images)) {
        item.dataValues.images = item.dataValues.images;
      }
      
      // parseamos otros campos JSON si los necesitas...
      if (typeof item.dataValues.paymentMethods === "string") {
        try {
          item.dataValues.paymentMethods = JSON.parse(item.dataValues.paymentMethods);
        } catch {
          item.dataValues.paymentMethods = [];
        }
      }

      return item.dataValues;
    });
  } catch (error) {
    console.error("Error al obtener los espacios:", error);
    return [];
  }
};

export const getSpaceById = async (id: number) => {
  try {
    const response = await api.get(`/spaces/getbyid/${id}`);
    const item = response.data as any;

    // mismo parsing para un solo registro
    let images: string[] = [];
    if (typeof item.images === "string") {
      try {
        images = JSON.parse(item.images);
      } catch {
        images = [];
      }
    }

    let paymentMethods: string[] = [];
    if (typeof item.paymentMethods === "string") {
      try {
        paymentMethods = JSON.parse(item.paymentMethods);
      } catch {
        paymentMethods = [];
      }
    }

    return {
      ...item,
      images,
      paymentMethods,
    };
  } catch (error) {
    console.error("Error al obtener el espacio:", error);
  }
};
