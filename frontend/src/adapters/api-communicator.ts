import axios from "axios";
import AuthAdapter from "./auth-adapter";

const api = axios.create({
    baseURL: "http://localhost:5000/api/v1",
    withCredentials: true,
    timeout: 10000,
    headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes("/users/refresh-token")
        ) {
            originalRequest._retry = true;
            try {
                await AuthAdapter.refreshTokenAdapter();
                return api(originalRequest);
            } catch (refreshError) {
                if (window.location.pathname !== "/login") {
                    window.location.href = "/login";
                }
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;