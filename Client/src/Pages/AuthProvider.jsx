import { createContext, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { axiosClient } from "../AxiosClient/axios";
import { loginFailure, loginStart, setUser } from "../Store/UserSlice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
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
            const res = await axiosClient.get("/api/user/me", { withCredentials: true });
            dispatch(setUser(res.data));
        } catch (err) {
            dispatch(loginFailure(err.response?.status || 500));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        verifyToken();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {loading ? <Loader/> : children}
        </AuthContext.Provider>
    );
};

// Custom hook for consuming AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};
