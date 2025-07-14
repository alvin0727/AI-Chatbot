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

const authStatus = () => {
    return api.get("/users/auth-status");
};

export default {
    loginAdapter,
    verifyLoginOTPAdapter,
    resendLoginOTPAdapter,
    signupAdapter,
    authStatus
};