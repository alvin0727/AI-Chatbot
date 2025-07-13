import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

type User = {
    name: string;
    email: string;
};

type UserAuth = {
    isLoggedIn: boolean;
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}
const AuthContext = createContext<UserAuth | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => { 
    const [user, setUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    // 
    useEffect(() => {
        // fetch if the user's cookies are valid then skip login

    }, []);

    const login = async (email: string, password: string) => {
        //handle login logic
    };
    const signup = async (name: string, email: string, password: string) => {
        // handle signup logic
    };
    const logout = () => async () => {
        // handle logout logic
    };

    const value = {
        user,
        isLoggedIn,
        login,
        signup,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);