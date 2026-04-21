import { useEffect, useState } from "react";
import { axiosReq } from "../api/axiosDefaults";

function useMealEntries(date) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        setLoading(true);
        const { data } = await axiosReq.get(`/meal-entry/?date=${date}`);
        setEntries(data);
      } catch (err) {
        setError("Could not load meal entries.");
        console.log(err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };

    if (date) {
      fetchEntries();
    }
  }, [date]);

  return { entries, setEntries, loading, error };
}

export default useMealEntries;