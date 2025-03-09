import axiosInstance from "@/hooks/axios";

export const addVehicle = async (data) => {
  try {
    const response = await axiosInstance.post("/vehicle/createVehicle", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteVehicle = async (id) => {
  try {
    const response = await axiosInstance.delete(`/vehicle/deleteVehicle/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
