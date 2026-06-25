import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL_PROD
    : process.env.REACT_APP_API_URL;

const API = axios.create({
  baseURL,
  withCredentials: true // 🔥 VERY IMPORTANT
});

export default API;