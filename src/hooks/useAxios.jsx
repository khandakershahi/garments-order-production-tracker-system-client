import axios from "axios";
import React from "react";

const axiosInstance = axios.create({
    baseURL: "https://garments-order-production-tracker-s-six.vercel.app",
});

const useAxios = () => {
    return axiosInstance;
};

export default useAxios;
