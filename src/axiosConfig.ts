import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'https://pos-app-api-five.vercel.app/api',
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;