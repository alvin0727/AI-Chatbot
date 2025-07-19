import { Avatar, Box, Typography, useTheme, useMediaQuery } from "@mui/material";
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

    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down('sm'));
    const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    return (
        <Box
            sx={{
                display: "flex",
                p: isXs ? 1 : isSm ? 1.5 : 2,
                bgcolor: role === "assistant" ? "#004d5612" : "#004d56",
                my: isXs ? 1 : 2,
                gap: isXs ? 1 : 2,
                borderRadius: 2,
                maxWidth: "100vw",
                overflowX: "unset", // remove horizontal scroll
                boxSizing: "border-box",
            }}
        >
            <Avatar
                sx={{
                    ml: 0,
                    bgcolor: role === "user" ? "black" : undefined,
                    color: role === "user" ? "white" : undefined,
                    fontWeight: 700,
                    width: isXs ? 32 : 40,
                    height: isXs ? 32 : 40,
                    fontSize: isXs ? 16 : 20,
                    flexShrink: 0,
                }}
                src={role === "assistant" ? "/logo.png" : undefined}
                alt={role === "assistant" ? "Logo" : undefined}
            >
                {role === "user" && initials}
            </Avatar>
            <Box sx={{
                "& pre": { m: 0, fontSize: isXs ? "12px" : isSm ? "14px" : "16px" },
                fontSize: isXs ? "14px" : isSm ? "16px" : "20px",
                wordBreak: "break-word",
                overflowWrap: "break-word",
                minWidth: 0,
                flex: 1,
                maxWidth: "100%",
            }}>
                <ReactMarkdown
                    rehypePlugins={[rehypePrism]}
                    components={{
                        p: ({ node, ...props }) => (
                            <Typography
                                sx={{
                                    whiteSpace: "pre-wrap",
                                    fontSize: isXs ? "14px" : isSm ? "16px" : "20px"
                                }}
                                {...props}
                            />
                        ),
                    }}
                >
                    {content}
                </ReactMarkdown>
            </Box>
        </Box>
    );
};

export default ChatItem;
