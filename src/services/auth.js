import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const login = async (insuranceId, password) => {
  try {
    const response = await axios.post(`${baseURL}/auth/login`, {
      insuranceId,
      password,
    });
    return response?.data;
  } catch (error) {
    console.error("Error logging in:", error.message);
    throw error;
  }
};
