import { useLayoutEffect, useRef, useState } from "react";
import { Box, Avatar, Button, Typography, IconButton, useTheme, useMediaQuery, Alert, Chip } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import ChatService from "../services/chat-service";
import { red, amber, green } from "@mui/material/colors";
import toast from "react-hot-toast";
import { IoMdSend } from "react-icons/io";
import { Warning, Timer, CheckCircle } from "@mui/icons-material";
import ChatItem from "../components/chat/ChatItem";

type ChatMessage = {
    role: "user" | "assistant";
    content: string;
};

type ChatLimitInfo = {
    remainingChats: number;
    dailyLimit: number;
    canChat: boolean;
    resetTime?: string;
};

const Chat = () => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [messages, setChatMessages] = useState<ChatMessage[]>([]);
    const [chatLimit, setChatLimit] = useState<ChatLimitInfo>({
        remainingChats: 4,
        dailyLimit: 4,
        canChat: true
    });
    const [isLoading, setIsLoading] = useState(false);

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

    // --- Load Chat Limit Info ---
    const loadChatLimitInfo = async () => {
        try {
            const limitInfo = await ChatService.getChatLimitInfo();
            setChatLimit(limitInfo);
            return limitInfo;
        } catch (error: any) {
            console.error("Failed to load chat limit info:", error);
            return undefined;
        }
    };

    // --- Handle Submit ---
    const handleSubmit = async () => {
        const content = inputRef.current?.value as string || "";

        if (!content.trim()) {
            toast.error("Please enter a message");
            return;
        }

        if (!chatLimit.canChat || chatLimit.remainingChats <= 0) {
            toast.error("Daily chat limit exceeded. Try again tomorrow!");
            return;
        }

        if (inputRef && inputRef.current) {
            inputRef.current.value = "";
        }

        const newMessage: ChatMessage = {
            role: "user",
            content
        };
        setChatMessages((prevMessages) => [...prevMessages, newMessage]);
        setIsLoading(true);

        try {
            // Send API
            const chatData = await ChatService.sendMessage(content);
            setChatMessages([...chatData.chats]);

            // Update chat limit info
            setChatLimit({
                remainingChats: chatData.remainingChats || 0,
                dailyLimit: chatData.dailyLimit || 4,
                canChat: (chatData.remainingChats || 0) > 0
            });

            toast.success(`Message sent! ${chatData.remainingChats || 0} chats remaining today.`);
        } catch (error: any) {
            // Remove the user message if API call failed
            setChatMessages((prevMessages) => prevMessages.slice(0, -1));

            if (error.response?.status === 429) {
                toast.error("Daily chat limit exceeded!");
                setChatLimit({
                    remainingChats: 0,
                    dailyLimit: 4,
                    canChat: false,
                    resetTime: "24 hours"
                });
            } else {
                toast.error(`Failed to send message: ${error.message}`);
            }
        } finally {
            setIsLoading(false);
        }
    };
    // --- End of Handle Submit ---

    // --- Get Chat Messages ---
    useLayoutEffect(() => {
        if (auth?.isLoggedIn && auth?.user?.isVerified) {
            toast.loading("Loading chat messages...", { id: "loading-chat" });

            Promise.all([
                ChatService.getAllChats(),
                loadChatLimitInfo()
            ]).then(([chatData, limitData]) => {
                setChatMessages([...chatData.chats]);
                setChatLimit({
                    remainingChats: limitData.remainingChats ?? 4,
                    dailyLimit: limitData.dailyLimit ?? 4,
                    canChat: limitData.canChat ?? true
                });
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
            const response = await ChatService.deleteAllChats();
            setChatMessages([]);

            // Update chat limit info after clearing
            setChatLimit({
                remainingChats: response.remainingChats || 4,
                dailyLimit: response.dailyLimit || 4,
                canChat: true
            });

            toast.success("Chat messages cleared successfully.", { id: "clear-chat" });
        } catch (error: any) {
            toast.error(`Failed to clear chat messages: ${error.message}`, { id: "clear-chat" });
        }
    };

    // --- Chat Limit Status Component ---
    const ChatLimitStatus = () => {
        const getStatusColor = () => {
            if (chatLimit.remainingChats === 0) return red[500];
            if (chatLimit.remainingChats <= 1) return amber[500];
            return green[500];
        };

        const getStatusIcon = () => {
            if (chatLimit.remainingChats === 0) return <Warning />;
            if (chatLimit.remainingChats <= 1) return <Timer />;
            return <CheckCircle />;
        };

        return (
            <Box sx={{ mb: 2 }}>
                <Chip
                    icon={getStatusIcon()}
                    label={`${chatLimit.remainingChats}/${chatLimit.dailyLimit} chats remaining today`}
                    size={isXs ? "small" : "medium"}
                    sx={{
                        backgroundColor: `${getStatusColor()}20`,
                        color: getStatusColor(),
                        border: `1px solid ${getStatusColor()}40`,
                        fontWeight: 600
                    }}
                />

                {chatLimit.remainingChats === 0 && (
                    <Alert
                        severity="warning"
                        sx={{
                            mt: 1,
                            backgroundColor: `${amber[500]}20`,
                            color: amber[100],
                            fontSize: isXs ? "0.8rem" : "0.9rem"
                        }}
                    >
                        Daily limit reached. Chat resets in 24 hours.
                    </Alert>
                )}
            </Box>
        );
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

                    {/* Chat Limit Status */}
                    <Box sx={{ mt: 2, textAlign: "center" }}>
                        <ChatLimitStatus />
                    </Box>

                    <Button
                        variant="contained"
                        color="primary"
                        disabled={isLoading}
                        sx={{
                            width: isXs ? "100%" : "200px",
                            mx: "auto",
                            borderRadius: 3,
                            mt: 2,
                            mb: "auto",
                            px: 4,
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                            bgcolor: red[300],
                            fontSize: isXs ? "0.9rem" : "1rem",
                            ":hover": {
                                bgcolor: red.A400,
                            },
                            ":disabled": {
                                bgcolor: red[100],
                                color: red[300]
                            }
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

                {/* Input Section with Limit Warning */}
                <Box sx={{ mt: isXs ? 2 : 4 }}>
                    {/* Show warning when limit is low */}
                    {chatLimit.remainingChats <= 1 && chatLimit.remainingChats > 0 && (
                        <Alert
                            severity="info"
                            sx={{
                                mb: 2,
                                backgroundColor: `${amber[500]}20`,
                                color: amber[100],
                                fontSize: isXs ? "0.8rem" : "0.9rem"
                            }}
                        >
                            Only {chatLimit.remainingChats} chat{chatLimit.remainingChats > 1 ? 's' : ''} remaining today!
                        </Alert>
                    )}

                    <div className={`w-full p-2.5 rounded-lg bg-[#111b27] flex mr-auto ${chatLimit.remainingChats === 0 ? 'opacity-50' : ''}`}>
                        <input
                            ref={inputRef}
                            type="text"
                            disabled={!chatLimit.canChat || chatLimit.remainingChats === 0 || isLoading}
                            className={`w-full rounded-md bg-transparent p-2.5 border-none outline-none focus:ring-2 focus:ring-white text-white ${isXs ? "text-base" : "text-xl"} disabled:cursor-not-allowed disabled:opacity-50`}
                            onKeyDown={e => {
                                if (e.key === "Enter" && !isLoading) {
                                    handleSubmit();
                                }
                            }}
                            placeholder={
                                chatLimit.remainingChats === 0
                                    ? "Daily limit reached. Try again tomorrow!"
                                    : isLoading
                                        ? "Sending message..."
                                        : isXs
                                            ? "Type a message..."
                                            : "Type your message here..."
                            }
                        />
                        <IconButton
                            onClick={handleSubmit}
                            disabled={!chatLimit.canChat || chatLimit.remainingChats === 0 || isLoading}
                            sx={{
                                ml: "auto",
                                color: chatLimit.remainingChats === 0 ? "gray" : "white",
                                fontSize: isXs ? 20 : 28,
                                ":disabled": {
                                    color: "gray"
                                }
                            }}
                        >
                            <IoMdSend />
                        </IconButton>
                    </div>

                    {/* Chat limit info below input */}
                    <Box sx={{ mt: 1, textAlign: "center" }}>
                        <Typography
                            variant="caption"
                            sx={{
                                color: chatLimit.remainingChats === 0 ? red[300] : "gray",
                                fontSize: isXs ? "0.7rem" : "0.8rem"
                            }}
                        >
                            {chatLimit.remainingChats}/{chatLimit.dailyLimit} daily messages used
                            {chatLimit.remainingChats === 0 && " • Resets in 24 hours"}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Chat;