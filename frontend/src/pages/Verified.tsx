import { useState } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import * as AuthServices from "../services/auth-service";
import toast from "react-hot-toast";
import { IoMailOutline } from "react-icons/io5";
import { IoCheckmarkCircle } from "react-icons/io5";
import { IoCloseCircle } from "react-icons/io5";

const Verified = () => {
    const auth = useAuth();
    const email = auth?.user?.email || "";
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

    const handleResend = async () => {
        if (!email) {
            toast.error("Email not found.");
            setStatus("error");
            return;
        }
        setLoading(true);
        setStatus("idle");
        try {
            await AuthServices.resendVerificationEmailService(email);
            toast.success("Verification link sent. Please check your email.");
            setStatus("success");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to resend verification link.");
            setStatus("error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box minHeight="100vh" display="flex" flexDirection="column" alignItems="center" justifyContent="center" bgcolor="#111827">
            <Box
                sx={{
                    background: "rgba(24,32,43,0.85)",
                    borderRadius: 4,
                    boxShadow: 3,
                    px: 4,
                    py: 6,
                    maxWidth: 400,
                    width: "100%",
                    textAlign: "center"
                }}
            >
                <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
                    <IoMailOutline size={48} color="#1976d2" />
                </Box>
                <Typography variant="h5" color="white" fontWeight="bold" mb={2}>
                    Email Verification Required
                </Typography>
                <Typography color="white" mb={3}>
                    Please verify your email address to continue.<br />
                    {email && (
                        <span style={{ color: "#90caf9", fontWeight: "bold" }}>{email}</span>
                    )}
                    <br />
                    If you haven't received the verification email, click the button below to resend the link.
                </Typography>
                {status === "success" && (
                    <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
                        <IoCheckmarkCircle size={24} color="#4caf50" style={{ marginRight: 8 }} />
                        <Typography color="#4caf50">Verification link sent!</Typography>
                    </Box>
                )}
                {status === "error" && (
                    <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
                        <IoCloseCircle size={24} color="#f44336" style={{ marginRight: 8 }} />
                        <Typography color="#f44336">Failed to send verification link.</Typography>
                    </Box>
                )}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleResend}
                    disabled={loading}
                    sx={{
                        fontWeight: "bold",
                        minWidth: 220,
                        bgcolor: "#1976d2",
                        color: "#fff",
                        "&:hover": { bgcolor: "#1565c0" },
                        mb: 2
                    }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Resend Verification Link"}
                </Button>
            </Box>
        </Box>
    );
};

export default Verified;