import axiosInstance from "@/hooks/axios";

export const getDetectionsById = async (claimId) => {
  try {
    const response = await axiosInstance.get(`/detection/all/${claimId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
