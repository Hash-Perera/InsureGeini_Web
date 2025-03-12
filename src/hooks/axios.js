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

// Add response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => {
    return response; // If the request is successful, just return the response
  },
  async (error) => {
    // If the error is due to an expired token (403 Unauthorized)
    if (error.response && error.response.status === 403) {
      // Clear the expired token from localStorage
      localStorage.removeItem("token");

      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
