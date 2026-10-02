import axios from "axios";

// Base URL of your Express backend
const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Easy helper: turn axios error into a simple message
export function getErrorMessage(error, fallback = "Something went wrong") {
  // Backend sent a message? use it
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  // Backend is not running / network issue
  if (error.message === "Network Error" || !error.response) {
    return "Cannot connect to server. Is the backend running?";
  }
  return fallback;
}

// GET all customers
export async function getCustomers() {
  const response = await API.get("/customers");
  return response.data; // return only the data (array)
}

// ADD a customer
export async function addCustomer(data) {
  const response = await API.post("/customers", data);
  return response.data; // return the new customer
}

// UPDATE a customer
export async function updateCustomer(id, data) {
  const response = await API.put(`/customers/${id}`, data);
  return response.data; // return the updated customer
}

// DELETE a customer
export async function deleteCustomer(id) {
  await API.delete(`/customers/${id}`);
}
