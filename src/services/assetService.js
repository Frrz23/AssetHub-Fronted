import api from "../api/axios";

export const getAssets = async () => {
  const response = await api.get("/assets");
  return response.data;
};

export const createAsset = async (assetData) => {
  const response = await api.post("/assets", assetData, {
    withCredentials: true,
  });
  return response.data;
};

// Fixed approve function - handle 204 No Content response
export const approveAsset = async (id) => {
  try {
    const response = await api.post(`/assets/${id}/approve`);
    // For 204 No Content, just return success indicator
    return { success: true };
  } catch (error) {
    console.error("Approve asset error:", error);
    throw error;
  }
};

// Fixed delete function - handle 204 No Content response
export const deleteAsset = async (id) => {
  try {
    const response = await api.delete(`/assets/${id}`);
    // For 204 No Content, just return success indicator
    return { success: true };
  } catch (error) {
    console.error("Delete asset error:", error);
    throw error;
  }
};

// Fixed deactivate function - handle 204 No Content response
export const deactivateAsset = async (id) => {
  try {
    const response = await api.post(`/assets/${id}/deactivate`);
    // For 204 No Content, just return success indicator
    return { success: true };
  } catch (error) {
    console.error("Deactivate asset error:", error);
    throw error;
  }
};

// Fixed reactivate function - using api instance instead of fetch
export const reactivateAsset = async (id) => {
  try {
    const response = await api.post(`/assets/${id}/reactivate`);
    // For 204 No Content, just return success indicator
    return { success: true };
  } catch (error) {
    console.error("Reactivate asset error:", error);
    throw error;
  }
};

export const getDashboardStats = async () => {
  const response = await api.get("/assets/dashboard");
  return response.data;
};

// 📥 Download Excel file
export const downloadAssetExcel = async () => {
  const response = await api.get("/assets/export", {
    responseType: "blob",
  });
  return response;
};

// 📤 Upload Excel file
export const uploadAssetExcel = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post("/assets/import-excel", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};