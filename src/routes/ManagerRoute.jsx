import React from "react";
import useAuth from "../hooks/useAuth";
import useRole from "../hooks/useRole";
import Loading from "../components/Loading/Loading";
import { Navigate } from "react-router"; // Use 'react-router-dom' for Navigate
import Forbidden from "../components/Forbidden/Forbidden";

const ManagerRoute = ({ children }) => {
    // 1. We still need user and loading for basic checks (even if wrapped by PrivateRoute)
    const { loading, user } = useAuth();
    const { role, roleLoading } = useRole();

    // --- STEP 1: Handle Loading ---
    // Wait for Firebase auth (loading) and role fetch (roleLoading)
    if (loading || roleLoading) {
        return <Loading></Loading>;
    }

    // --- STEP 2: Handle Unauthenticated User (Fallback/Security) ---
    // Although PrivateRoute handles this, it's safer to include a check
    // to navigate to login if, for any reason, 'user' is null.
    // If the PrivateRoute is working correctly, this shouldn't fire often.
    if (!user) {
        // Redirects unauthenticated users to login
        return <Navigate to="/login" replace={true} />;
    }

    // --- STEP 3: Handle Role Mismatch ---
    // If the user is logged in but their role is not 'manager', show forbidden.
    if (role !== "manager") {
        return <Forbidden></Forbidden>;
    }

    // --- STEP 4: Grant Access ---
    return children;
};

export default ManagerRoute;