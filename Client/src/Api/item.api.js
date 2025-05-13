import { axiosClient } from "../AxiosClient/axios";

export const getAllItems = async (page, limit) => {
    try {
        const response = await axiosClient.get("/items/", {
        params: {
            page,
            limit,
        },
        });
        return response.data;
    } catch (error) {
        throw new Error("Error fetching items");
    }
}