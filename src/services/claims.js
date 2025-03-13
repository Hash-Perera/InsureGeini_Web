import axiosInstance from "@/hooks/axios";

export const getAllClaims = async () => {
  try {
    const response = await axiosInstance.get("/claims/all");
    return response.data;
  } catch (error) {
    throw error;
  }
};
