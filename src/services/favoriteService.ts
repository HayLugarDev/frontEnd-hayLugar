import api from "./apiService";

export const addFavorite = async (spaceId: number) => {
    try {
        const response = await api.post(`/favorites/${spaceId}`, { withCredentials: true });
        console.log(response.data);
        return response.data
    } catch (error) {
        console.error("Error al obtener el ID del espacio:", error);
        return [];
    }
};

export const removeFavorite = async (spaceId: number) => {
    try {
        const response = await api.delete(`/favorites/${spaceId}`, { withCredentials: true });
        console.log(response.data);
        return response.data
    } catch (error) {
        console.error("Error al obtener el ID del espacio:", error);
        return [];
    }
};

export const getUserFavorites = async () => {
    try {
        const response = await api.get('/favorites', { withCredentials: true });
        console.log(response.data);
        return response.data
    } catch (error) {
        console.error("Error al obtener los favoritos:", error);
        return [];
    }
};