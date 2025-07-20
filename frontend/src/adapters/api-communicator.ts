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
            !originalRequest.url.includes("/users/refresh-token") &&
            error.response?.data?.message === "Unauthorized"
        ) {
            originalRequest._retry = true;
            try {
                await AuthAdapter.refreshTokenAdapter();
                return api(originalRequest);
            } catch (refreshError: any) {
                if (refreshError && typeof refreshError === "object") {
                    refreshError.message = "Session expired. Please log in again.";
                    if (
                        refreshError.response &&
                        refreshError.response.data &&
                        typeof refreshError.response.data === "object"
                    ) {
                        refreshError.response.data.message = "Session expired. Please log in again.";
                    }
                }
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;