import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'http://localhost:4000/api',
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;