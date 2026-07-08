import axios from "axios";

const API = axios.create({
  baseURL: "https://demo-project-qaqh.onrender.com/api",
  withCredentials: true, // 🔥 MUST
});

export default API;
