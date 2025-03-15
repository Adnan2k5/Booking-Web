import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
    user: null,
    loading: false,
    error: null,
    access_Token: null
}


const userSlice = createSlice({
    name: "user",
    initialState,
    reducers : {
        loginStart: (state) => {
            state.loading = true;
            state.error = null; 
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.error = null;
            state.access_Token = action.payload.accessToken;
            Cookies.set("access_Token" , action.payload.accessToken, {secure: true});
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.loading = false;
            state.error = null;
            Cookies.remove("accessToken");
        }
    }
})


export const {loginStart, loginSuccess, loginFailure, logout} = userSlice.actions;
export default userSlice.reducer;