import { getAllSessions } from "../Api/instructor.api";
import { useState, useEffect } from "react";

export function useSessions(filters = {adventure, location, session_date}) {
    const [sessions, setSessions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const fetchSessions = async () => {
        setIsLoading(true);
        try {
            if (!filters.adventure || !filters.location || !filters.session_date) {
                setSessions([]);
                return;
            }
            const res = await getAllSessions(filters);
            setSessions(res.data);
        } catch (err) {
            setError(err);
            setSessions([]);
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        fetchSessions();
    }, []);
    
    return { sessions, isLoading, error };
}