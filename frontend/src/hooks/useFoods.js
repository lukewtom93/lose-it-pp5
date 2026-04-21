import { useState, useCallback, useEffect } from "react";
import { axiosReq } from "../api/axiosDefaults";

function useFoods() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const fetchFoods = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await axiosReq.get("/food/");
      setFoods(data);
    } catch (err) {
      setError("Could not load foods.");
      console.log(err.response?.data || err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFoods();
  }, [fetchFoods]);

  return {
    foods,
    setFoods,
    loading,
    error,
    refreshFoods: fetchFoods,
  };
}

export default useFoods;
