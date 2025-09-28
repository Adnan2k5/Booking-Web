import { useCallback, useEffect, useState } from "react";
import { getAdminDashboardStats } from "../Api/admin.api";

export function useAdminDashboard(range = "month") {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAdminDashboardStats(range);
      const payload = response?.data ?? null;
      setData(payload);
      setError(null);
      return payload;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [range]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    data,
    isLoading,
    error,
    refresh: fetchStats,
  };
}
