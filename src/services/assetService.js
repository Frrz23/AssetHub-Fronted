import api from "../api/axios";

export const getAssets = async () => {
  const response = await api.get('/assets'); 
  return response.data;
};
export const createAsset = async (assetData) => {
  const response = await api.post('/assets', assetData,
  {
    withCredentials: true, // ✅ Must match backend
  });
  return response.data;
};
export const approveAsset = async (id, approve = true) => {
  const response = await api.put(`asset/${id}/approve`, { approve });
  return response.data;
};

export const deleteAsset = async (id) => {
  await api.delete(`asset/${id}`);
};

