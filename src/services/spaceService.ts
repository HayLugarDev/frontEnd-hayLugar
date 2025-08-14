// services/spaceService.ts
import api from "./apiService";

export const getAllSpaces = async () => {
  try {
    const response = await api.get("/spaces/getAll");
    const raw = response.data;
    if (!Array.isArray(raw)) return [];
    return raw;
  } catch (error) {
    console.error("Error al obtener los espacios:", error);
    return [];
  }
};

export const getFilteredSpaces = async (filters: {
  searchQuery?: string;
  checkIn?: string;
  checkOut?: string;
}) => {
  try {
    const response = await api.get("/spaces/getAll", {
      params: filters,
    });
    console.log(response.data);
    const raw = response.data;
    if (!Array.isArray(raw)) return [];
    return raw;
  } catch (error) {
    console.error("Error al obtener los espacios:", error);
    return [];
  }
};

export const getUniversitySpaces = async () => {
  try {
    const response = await api.get("/spaces/getAll", {
      params: { category: "university" },
    });
    const raw = response.data;
    if (!Array.isArray(raw)) return [];
    return raw;
  } catch (error) {
    console.error("Error al obtener los espacios universitarios:", error);
    return [];
  }
};

export const getSpaceById = async (id: number) => {
  try {
    const response = await api.get(`/spaces/getbyid/${id}`);
    const item = response.data as any;

    let paymentMethods: string[] = [];
    if (typeof item.paymentMethods === "string") {
      try {
        paymentMethods = JSON.parse(item.paymentMethods);
      } catch {
        paymentMethods = [];
      }
    } else {
      paymentMethods=item.paymentMethods;
    }

    let images: string[] = [];
    if (typeof item.images === "string") {
      try {
        images = JSON.parse(item.images);
      } catch {
        images = [];
      }
    } else {
      images=item.images;
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
