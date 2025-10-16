import axios from 'axios';
import config from '../config/environment';

const api = axios.create({
    baseURL: config.apiUrl,
    timeout: 10000,
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        // If 401, try refreshing
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return api(originalRequest);
                });
            }

            isRefreshing = true;
            try {
                const refreshToken = localStorage.getItem('refresh');
                const res = await axios.post(`${config.apiUrl}/api/v1/auth/token/refresh/`, {
                    refresh: refreshToken,
                });

                const newAccess = res.data.access;
                localStorage.setItem('access', newAccess);
                api.defaults.headers.common['Authorization'] = 'Bearer ' + newAccess;

                processQueue(null, newAccess);
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                localStorage.clear();
                // window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
