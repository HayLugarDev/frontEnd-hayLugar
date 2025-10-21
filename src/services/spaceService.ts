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

export const getSpaceImages = async (spaceId: number) => {
  try {
    const response = await api.get(`/spaces/${spaceId}/images`);
    const data = response.data;

    // Si las imágenes vienen como string JSON → convertir
    let images: string[] = [];
    if (typeof data === "string") {
      try {
        images = JSON.parse(data);
      } catch {
        images = [];
      }
    } else if (Array.isArray(data)) {
      images = data;
    } else if (data?.images) {
      // si la respuesta es un objeto con la propiedad images
      if (typeof data.images === "string") {
        try {
          images = JSON.parse(data.images);
        } catch {
          images = [];
        }
      } else {
        images = data.images;
      }
    }

    return images;
  } catch (error) {
    console.error(`Error al obtener imágenes del espacio ${spaceId}:`, error);
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
      paymentMethods = item.paymentMethods;
    }
    // let images: string[] = [];
    // if (typeof item.images === "string") {
    //   try {
    //     images = JSON.parse(item.images);
    //   } catch {
    //     images = [];
    //   }
    // } else {
    //   images=item.images;
    // }
    return {
      ...item,
      //      images,
      paymentMethods,
    };
  }
  catch (error) {
    console.error("Error al obtener el espacio por ID:", error);
  }
};

export const getSpaceBySlug = async (slug: string) => {
  try {
    const response = await api.get(`/spaces/getbyslug/${slug}`);
    const item = response.data as any;

    let paymentMethods: string[] = [];
    if (typeof item.paymentMethods === "string") {
      try {
        paymentMethods = JSON.parse(item.paymentMethods);
      } catch {
        paymentMethods = [];
      }
    } else {
      paymentMethods = item.paymentMethods;
    }

    // let images: string[] = [];
    // if (typeof item.images === "string") {
    //   try {
    //     images = JSON.parse(item.images);
    //   } catch {
    //     images = [];
    //   }
    // } else {
    //   images=item.images;
    // }

    return {
      ...item,
      //      images,
      paymentMethods,
    };
  } catch (error) {
    console.error("Error al obtener el espacio:", error);
  }
};
