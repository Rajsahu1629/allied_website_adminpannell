import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;
console.log(baseURL,"baseUrl")
// GET request with query params
export const fetchGetRequest = async (url, params = {}) => {
  try {
    const response = await axios.get(`${baseURL}${url}`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// POST request
export const sendPostRequest = async (url, payload) => {
  console.log(baseURL, url, "baseaefads");

  try {
    const isFormData = payload instanceof FormData;

    const response = await axios.post(`${baseURL}${url}`, payload, {
      headers: isFormData
        ? { "Content-Type": "multipart/form-data" }
        : { "Content-Type": "application/json" },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// PUT request
export const sendPutRequest = async (url, payload) => {
  try {
    const response = await axios.put(`${baseURL}${url}`, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// PATCH request
export const sendPatchRequest = async (url, payload) => {
  try {
    const response = await axios.patch(`${baseURL}${url}`, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// DELETE request
export const sendDeleteRequest = async (url) => {
  try {
    const response = await axios.delete(`${baseURL}${url}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
