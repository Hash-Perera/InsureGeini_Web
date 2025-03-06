import axiosInstance from "@/hooks/axios";

export const addCustomer = async (data) => {
  try {
    const response = await axiosInstance.post("/user/createCustomer", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
