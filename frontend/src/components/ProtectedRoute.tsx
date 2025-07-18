import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import React from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const auth = useAuth();

    if (!auth?.isLoggedIn) {
        return <Navigate to="/login" replace />;
    }
    if (!auth?.user?.isVerified) {
        return <Navigate to="/" replace />;
    }
    return <>{children}</>;
};

export default ProtectedRoute;