import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const useApi = (endpoint, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    method = 'GET',
    params = {},
    body = null,
    dependencies = [],
    autoFetch = true,
  } = options;

  const fetchData = useCallback(async () => {
    if (!endpoint) return;

    setLoading(true);
    setError(null);

    try {
      const config = {
        method,
        url: `${API_BASE_URL}${endpoint}`,
        params: method === 'GET' ? params : undefined,
        data: method !== 'GET' ? body : undefined,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const response = await axios(config);

      if (response.data.success === false) {
        throw new Error(response.data.error?.message || 'Request failed');
      }

      setData(response.data.data || response.data);
    } catch (err) {
      console.error(`API Error (${endpoint}):`, err);
      setError(err.response?.data?.error?.message || err.message || 'An error occurred');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [endpoint, method, JSON.stringify(params), JSON.stringify(body)]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [fetchData, ...dependencies]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};

export default useApi;