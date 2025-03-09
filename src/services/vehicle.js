import axiosInstance from "@/hooks/axios";

export const addVehicle = async (data) => {
  try {
    const response = await axiosInstance.post("/vehicle/createVehicle", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
