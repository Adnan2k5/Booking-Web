import { fetchFilteredAdventures } from "../Api/adventure.api";
import { useState, useEffect } from "react";

export function useSessions() {
    const [sessions, setSessions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        adventure: "",
        location: "",
        sessionDate: "",
    });
    
    const fetchSessions = async () => {
        setIsLoading(true);
        try {
            console.log("Fetching Sessions with filters:", filters);
            // Only return empty if all filters are empty
            if (!filters.adventure && !filters.location && !filters.session_date) {
                setSessions([]);
                return;
            }
            const res = await fetchFilteredAdventures(filters);
            setSessions(res.data.data);
        } catch (err) {
            setError(err);
            setSessions([]);
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        fetchSessions();
    }, [filters]);
    
    return { sessions, isLoading, error, filters, setFilters };
}