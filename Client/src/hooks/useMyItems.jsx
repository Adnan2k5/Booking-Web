import { useEffect, useState } from "react";
import { getAllItems } from "../Api/item.api";

export function useMyItems() {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    
    const fetchItems = async () => {
        setIsLoading(true);
        try {
        const res = await getAllItems(page, limit);
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
    }, [page, limit]);
    
    return { items, isLoading, error, setPage, setLimit, page, limit };
}