import { useState, useEffect } from "react";
import { fetchAllAdventures } from "../Api/adventure.api";

/**
 * useAdventures - Fetches and caches all adventures with pagination and search.
 * @returns {object} { adventures, isLoading, error, refetch, page, setPage, totalPages, total, limit, setLimit, search, setSearch }
 */
export function useAdventures(initialPage = 1, initialLimit = 10, initialSearch = "") {
  const [adventures, setAdventures] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState(initialSearch);

  const fetchAdventures = async (pageArg = page, limitArg = limit, searchArg = search) => {
    setIsLoading(true);
    try {
      const res = await fetchAllAdventures(pageArg, limitArg, searchArg);
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
    fetchAdventures(page, limit, search);
    // eslint-disable-next-line
  }, [page, limit, search]);

  return {
    adventures,
    isLoading,
    error,
    refetch: () => fetchAdventures(page, limit, search),
    page,
    setPage,
    totalPages,
    total,
    limit,
    setLimit,
    search,
    setSearch,
  };
}
