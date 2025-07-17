import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Box, Avatar, Button, Typography, IconButton } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import ChatService from "../services/chat-service";
import { red } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
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

    // --- Auth Context ---
    const auth = useAuth();
    const name = auth?.user?.name || "";
    const nameParts = name.split(" ");
    const initials =
        nameParts.length === 1
            ? nameParts[0][0]
            : nameParts[0][0] + nameParts[1][0];
    // --- End of Auth Context ---

    // --- Navigation ---
    const navigate = useNavigate();
    // --- End of Navigation ---

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

    // --- Check User Verification ---
    useEffect(() => {
        if (auth?.user && !auth.user.isVerified) {
            toast.error("Please verify your email before accessing the chat.");
            navigate("/");
        }
    }, [auth, navigate]);
    // --- End of Check User Verification ---


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

    return (
        <Box
            sx={{
                display: 'flex',
                flex: 1,
                width: '100%',
                height: '100%',
                mt: 3,
                gap: 3,
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
                        scrollBehavior: "smooth"
                    }}
                >
                    {messages.map((chat, index) =>
                        <ChatItem content={chat.content} role={chat.role} key={index} />
                    )}
                </Box>
                <div className="w-full p-2.5 rounded-lg bg-[#111b27] flex mr-auto">
                    {" "}
                    <input ref={inputRef} type="text" className="w-full rounded-md bg-transparent p-2.5 border-none outline-none focus:ring-2 focus:ring-white text-white text-xl" onKeyDown={e => {
                        if (e.key === "Enter") {
                            handleSubmit();
                        }
                    }} />
                    <IconButton onClick={handleSubmit} sx={{ ml: "auto", color: "white" }}>
                        <IoMdSend />
                    </IconButton>
                </div>
            </Box>
        </Box>
    );
};

export default Chat;
