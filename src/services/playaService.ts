import api from './apiService';

export const getAllParkingLots = async () => {
  const response = await api.get('/parking-lots');
  return response.data;
};

export const getParkingLotById = async (id: number) => {
  const response = await api.get(`/parking-lots/${id}`);
  return response.data;
};
export const reservarSpotEnPlaya = async (parkingLotId: number, payload: any) => {
  const response = await api.post(`/parking-lots/${parkingLotId}/reserve`, payload, {
    withCredentials: true,
  });
  return response.data;
};
