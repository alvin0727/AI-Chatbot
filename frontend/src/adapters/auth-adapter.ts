import api from "./api-communicator";

export const loginAdapter = (email: string, password: string) => {
    return api.post("/auth/login", { email, password });
};

export const signupAdapter = (name: string, email: string, password: string) => {
    return api.post("/auth/signup", { name, email, password });
};