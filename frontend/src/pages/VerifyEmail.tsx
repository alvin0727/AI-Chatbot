import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import * as AuthServices from "../services/auth-service";
import toast from "react-hot-toast";
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import { IoCheckmarkCircleOutline, IoCloseCircleOutline } from "react-icons/io5";

const VerifyEmailPage = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get("token");
        if (token) {
            AuthServices.verifyEmailService(token)
                .then(() => {
                    setStatus("success");
                    toast.success("Email verified successfully!");
                    setTimeout(() => navigate("/login"), 2000); // Redirect to login after 2s
                })
                .catch(() => {
                    setStatus("error");
                    toast.error("Verification failed or token expired.");
                });
        } else {
            setStatus("error");
            toast.error("Invalid verification link.");
        }
    }, [searchParams, navigate]);

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
                {status === "loading" && (
                    <>
                        <CircularProgress color="primary" sx={{ mb: 2 }} />
                        <Typography color="white" mb={2}>Verifying your email...</Typography>
                    </>
                )}
                {status === "success" && (
                    <>
                        <IoCheckmarkCircleOutline size={48} color="#4caf50" style={{ marginBottom: 16 }} />
                        <Typography variant="h5" color="white" fontWeight="bold" mb={2}>
                            Email Verified!
                        </Typography>
                        <Typography color="white" mb={3}>
                            Your email has been successfully verified. Redirecting to login...
                        </Typography>
                        <Button variant="contained" color="primary" component={Link} to="/login">
                            Go to Login
                        </Button>
                    </>
                )}
                {status === "error" && (
                    <>
                        <IoCloseCircleOutline size={48} color="#f44336" style={{ marginBottom: 16 }} />
                        <Typography variant="h5" color="white" fontWeight="bold" mb={2}>
                            Verification Failed
                        </Typography>
                        <Typography color="white" mb={3}>
                            The verification link is invalid or has expired.
                        </Typography>
                        <Button variant="contained" color="primary" component={Link} to="/">
                            Back to Home
                        </Button>
                    </>
                )}
            </Box>
        </Box>
    );
};
export default VerifyEmailPage;