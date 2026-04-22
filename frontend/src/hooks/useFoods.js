import { useState, useCallback, useEffect } from "react";
import { axiosReq } from "../api/axiosDefaults";

function useFoods() {
  // Stores all saved foods for the logged-in user.
  const [foods, setFoods] = useState([]);
  // Indicates whether the hook is currently fetching foods.
  const [loading, setLoading] = useState(true);
  // Stores an error string for the UI
  const [error, setError] = useState("");

  // useCallback to keep function stable on rerender
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

  // Fetch the foods
  useEffect(() => {
    fetchFoods();
  }, [fetchFoods]);

  // Returns relevent data to the component
  return {
    foods,
    setFoods,
    loading,
    error,
    refreshFoods: fetchFoods,
  };
}

export default useFoods;
