// src/services/industrialService.ts
import api from '../services/apiService';

export async function fetchIndustrialParks(params?: {
  owner_id?: number;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const { data } = await api.get('/industrial/parks', { params });
  return data; // { data: [...], meta: {...} }
}

export async function fetchIndustrialParkSpaces(parkId: number) {
  const { data } = await api.get(`/industrial/parks/${parkId}/spaces`);
  return data; // { data: [...] }
}

export async function fetchIndustrialSpaceDetail(spaceId: number) {
  const { data } = await api.get(`/industrial/spaces/${spaceId}`);
  return data; // { data: {...} }
}
