import { useState, useEffect, useRef } from "react";
import { fetchAllAdventures } from "../Api/adventure.api";

/**
 * useAdventures - Fetches and caches all adventures with pagination.
 * @returns {object} { adventures, isLoading, error, refetch, page, setPage, totalPages, total, limit, setLimit }
 */
export function useAdventures(initialPage = 1, initialLimit = 10) {
  const [adventures, setAdventures] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchAdventures = async (pageArg = page, limitArg = limit) => {
    setIsLoading(true);
    try {
      const res = await fetchAllAdventures(pageArg, limitArg);
      setAdventures(res.data.data);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
      setError(null);
    } catch (err) {
      setError(err);
      setAdventures([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdventures(page, limit);
    // eslint-disable-next-line
  }, [page, limit]);

  return {
    adventures,
    isLoading,
    error,
    refetch: () => fetchAdventures(page, limit),
    page,
    setPage,
    totalPages,
    total,
    limit,
    setLimit,
  };
}
