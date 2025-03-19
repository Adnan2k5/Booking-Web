import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
    user: null,
    loading: false,
    error: null,
    accessToken: null
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
            console.log("Storing : ",action.payload)
            state.error = null;
            state.accessToken = action.payload.accessToken;
            Cookies.set("accessToken", action.payload.accessToken);
            Cookies.set("refreshToken", action.payload.user.refreshToken);
        },
        setUser: (state,action) => {
            state.user = action.payload;
            state.loading = false;
            state.error = null;
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.loading = false;
            state.error = null;
        }
    }
})


export const {loginStart, loginSuccess, loginFailure, setUser, logout} = userSlice.actions;
export default userSlice.reducer;