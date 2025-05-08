import { useState, useEffect } from "react";
import { fetchAllAdventures } from "../Api/adventure.api";

/**
 * useAdventures - Fetches and caches all adventures with pagination and search.
 * @returns {object} { adventures, isLoading, error, refetch, page, setPage, totalPages, total, limit, setLimit, search, setSearch }
 */
export function useAdventures() {
  const [adventures, setAdventures] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  const fetchAdventures = async () => {
    setIsLoading(true);
    try {
      const res = await fetchAllAdventures();
      setAdventures(res.data.adventures);
    } catch (err) {
      setAdventures([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdventures();
  }, []);

  return {
    adventures,
    isLoading,
    refetch: () => fetchAdventures(page, limit, search),
  };
}
