import axios from "axios";

// Local: http://localhost:5000/api
// Live:  set VITE_API_URL in .env.production (your Render URL)
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const API = axios.create({
  baseURL: API_BASE_URL,
  // Free Render sleeps when idle — first request can take up to ~60s
  timeout: 60000,
});

// Easy helper: turn axios error into a simple message
export function getErrorMessage(error, fallback = "Something went wrong") {
  if (error.code === "ECONNABORTED") {
    return "Server is waking up. Wait 1 minute and try again.";
  }
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.message === "Network Error" || !error.response) {
    return "Cannot connect to server. Open the API once to wake it, then retry.";
  }
  return fallback;
}

// Retry once — helps when Render free tier is sleeping
async function withRetry(requestFn) {
  try {
    return await requestFn();
  } catch (error) {
    // Retry only for network / timeout issues
    if (error.response) throw error;
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return await requestFn();
  }
}

// GET all customers
export async function getCustomers() {
  const response = await withRetry(() => API.get("/customers"));
  return response.data;
}

// ADD a customer
export async function addCustomer(data) {
  const response = await withRetry(() => API.post("/customers", data));
  return response.data;
}

// UPDATE a customer
export async function updateCustomer(id, data) {
  const response = await withRetry(() => API.put(`/customers/${id}`, data));
  return response.data;
}

// DELETE a customer
export async function deleteCustomer(id) {
  await withRetry(() => API.delete(`/customers/${id}`));
}
