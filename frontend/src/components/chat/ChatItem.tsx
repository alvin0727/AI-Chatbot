import { Avatar, Box, Typography } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import ReactMarkdown from "react-markdown";
import rehypePrism from "rehype-prism-plus";
import "prismjs/themes/prism-tomorrow.css";

const ChatItem = ({ content, role }: { content: string; role: "user" | "assistant" }) => {
    const auth = useAuth();
    const name = auth?.user?.name || "";
    const nameParts = name.split(" ");
    const initials =
        nameParts.length === 1 ? nameParts[0][0] : nameParts[0][0] + nameParts[1][0];

    return (
        <Box
            sx={{
                display: "flex",
                p: 2,
                bgcolor: role === "assistant" ? "#004d5612" : "#004d56",
                my: 2,
                gap: 2,
            }}
        >
            <Avatar
                sx={{
                    ml: 0,
                    bgcolor: role === "user" ? "black" : undefined,
                    color: role === "user" ? "white" : undefined,
                    fontWeight: 700,
                }}
                src={role === "assistant" ? "/logo.png" : undefined}
                alt={role === "assistant" ? "Logo" : undefined}
            >
                {role === "user" && initials}
            </Avatar>
            <Box sx={{ "& pre": { m: 0, fontSize: "16px" }, fontSize: "20px" }}>
                <ReactMarkdown
                    rehypePlugins={[rehypePrism]}
                    components={{
                        p: ({ node, ...props }) => <Typography sx={{ whiteSpace: "pre-wrap" }} {...props} />,
                    }}
                >
                    {content}
                </ReactMarkdown>
            </Box>
        </Box>
    );
};

export default ChatItem;
