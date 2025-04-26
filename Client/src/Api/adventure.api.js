import { axiosClient } from "../AxiosClient/axios";



export const createAdventure = async (data) => {
    const res = await axiosClient.post("/api/adventure/create", data, {withCredentials: true, headers: {
        "Content-Type": "multipart/form-data"
    }});
    return res;
}

export const fetchAllAdventures = async () => {
    const res = await axiosClient.get("/api/adventure/all");
    return res.data;
}