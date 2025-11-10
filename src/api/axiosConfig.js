// src/api/axiosConfig.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://ganesh-mandapam-api.onrender.com/api",
});

// ✅ Attach token automatically for every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
