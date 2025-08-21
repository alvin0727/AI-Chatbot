import { useEffect } from "react";
import { Box, Button } from "@mui/material";
import { IoIosLogIn } from "react-icons/io"
import CustomizedInput from "../components/shared/CustomizedInput";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Login = () => {

    // --- User Auth ---
    const auth = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (auth?.isLoggedIn) {
            navigate("/");
        }
    }, [auth?.isLoggedIn, navigate]);

    // --- End User Auth ---

    // --- Submit ---
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Handle login logic here
        const formData = new FormData(event.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        try {
            toast.loading("Logging in...", { id: "login" });
            if (!email || !password) {
                toast.error("Please fill in all fields", { id: "login" });
                return;
            }
            await auth?.login(email, password);
            toast.success("Login successful", { id: "login" });
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Login failed", { id: "login" });
        }
    };
    // --- END Submit ---

    return (
        <Box
            width="100%"
            height="100%"
            minHeight="100vh"
            display="flex"
            flex={1}
            flexDirection={{ xs: "column", md: "row" }}
            alignItems="center"
            justifyContent="center"
            gap={{ xs: 2, md: 4 }}
            mb={{ xs: 8, md: 4 }}
        >
            <Box
                padding={{ xs: 2, md: 3 }}
                display="flex"
                alignItems="center"
                justifyContent="center"
                flex={1}
                width="100%"
            >
                <img
                    src="login.png"
                    alt="Robot"
                    className="max-w-xs w-full h-auto mx-auto"
                />
            </Box>
            <Box
                display="flex"
                flex={1}
                justifyContent="center"
                alignItems="center"
                padding={{ xs: 2, md: 4 }}
                ml={{ md: "auto", xs: 0 }}
                width="100%"
            >
                <form
                    className="m-auto shadow-lg rounded-lg border-none bg-[#18202b] w-full max-w-md px-6 py-8"
                    onSubmit={handleSubmit}
                >
                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                    }}>
                        <h2 className="text-center p-2 font-bold text-3xl md:text-4xl">Login</h2>
                        <CustomizedInput name="email" type="email" label="Email" />
                        <CustomizedInput name="password" type="password" label="Password" />
                        <Button
                            type="submit"
                            sx={{
                                px: 2,
                                py: 1.5,
                                mt: 2,
                                width: { xs: "100%", md: "400px" },
                                borderRadius: 2,
                                bgcolor: "#00fffc",
                                color: "black",
                                fontWeight: 600,
                                fontSize: { xs: "1rem", md: "1.1rem" },
                                ":hover": {
                                    bgcolor: "#00b3b3",
                                    color: "white",
                                },
                                transition: "all 0.2s",
                            }}
                            endIcon={<IoIosLogIn />}
                        >
                            Login
                        </Button>
                    </Box>
                </form>
            </Box>
        </Box>
    );
};

export default Login;

