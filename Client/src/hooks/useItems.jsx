import { fetchAllItems } from "../Api/items.api";
import { useState, useEffect } from "react";

export function useBrowse() {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState("")

    const fetchItems = async () => {
        setIsLoading(true);
        try {
            const res = await fetchAllItems(filters);
            setItems(res.data.data);
        } catch (err) {
            setError(err);
            setItems([]);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchItems();
    }, [filters]);


    return { items, isLoading, error, filters, setFilters };
}