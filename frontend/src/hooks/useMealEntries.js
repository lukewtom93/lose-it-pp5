import { useEffect, useState } from "react";
import { axiosReq } from "../api/axiosDefaults";

function useMealEntries(date) {
  // All meal entries for the selected date
  const [entries, setEntries] = useState([]);
  // Loading state for the API call
  const [loading, setLoading] = useState(true);
  // Error text for API call
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        setLoading(true);
        // Fetch meals by date
        const { data } = await axiosReq.get(`/meal-entry/?date=${date}`);
        setEntries(data);
      } catch (err) {
        setError("Could not load meal entries.");
        console.log(err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };
    // Only fetches if supplyed with a date
    if (date) {
      fetchEntries();
    }
  }, [date]);

  return { entries, setEntries, loading, error };
}

export default useMealEntries;