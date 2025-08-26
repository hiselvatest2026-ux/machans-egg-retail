import axios from "axios";

// Base URL dynamically from environment or default to Render backend
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://machans-egg-retail-2.onrender.com/api",
});

// Example API functions
export const getPurchases = () => API.get("/purchases");
export const createPurchase = (data) => API.post("/purchases", data);
export const updatePurchase = (id, data) => API.put(`/purchases/${id}`, data);
export const deletePurchase = (id) => API.delete(`/purchases/${id}`);

export const getSales = () => API.get("/sales");
export const createSale = (data) => API.post("/sales", data);

export const getPayments = () => API.get("/payments");
export const createPayment = (data) => API.post("/payments", data);

export default API;
