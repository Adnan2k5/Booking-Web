import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { axiosClient } from "../AxiosClient/axios";
import { loginFailure, loginStart, setUser, logout } from "../Store/UserSlice";
import { Loader } from "../components/Loader";

// Create Authentication Context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const [loading, setLoading] = useState(true);

    const verifyToken = async () => {
        try {
            dispatch(loginStart());
            const res = await axiosClient.get("/api/user/profile", { withCredentials: true });
            dispatch(setUser(res.data));
        } catch (err) {
            dispatch(loginFailure(err.response?.status || 500));
        } finally {
            setLoading(false);
        }
    };

    const logoutUser = async () => {
        try {
            await axiosClient.post(
                '/api/auth/logout',
                {},
                {
                    withCredentials: true,
                }
            );
            dispatch(logout());
            localStorage.removeItem("accessToken");
            localStorage.removeItem("redirectAfterLogin");
        } catch (error) {
            console.error("Logout error:", error);
            dispatch(logout());
            localStorage.removeItem("accessToken");
            localStorage.removeItem("redirectAfterLogin");
        }
    };

    useEffect(() => {
        verifyToken();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, logout: logoutUser }}>
            {loading ? <Loader /> : children}
        </AuthContext.Provider>
    );
};

// Custom hook for consuming AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};
