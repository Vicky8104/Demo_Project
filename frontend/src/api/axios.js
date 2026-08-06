
import axios from "axios";

const API = axios.create({
   baseURL: process.env.REACT_APP_API_URL,
});

// 🔥 interceptor
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  //  console.log("AXIOS TOKEN:", token); // 🔥

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;