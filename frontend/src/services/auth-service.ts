import { loginAdapter, signupAdapter } from "../adapters/auth-adapter";

const loginService = async (email: string, password: string) => {
    const response = await loginAdapter(email, password);
    if (response.status !== 200) {
        throw new Error("Login failed");
    }
    return response.data;
};

const signupService = async (name: string, email: string, password: string) => {
    const response = await signupAdapter(name, email, password);
    return response.data;
};

export { loginService, signupService };