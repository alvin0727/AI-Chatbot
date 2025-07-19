import { useLayoutEffect, useRef, useState } from "react";
import { Box, Avatar, Button, Typography, IconButton, useTheme, useMediaQuery } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import ChatService from "../services/chat-service";
import { red } from "@mui/material/colors";
import toast from "react-hot-toast";
import { IoMdSend } from "react-icons/io";
import ChatItem from "../components/chat/ChatItem";


type ChatMessage = {
    role: "user" | "assistant";
    content: string;
};
const Chat = () => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [messages, setChatMessages] = useState<ChatMessage[]>([]);
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down('sm'));
    const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

    // --- Auth Context ---
    const auth = useAuth();
    const name = auth?.user?.name || "";
    const nameParts = name.split(" ");
    const initials =
        nameParts.length === 1
            ? nameParts[0][0]
            : nameParts[0][0] + nameParts[1][0];
    // --- End of Auth Context ---

    // --- Handle Submit ---
    const handleSubmit = async () => {
        const content = inputRef.current?.value as string || ""
        if (inputRef && inputRef.current) {
            inputRef.current.value = "";
        }
        const newMessage: ChatMessage = {
            role: "user",
            content
        };
        setChatMessages((prevMessages) => [...prevMessages, newMessage]);

        // Send API
        const chatData = await ChatService.sendMessage(content);
        setChatMessages([...chatData.chats])
    };
    // --- End of Handle Submit ---

    // --- Get Chat Messages ---
    useLayoutEffect(() => {
        if (auth?.isLoggedIn && auth?.user?.isVerified) {
            toast.loading("Loading chat messages...", { id: "loading-chat" });
            ChatService.getAllChats().then((data) => {
                setChatMessages([...data.chats]);
                toast.success("Chat messages loaded successfully.", { id: "loading-chat" });
            }).catch((error) => {
                toast.error(`Failed to load chat messages: ${error.message}`, { id: "loading-chat" });
            });
        }
    }, [auth?.isLoggedIn, auth?.user?.isVerified]);
    // --- End Get Chat Message

    // --- Clear Chat Messages ---
    const clearChatMessages = async () => {
        try {
            await ChatService.deleteAllChats();
            setChatMessages([]);
            toast.success("Chat messages cleared successfully.", { id: "clear-chat" });
        } catch (error: any) {
            toast.error(`Failed to clear chat messages: ${error.message}`, { id: "clear-chat" });
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flex: 1,
                width: '100%',
                height: '100%',
                mt: isXs ? 1 : 3,
                gap: isXs ? 1 : 3,
                flexDirection: { xs: "column", md: "row" },
            }}
        >
            <Box sx={{
                display: "flex", // <-- always flex, never hide
                flex: { md: 0.2, xs: "unset", sm: "unset" },
                flexDirection: "column",
                width: { xs: "100%", md: "auto" },
                mb: { xs: 2, md: 0 },
                px: { xs: 0, md: 0 },
            }}>
                <Box
                    sx={{
                        display: "flex",
                        width: "100%",
                        height: isMdUp ? "60vh" : "auto",
                        bgcolor: "rgb(17, 29, 39)",
                        borderRadius: 5,
                        flexDirection: "column",
                        mx: { xs: 0, md: 3 },
                        p: isXs ? 1 : 2,
                    }}>
                    <Avatar sx={{
                        mx: "auto",
                        my: isXs ? 1 : 2,
                        bgcolor: "white",
                        color: "black",
                        fontWeight: 700,
                        width: isXs ? 40 : 56,
                        height: isXs ? 40 : 56,
                        fontSize: isXs ? 20 : 28,
                    }}>
                        {initials}
                    </Avatar>
                    <p className={`text-white font-semibold text-center m-0 ${isXs ? "text-base" : "text-lg"}`}>
                        You are talking to a ChatBot
                    </p>
                    <p className={`text-slate-200 mt-4 px-2 text-center ${isXs ? "text-sm" : "text-base"}`}>
                        You can ask some questions related to knowledge, business, technology, education, etc. But avoid sharing any personal information.
                    </p>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{
                            width: isXs ? "100%" : "200px",
                            mx: "auto",
                            borderRadius: 3,
                            my: "auto",
                            px: 4,
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                            bgcolor: red[300],
                            fontSize: isXs ? "0.9rem" : "1rem",
                            ":hover": {
                                bgcolor: red.A400,
                            },
                        }}
                        onClick={() => clearChatMessages()}
                    >
                        Clear Conversation
                    </Button>
                </Box>
            </Box>
            <Box sx={{
                display: "flex",
                flex: { md: 0.8, xs: 1, sm: 1 },
                flexDirection: 'column',
                px: isXs ? 1 : 3,
                width: "100%"
            }}>
                <Typography
                    sx={{
                        fontSize: isXs ? "1.5rem" : isSm ? "2.2rem" : "2.5rem",
                        color: "white",
                        fontWeight: "bold",
                        mb: isXs ? 1 : 2,
                        mx: "auto",
                        textAlign: "center"
                    }}
                >
                    Model-GPT 3.5 Turbo
                </Typography>
                <Box
                    sx={{
                        width: "100%",
                        height: isXs ? "40vh" : "60vh",
                        borderRadius: 3,
                        mx: 'auto',
                        display: "flex",
                        flexDirection: "column",
                        overflowX: "hidden",
                        overflowY: "auto",
                        scrollBehavior: "smooth",
                        p: isXs ? 1 : 2,
                    }}
                >
                    {messages.map((chat, index) =>
                        <ChatItem content={chat.content} role={chat.role} key={index} />
                    )}
                </Box>
                <div className={`w-full p-2.5 rounded-lg bg-[#111b27] flex mr-auto ${isXs ? "mt-2" : "mt-4"}`}>
                    <input
                        ref={inputRef}
                        type="text"
                        className={`w-full rounded-md bg-transparent p-2.5 border-none outline-none focus:ring-2 focus:ring-white text-white ${isXs ? "text-base" : "text-xl"}`}
                        onKeyDown={e => {
                            if (e.key === "Enter") {
                                handleSubmit();
                            }
                        }}
                        placeholder={isXs ? "Type a message..." : "Type your message here..."}
                    />
                    <IconButton onClick={handleSubmit} sx={{ ml: "auto", color: "white", fontSize: isXs ? 20 : 28 }}>
                        <IoMdSend />
                    </IconButton>
                </div>
            </Box>
        </Box>
    );
};

export default Chat;
