import axiosInstance from "@/hooks/axios";

export const getAllClaims = async () => {
  try {
    const response = await axiosInstance.get("/claims/all");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getClaimById = async (id) => {
  try {
    const response = await axiosInstance.get(`/claims/detail/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fraudCompare = async (id) => {
  try {
    const response = await axiosInstance.get(`/claims/claimFraud/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fraudApprove = async (id) => {
  try {
    console.log("Fraud Appro");
    // const response = await axiosInstance.get(`/claims/approveFraud/${id}`);
    // return response.data;
  } catch (error) {
    throw error;
  }
};
