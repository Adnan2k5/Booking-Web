import { useState, useEffect } from "react";
import { getHotel } from "../Api/hotel.api";

export function useHotels({
    search = "",
    page = 1,
    limit = 10,
    verified,
    location = null,
    minPrice = null,
    maxPrice = null,
    minRating = null,
    sortBy = "createdAt",
    sortOrder = "desc"
}) {
    const [hotels, setHotels] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchHotels = async () => {
            setIsLoading(true);
            try {
                const res = await getHotel({
                    search,
                    page,
                    limit,
                    verified,  // Changed back to 'verified'
                    location,
                    minPrice,
                    maxPrice,
                    minRating,
                    sortBy,
                    sortOrder
                });
                if (res && res.data) {
                    let hotelsData = res.data.hotels || [];
                    setHotels(hotelsData);
                    setTotal(res.data.total || 0);
                    setTotalPages(res.data.totalPages || 1);
                } else {
                    setHotels([]);
                    setTotal(0);
                    setTotalPages(1);
                }
                setError(null);
            } catch (err) {
                setError(err);
                setHotels([]);
                setTotal(0);
                setTotalPages(1);
            } finally {
                setIsLoading(false);
            }
        };
        fetchHotels();
    }, [search, page, limit, verified, location, minPrice, maxPrice, minRating, sortBy, sortOrder]);

    return { hotels, isLoading, error, total, totalPages };
}
