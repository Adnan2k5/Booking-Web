import { axiosClient } from "../AxiosClient/axios.js";




export const getAdventure = async () => {
    try {
        const response = await axiosClient.get("/api/adventure/fetch");
        return response.data;
    }
    catch(err){
        console.log(err);
    }
}
