import { Avatar, Box } from "@mui/material";
import { useAuth } from "../../context/AuthContext";

const ChatItem = ({ content, role }: { content: string, role: "user" | "assistant" }) => {
    const auth = useAuth();
    const name = auth?.user?.name || "";
    const nameParts = name.split(" ");
    const initials =
        nameParts.length === 1
            ? nameParts[0][0]
            : nameParts[0][0] + nameParts[1][0];
    return (

        role === "assistant" ? (
            <Box sx={{ display: "flex", p: 2, bgcolor: "#004d5612", my: 2, gap: 2 }}>
                <Avatar sx={{ ml: 0 }}>
                    <img
                        src="/logo.png"
                        alt="Logo"
                        className="w-8 h-8 inverted"
                    />
                </Avatar>
                <Box>
                    <p className="text-xl">{content}</p>
                </Box>
            </Box>

        ) : (
            <Box sx={{ display: "flex", p: 2, bgcolor: "#004d56", gap: 2 }}>
                <Avatar sx={{ ml: 0, bgcolor: "black", color: "white", fontWeight: 700 }}>
                    {initials}
                </Avatar>
                <Box>
                    <p className="text-xl">{content}</p>
                </Box>
            </Box>
        ));
};

export default ChatItem;