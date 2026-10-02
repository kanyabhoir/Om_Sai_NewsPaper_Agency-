import axios from "axios";

// Local: http://localhost:5000/api
// Live:  set VITE_API_URL in .env.production (your Render URL)
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const API = axios.create({
  baseURL: API_BASE_URL,
});

// Easy helper: turn axios error into a simple message
export function getErrorMessage(error, fallback = "Something went wrong") {
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.message === "Network Error" || !error.response) {
    return "Cannot connect to server. Is the backend running?";
  }
  return fallback;
}

// GET all customers
export async function getCustomers() {
  const response = await API.get("/customers");
  return response.data;
}

// ADD a customer
export async function addCustomer(data) {
  const response = await API.post("/customers", data);
  return response.data;
}

// UPDATE a customer
export async function updateCustomer(id, data) {
  const response = await API.put(`/customers/${id}`, data);
  return response.data;
}

// DELETE a customer
export async function deleteCustomer(id) {
  await API.delete(`/customers/${id}`);
}
