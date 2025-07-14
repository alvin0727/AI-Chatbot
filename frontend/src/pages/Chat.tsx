import React from "react";
import { Box, Avatar, Button, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { red } from "@mui/material/colors";

const Chat = () => {
    const auth = useAuth();
    const name = auth?.user?.name || "";
    const nameParts = name.split(" ");
    const initials =
        nameParts.length === 1
            ? nameParts[0][0]
            : nameParts[0][0] + nameParts[1][0];
    return (
        <Box
            sx={{
                display: 'flex',
                flex: 1,
                width: '100%',
                height: '100%',
                mt: 3,
                gap3: 3,
            }}
        >
            <Box sx={{ display: { md: "flex", xs: "none", sm: "none" }, flex: 0.2, flexDirection: "column" }}>
                <Box
                    sx={{
                        display: "flex",
                        width: "100%",
                        height: "60vh",
                        bgcolor: "rgb(17, 29, 39)",
                        borderRadius: 5,
                        flexDirection: "column",
                        mx: 3,
                    }}>
                    <Avatar sx={{ mx: "auto", my: 2, bgcolor: "white", color: "black", fontWeight: 700 }}>
                        {initials}
                    </Avatar>
                    <p className="text-white font-semibold text-lg text-center m-0">
                        You are talking to a ChatBot
                    </p>
                    <p className="text-slate-200 mt-4 px-6 text-center text-base">
                        You can ask some questions related to knowledge, business, technology, education, etc. But avoid sharing any personal information.
                    </p>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{
                            width: "200px",
                            mx: "auto",
                            borderRadius: 3,
                            my: "auto",
                            px: 4,
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                            bgcolor: red[300],
                            ":hover": {
                                bgcolor: red.A400,
                            },
                        }}
                        onClick={() => alert("Button clicked!")}
                    >
                        Clear Conversation
                    </Button>
                </Box>
            </Box>
            <Box sx={{ display: "flex", flex: { md: 0.8, xs: 1, sm: 1 }, flexDirection: 'column', px: 3 }}>
                <Typography sx={{ fontSize: "40px", color: "white", fontWeight: "bold", mb: 2, mx: "auto" }}>
                    Model-GPT 3.5 Turbo
                </Typography>
                <Box
                    sx={{
                        width: "100%",
                        height: "60vh",
                        borderRadius: 3,
                        mx: 'auto',
                        display: "flex",
                        flexDirection: "column",
                        overflowX: "hidden",
                        overflowY: "auto",
                        scrollBehavior: "smooth",
                        bgcolor: "white",
                        color: "black",
                    }}
                >
                    {/* Example content to enable scrolling */}
                    {[...Array(30)].map((_, i) => (
                        <div key={i}>Line ke-{i + 1}</div>
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default Chat;
