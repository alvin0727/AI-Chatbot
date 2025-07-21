import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import CustomizedInput from "../components/shared/CustomizedInput";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (auth?.isLoggedIn) {
            navigate("/");
        }
    }, [auth?.isLoggedIn, navigate]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            setLoading(true);
            toast.loading("Signing up...", { id: "signup" });
            if (!name || !email || !password) {
                toast.error("Please fill in all fields", { id: "signup" });
                setLoading(false);
                return;
            }
            await auth?.signup(name, email, password);
            toast.success("Signup successful! Please check your email for verification.", { id: "signup" });
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Signup failed", { id: "signup" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen flex flex-col md:flex-row items-center justify-center gap-4 bg-[#10151c]">
            <div className="flex flex-1 items-center justify-center w-full py-4 md:py-0">
                <img
                    src="login.png"
                    alt="Login"
                    className="mx-auto w-[180px] md:w-[320px] h-auto"
                />
            </div>
            <div className="flex flex-1 items-center justify-center w-full py-4 md:py-0">
                <form
                    className="m-auto shadow-lg rounded-lg border-none bg-[#18202b] w-full max-w-md px-6 py-8"
                    onSubmit={handleSubmit}
                >
                    <div className="flex flex-col justify-center">
                        <h2 className="text-center p-2 font-bold text-3xl md:text-4xl">Sign Up</h2>
                        <CustomizedInput name="name" type="text" label="Full Name" />
                        <CustomizedInput name="email" type="email" label="Email" />
                        <CustomizedInput name="password" type="password" label="Password" />
                        <Button
                            type="submit"
                            className="w-full mt-4 font-semibold text-base rounded-lg bg-[#00fffc] text-black hover:bg-[#00b3b3] hover:text-white transition-all"
                            disabled={loading}
                            sx={{
                                px: 2,
                                py: 1.5,
                                borderRadius: 2,
                                boxShadow: "none",
                                fontWeight: 600,
                                fontSize: { xs: "1rem", md: "1.1rem" },
                                textTransform: "none",
                                ":hover": {
                                    bgcolor: "#00b3b3",
                                    color: "white",
                                },
                            }}
                        >
                            {loading ? "Signing Up..." : "Sign Up"}
                        </Button>
                        <p className="text-center text-slate-400 mt-4">
                            Already have an account?{" "}
                            <a href="/login" className="text-blue-400 hover:underline">Login</a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
