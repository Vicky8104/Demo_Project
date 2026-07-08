import axios from "axios";

const API = axios.create({
  baseURL: "https://demo-project-qaqh.onrender.com/api",
  withCredentials: true
});

API.interceptors.request.use((req) => {
  console.log("FINAL URL:", req.baseURL + req.url);
  return req;
});

export default API;
