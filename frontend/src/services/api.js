import axios from "axios";
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://machans-egg-retail-2.onrender.com",
});
export default api;