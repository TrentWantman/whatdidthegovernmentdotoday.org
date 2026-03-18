import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const fetchCongressData = async (params) => {
  const response = await axios.get(`${API_BASE_URL}/api/congress`, { params });
  return response.data;
};

export const fetchCongressActionsPaginated = async (params) => {
  const response = await axios.get(`${API_BASE_URL}/api/congress/paginated`, { params });
  return response.data;
};

export const fetchBillDetails = async (billSlug) => {
  const response = await axios.get(`${API_BASE_URL}/api/congress/bill/${billSlug}`);
  return response.data;
};
