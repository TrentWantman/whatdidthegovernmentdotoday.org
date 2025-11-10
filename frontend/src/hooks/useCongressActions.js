import { useState, useEffect } from "react";
import { fetchCongressData } from "../api/congressApi";

const useCongressActions = (params = { limit: 5 }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCongressActions = async () => {
      try {
        const result = await fetchCongressData(params);
        setData(result);
      } catch (err) {
        setError("Error fetching congress actions");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getCongressActions();
  }, [params]);

  return { data, error, loading };
};

export default useCongressActions;
