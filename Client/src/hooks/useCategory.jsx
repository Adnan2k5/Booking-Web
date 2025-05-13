import { useState, useEffect } from "react";
import { getCategories } from "../Api/category.api";

export function useCategory() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await getCategories();
                setCategories(res.data.message);
                setLoading(false);
            }
            catch (error) {
                console.error("Error fetching categories:", error);
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);


    return { categories, loading };
}