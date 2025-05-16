import { getAllInstructors, deleteInstructor } from "../Api/instructor.api";
import { useState, useEffect } from "react";

export function useInstructors() {
    const [instructors, setInstructors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const limit = 10;

    const fetchItems = async () => {
        setIsLoading(true);
        try {
            const res = await getAllInstructors();
            console.log(res);
            setInstructors(res.data.message.instructors);
            setTotal(res.data.message.total);
            setTotalPages(res.data.message.totalPages);
            setError(null);
        } catch (err) {
            setError(err);
            setInstructors([]);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchItems();
    }, []);

    const deleteAdventure = async (id) => {
        setIsLoading(true);
        try {
            await deleteInstructor(id);
            fetchItems();
            setError(null);
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    }

    return { instructors, isLoading, error, page, setPage, total, limit, deleteAdventure, totalPages };
}