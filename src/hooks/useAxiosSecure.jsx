import axios, { Axios } from "axios";
import React, { useEffect } from "react";

import { AiFillX } from "react-icons/ai";
import { useNavigate } from "react-router";
import useAuth from "./useAuth";

const axiosSecure = axios.create({
    baseURL: "http://localhost:3000",
    timeout: 10000,
    headers: { "X-Custom-Header": "foobar" },
});

const useAxiosSecure = () => {
    const { user, logOut } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        // intercept request
        const reqInterceptor = axiosSecure.interceptors.request.use((config) => {
            config.headers.Authorization = `Bearer ${user?.accessToken}`;
            return config;
        });
        // intercept respone
        const resInterceptor = axiosSecure.interceptors.response.use(
            (response) => {
                return response;
            },
            (error) => {
                console.log(error);
                const statusCode = error.status;
                if (statusCode === 401 || statusCode === 403) {
                    logOut().then(() => {
                        navigate("/login");
                    });
                }

                return Promise.reject(error);
            },
        );
        return () => {
            axiosSecure.interceptors.request.eject(reqInterceptor);
            axiosSecure.interceptors.response.eject(resInterceptor);
        };
    }, [user, navigate, logOut]);

    return axiosSecure;
};

export default useAxiosSecure;
