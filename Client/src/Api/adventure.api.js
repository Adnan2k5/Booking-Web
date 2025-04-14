import { axiosClient } from "../AxiosClient/axios";



export const createAdventure = async (data) => {
    const res = await axiosClient.post("/api/adventure/create", data, {withCredentials: true, headers: {
        "Content-Type": "multipart/form-data"
    }});
    return res;
}