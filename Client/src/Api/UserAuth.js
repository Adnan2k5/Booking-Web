import { loginSuccess } from "../Store/UserSlice.js";
import { axiosClient } from "../AxiosClient/axios.js";
export const UserRegister = async (data) => {
    const res = await axiosClient.post("/api/auth/signUp", data);
    if(res.status === 201){
        return res.status
    }
    else if(res.status === 409){
        return res.status
    }
}
export const VerifyUser = async (data, dispatch) => {
    const res = await axiosClient.post("/api/auth/verifyOtp", data);
    if(res.status === 200){
        dispatch(loginSuccess(res.data.data))
        return res.status;
    }
    else if(res.status === 400){
        return res.status;
    }
}