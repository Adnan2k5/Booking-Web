import { axiosClient } from "../AxiosClient/axios";

export const getAllItems = async (page, limit, search, category) => {
    try {
        const response = await axiosClient.get("api/items/", {
        params: {
            search,
            category,
            page,
            limit,
        },
        });
        return response.data;
    } catch (error) {
        throw new Error("Error fetching items");
    }
}