import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/congress';

// Fetch Individual Bill Details
export const fetchBillDetails = async (congress, type, number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/bill/${congress}/${type}/${number}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch bill details');
  }
};

// Fetch Paginated Bills
export const fetchCongressActions = async (offset, limit) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/paginated`, {
      params: { offset, limit },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch congressional actions');
  }
};