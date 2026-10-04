import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
});

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

async function withRetry(requestFn) {
  try {
    return await requestFn();
  } catch (error) {
    if (error.response) throw error;
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return await requestFn();
  }
}

export async function getNewspapers() {
  const response = await withRetry(() => API.get("/newspapers"));
  return response.data;
}

export async function addNewspaper(data) {
  const response = await withRetry(() => API.post("/newspapers", data));
  return response.data;
}

export async function updateNewspaper(id, data) {
  const response = await withRetry(() => API.put(`/newspapers/${id}`, data));
  return response.data;
}

export async function deleteNewspaper(id) {
  await withRetry(() => API.delete(`/newspapers/${id}`));
}
