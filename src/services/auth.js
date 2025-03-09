import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${baseURL}/user/login`, {
      email,
      password,
    });
    return response?.data;
  } catch (error) {
    console.error("Error logging in:", error.message);
    throw error;
  }
};
