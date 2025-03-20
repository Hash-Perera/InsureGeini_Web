import axiosInstance from "@/hooks/axios";

export const addCustomer = async (data) => {
  try {
    const response = await axiosInstance.post("/user/createCustomer", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllCustomers = async () => {
  try {
    const response = await axiosInstance.get("/user/getAllCustomers");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCustomerById = async (id) => {
  try {
    const response = await axiosInstance.get(`/user/getCustomerById/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
