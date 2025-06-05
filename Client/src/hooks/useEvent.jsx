import { useState, useEffect } from "react";
import { getEvents } from "../Api/event.api";

export function useEvents({
    search = "",
    page = 1,
    limit = 12,
}) {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchEvents = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const res = await getEvents({
                    search,
                    page,
                    limit,
                });

                // Handle different response structures
                if (res) {
                    // Check if response has data property
                    if (res.data) {
                        const eventsData = res.data.events || res.data || [];
                        setEvents(eventsData);
                        setTotal(res.data.total || res.data.length || 0);
                        setTotalPages(res.data.totalPages || Math.ceil((res.data.total || res.data.length || 0) / limit));
                    }
                    // Check if response is an array directly
                    else if (Array.isArray(res)) {
                        setEvents(res);
                        setTotal(res.length);
                        setTotalPages(Math.ceil(res.length / limit));
                    }
                    // Check if response has events property directly
                    else if (res.events) {
                        setEvents(res.events);
                        setTotal(res.total || res.events.length || 0);
                        setTotalPages(res.totalPages || Math.ceil((res.total || res.events.length || 0) / limit));
                    }
                    // Fallback
                    else {
                        setEvents([]);
                        setTotal(0);
                        setTotalPages(1);
                    }
                } else {
                    setEvents([]);
                    setTotal(0);
                    setTotalPages(1);
                }
            } catch (err) {
                setError(err);
                setEvents([]);
                setTotal(0);
                setTotalPages(1);
            } finally {
                setIsLoading(false);
            }
        };
        fetchEvents();
    }, [search, page, limit]);
    return { events, isLoading, error, total, totalPages };
}
