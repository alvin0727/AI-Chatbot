import AuthAdapter from "../adapters/auth-adapter";

const loginService = async (email: string, password: string) => {
    const response = await AuthAdapter.loginAdapter(email, password);
    return response.data;

};

const verifyLoginOTPService = async (email: string, otp: string) => {
    const response = await AuthAdapter.verifyLoginOTPAdapter(email, otp);
    return response.data;
};

const resendLoginOTPService = async (email: string) => {
    const response = await AuthAdapter.resendLoginOTPAdapter(email);
    return response.data;
};

const signupService = async (name: string, email: string, password: string) => {
    const response = await AuthAdapter.signupAdapter(name, email, password);
    return response.data;
};

const authStatusService = async () => {
    const response = await AuthAdapter.authStatus();
    return response.data;
};

export {
    loginService,
    verifyLoginOTPService,
    resendLoginOTPService,
    authStatusService,
    signupService
};