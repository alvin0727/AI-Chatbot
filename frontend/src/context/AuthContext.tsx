import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import * as AuthServices from "../services/auth-service";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

type User = {
    name: string;
    email: string;
};

type UserAuth = {
    isLoggedIn: boolean;
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    verifyToken: (email: string, otp: string) => Promise<void>;
    logout: () => void;
}
const AuthContext = createContext<UserAuth | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Check auth status
    useEffect(() => {
        async function checkStatus() {
            try {
                const data = await AuthServices.authStatusService();
                if (data) {
                    setUser({ name: data.name, email: data.email });
                    setIsLoggedIn(true);
                }
            } catch (error: any) {
                setUser(null);
                setIsLoggedIn(false);

                if (location.pathname !== "/login" && location.pathname !== "/signup") {
                    toast.error((error.response?.data?.message + " - Please login again") || "Failed to fetch auth status - please login again");
                    navigate("/login");
                }
            }
        }
        checkStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname, navigate]);

    const login = async (email: string, password: string) => {
        try {
            const res = await AuthServices.loginService(email, password);
            if (res) {
                setUser({ name: res.data.name, email: res.data.email });
                navigate("/otp");
            } else {
                throw new Error("Login failed");
            }
        } catch (error: any) {
            throw error;
        }
    };
    const signup = async (name: string, email: string, password: string) => {
        // handle signup logic
    };
    const verifyToken = async (email: string, otp: string) => {
        const res = await AuthServices.verifyLoginOTPService(email, otp);
        if (res) {
            setUser({ name: res.user.name, email: res.user.email });
            setIsLoggedIn(true);
            navigate("/");
        }
    };
    const logout = () => {
        // handle logout logic
    };

    const value = {
        user,
        isLoggedIn,
        login,
        signup,
        logout,
        verifyToken
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);