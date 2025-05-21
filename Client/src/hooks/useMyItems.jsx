import { useEffect, useState } from "react";
import { getAllItems} from "../Api/item.api";
import { createItems, updateItem } from "../Api/items.api";

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
            setItems(res.message);
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

    const handleCreateItem = async (item) => {
        try {
            const res = await createItems(item);
            await fetchItems();
        } catch (error) {
            console.error("Error creating item:", error);
            throw error;
        }
    }

    const handleEditItem = async (itemId, updatedItem) => {
        try {
            const res = await updateItem(itemId, updatedItem);
            await fetchItems();
        } catch (error) {
            console.error("Error editing item:", error);
            throw error;
        }
    }

    return { items, isLoading, error, setPage, setLimit, page, limit, handleCreateItem, handleEditItem };
}