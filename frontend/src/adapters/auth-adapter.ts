import api from "./api-communicator";

const loginAdapter = (email: string, password: string) => {
    return api.post("/users/login", { email, password });
};

const verifyLoginOTPAdapter = (email: string, otp: string) => {
    return api.post("/users/verify-login-otp", { email, otp });
};

const resendLoginOTPAdapter = (email: string) => {
    return api.post("/users/resend-login-otp", { email });
};

const signupAdapter = (name: string, email: string, password: string) => {
    return api.post("/users/signup", { name, email, password });
};

const resendVerificationEmailAdapter = (email: string) => {
    return api.post("/users/resend-verification", { email });
};

const verifyEmailAdapter = (token: string) => {
    return api.post("/users/verify-email", { token });
};

const logoutAdapter = () => {
    return api.post("/users/logout");
};

const authStatus = () => {
    return api.get("/users/auth-status");
};

const refreshTokenAdapter = () => {
    return api.post("/users/refresh-token");
};

export default {
    loginAdapter,
    verifyLoginOTPAdapter,
    resendLoginOTPAdapter,
    signupAdapter,
    resendVerificationEmailAdapter,
    verifyEmailAdapter,
    logoutAdapter,
    authStatus,
    refreshTokenAdapter
};