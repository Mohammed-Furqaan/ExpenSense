import axios from "axios";

// In production: VITE_API_URL = https://your-app.onrender.com
// In development: proxy via vite handles /api -> localhost:5000
const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : "/api";

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("expensense_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("expensense_token");
      localStorage.removeItem("expensense_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
