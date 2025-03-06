import axiosInstance from "@/hooks/axios";

export const addStaff = async (data) => {
  try {
    const response = await axiosInstance.post("/user/createStaff", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
