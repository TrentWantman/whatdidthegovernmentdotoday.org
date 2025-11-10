import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

/**
 * Fetches congress data (most recent bills) from the backend.
 * Accepts query parameters (e.g., { limit: 5 }).
 */
export const fetchCongressData = async (params) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/congress`, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching congress data", error);
    throw error;
  }
};

/**
 * Fetches paginated congress actions from the backend.
 * Accepts parameters like { offset, limit }.
 */
export const fetchCongressActionsPaginated = async (params) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/congress/paginated`, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching congress actions", error);
    throw error;
  }
};

/**
 * Fetches details for a single bill.
 * @param {string} billSlug - The bill slug (e.g. "118-hr-146")
 */
export const fetchBillDetails = async (billSlug) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/congress/bill/${billSlug}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching bill details", error);
    throw error;
  }
};
