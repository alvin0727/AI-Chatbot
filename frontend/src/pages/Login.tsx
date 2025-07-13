import React from "react";
import { Box, Button } from "@mui/material";
import { IoIosLogIn } from "react-icons/io"
import CustomizedInput from "../components/shared/CustomizedInput";

const Login = () => {
    return (
        <Box width={"100%"} height={"100%"} display={"flex"} flex={1}>
            <Box padding={3} mt={8} display={{ md: "flex", xs: "none", sm: "none" }}>
                <img src="login.png" alt="Robot" className="w-100" />
            </Box>
            <Box
                display={"flex"}
                flex={{ xs: 1, md: 0.5 }}
                justifyContent={"center"}
                alignItems={"center"}
                padding={2}
                ml={"auto"}
                mt={16}
            >
                <form className="m-auto p-7.5 shadow-lg rounded-lg border-none">
                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                    }}>
                        <h2 className="text-center p-2 font-bold text-4xl">Login</h2>
                        <CustomizedInput name="email" type="email" label="Email" />
                        <CustomizedInput name="password" type="password" label="Password" />
                        <Button type="submit"
                            sx={{
                                px: 2,
                                py: 1,
                                mt: 2,
                                width: "400px",
                                borderRadius: 2,
                                bgcolor: "#00fffc",
                                color: "black",
                                ":hover": {
                                    bgcolor: "#00b3b3",
                                    color: "white",
                                },
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
