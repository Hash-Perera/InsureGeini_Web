import axiosInstance from "@/hooks/axios";

export const addStaff = async (data) => {
  try {
    const response = await axiosInstance.post("/user/createStaff", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getStaff = async () => {
  try {
    const response = await axiosInstance.get("/user/getAllStaff");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await axiosInstance.delete(`/user/deleteUser/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
