// services/universityService.ts
import api from './apiService';

export const getUniversitySpaces = async () => {
  try {
    const response = await api.get('/spaces/getAll');
    return response.data;
  } catch (error) {
    console.error('Error al obtener espacios universitarios:', error);
    return [];
  }
};
