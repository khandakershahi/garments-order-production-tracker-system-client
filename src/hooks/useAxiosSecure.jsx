import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import useAuth from "./useAuth";

const axiosSecure = axios.create({
    baseURL: "https://garments-order-production-tracker-s-six.vercel.app",
    timeout: 10000,
    headers: { "X-Custom-Header": "foobar" },
});

const useAxiosSecure = () => {
    const { user, logOut } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // 1. Request Interceptor (Looks good)
        const reqInterceptor = axiosSecure.interceptors.request.use((config) => {
            // Only attach the token if the user is available
            if (user?.accessToken) {
                config.headers.Authorization = `Bearer ${user.accessToken}`;
            }
            return config;
        });

        // 2. Response Interceptor (FIXED)
        const resInterceptor = axiosSecure.interceptors.response.use(
            (response) => {
                return response;
            },
            (error) => {
                // ⭐ FIX: Access status code correctly from error.response.status ⭐
                const statusCode = error.response?.status;

                // Check for 401 (Unauthorized) or 403 (Forbidden)
                if (statusCode === 401 || statusCode === 403) {
                    // Use a clean logOut, ensuring we redirect AFTER state clearance
                    logOut().then(() => {
                        navigate("/login");
                    }).catch(logOutError => console.error("Logout failed:", logOutError));
                }

                // IMPORTANT: Always reject the promise so the component calling the API knows it failed
                return Promise.reject(error);
            },
        );

        // Cleanup
        return () => {
            axiosSecure.interceptors.request.eject(reqInterceptor);
            axiosSecure.interceptors.response.eject(resInterceptor);
        };
    }, [user, navigate, logOut]);

    return axiosSecure;
};

export default useAxiosSecure;