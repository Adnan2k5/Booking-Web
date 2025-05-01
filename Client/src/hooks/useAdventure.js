import { useState, useEffect, useRef } from "react";
import { fetchAllAdventures } from "../Api/adventure.api";

/**
 * useAdventures - Fetches and caches all adventures.
 * @returns {object} { adventures, isLoading, error, refetch }
 */
export function useAdventures() {
  const cache = useRef(null);
  const [adventures, setAdventures] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAdventures = async () => {
    setIsLoading(true);
    try {
      const res = await fetchAllAdventures();
      cache.current = res.data;
      setAdventures(res.data);
      setError(null);
    } catch (err) {
      setError(err);
      setAdventures([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (cache.current) {
      setAdventures(cache.current);
      return;
    }
    fetchAdventures();
  }, []);

  return { adventures, isLoading, error, refetch: fetchAdventures };
}
