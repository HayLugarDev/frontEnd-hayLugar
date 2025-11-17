import api from "./apiService";

export async function getReviewsBySpace(spaceId: number) {
  const res = await api.get(`/reviews/space/${spaceId}`);
  return res.data;
};

export async function getReviewsByUser(targetId: number) {
  const res = await api.get(`/reviews/received/${targetId}`, { withCredentials: true });
  return res.data;
};