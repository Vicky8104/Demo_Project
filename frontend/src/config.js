
const API = process.env.REACT_APP_API_URL;

// 🔥 ensure no double slash issue
const CLEAN_API = API.endsWith("/") ? API.slice(0, -1) : API;

export const BASE_URL = CLEAN_API.replace("/api", "");
export default CLEAN_API;
