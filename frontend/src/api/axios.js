import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true
});

API.interceptors.request.use((req) => {
  console.log("FINAL URL:", req.baseURL + req.url);
  return req;
});

export default API;
