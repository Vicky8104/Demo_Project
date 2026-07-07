// import axios from "axios";

// const baseURL =
//   process.env.NODE_ENV === "production"
//     ? process.env.REACT_APP_API_URL_PROD
//     : process.env.REACT_APP_API_URL;

// const API = axios.create({
//   baseURL,
//   withCredentials: true // 🔥 VERY IMPORTANT
// });

// API.interceptors.request.use((req) => {
//   console.log("Request:", req.url);
//   return req;
// });

// export default API;

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
