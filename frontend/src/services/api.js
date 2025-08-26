import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://machans-egg-retail-2.onrender.com",
});

export default api;


export async function fetchData(endpoint) {
  const res = await fetch(`${API_BASE_URL}${endpoint}`);
  if (!res.ok) throw new Error("API error");
  return res.json();
}

export async function postData(endpoint, data) {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("API error");
  return res.json();
}
