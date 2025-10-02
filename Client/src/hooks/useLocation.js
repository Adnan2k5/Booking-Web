import { useState, useEffect } from 'react';
import { fetchLocations } from '../Api/location.api';

/**
 * useLocations - Fetches and caches all locations.
 * @returns {object} { locations, isLoading, error, refetch }
 */
export function useLocations() {
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLocationData = async () => {
    setIsLoading(true);
    try {
      const res = await fetchLocations();
      setLocations(Array.isArray(res) ? res : []);
    } catch (err) {
      setLocations([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLocationData();
  }, []);

  return {
    locations,
    isLoading,
    refetch: fetchLocationData
  };
}