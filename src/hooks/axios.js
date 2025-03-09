import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Add request interceptor to attach token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Adjust key if different
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
