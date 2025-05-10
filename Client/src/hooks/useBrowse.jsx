import { fetchFilteredAdventures } from "../Api/adventure.api";
import { useState, useEffect } from "react";

export function useBrowse() {
    const [adventures, setAdventures] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        adventure: "",
        location: "",
        session_date: "",
    });

    const fetchAdventures = async () => {
        setIsLoading(true);
        try {
            console.log("Fetching adventures with filters:", filters);
            // Only return empty if all filters are empty
            if (!filters.adventure && !filters.location && !filters.session_date) {
                setAdventures([]);
                return;
            }
            const res = await fetchFilteredAdventures(filters);
            setAdventures(res.data.data);
        } catch (err) {
            setError(err);
            setAdventures([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAdventures();
    }, [filters]);

    return { adventures, isLoading, error, filters, setFilters };
}