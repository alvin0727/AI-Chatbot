import React, { useRef, useState, useEffect } from "react";
import { Box, TextField, Typography, Button } from "@mui/material";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import * as AuthServices from "../services/auth-service";

const RESEND_COOLDOWN = 60; // seconds

const OTP = () => {
    const [otp, setOtp] = useState(Array(6).fill(""));
    const inputs = useRef<Array<HTMLInputElement | null>>([]);
    const [otpError, setOtpError] = useState<string | null>(null);
    const auth = useAuth();
    const email = auth?.user?.email || "";
    const navigate = useNavigate();
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (cooldown > 0) {
            timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [cooldown]);

    useEffect(() => {
        if (!auth?.user?.email) {
            navigate("/login", { replace: true });
        }
    }, [auth, navigate]);

    const handleChange = (value: string, idx: number) => {
        if (!/^[0-9]?$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[idx] = value;
        setOtp(newOtp);

        if (value && idx < 5) {
            inputs.current[idx + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<Element>, idx: number) => {
        if (e.key === "Backspace" && !otp[idx] && idx > 0) {
            inputs.current[idx - 1]?.focus();
        }
    };

    const handleResend = async () => {
        // TODO: Call resend OTP API here
        try {
            await AuthServices.resendLoginOTPService(email);
            toast.success("OTP resent successfully", { id: "otp-resend" });
            setCooldown(RESEND_COOLDOWN);
        } catch (error: any) {
            const msg = error?.response?.message || "Failed to resend OTP";
            toast.error(msg, { id: "otp-resend" });
            return;
        }
    };

    const handleSubmit = async () => {
        const code = otp.join("");
        // TODO: Submit OTP code
        try {
            toast.loading("Verifying OTP...", { id: "otp-verification" });
            if (!code || code.length !== 6) {
                toast.error("Please enter a valid 6-digit OTP", { id: "otp-verification" });
                return;
            }
            await auth?.verifyToken(email, code);
            toast.success("OTP verified successfully", { id: "otp-verification" });
            // Redirect or perform next steps after successful verification
            navigate("/");
        } catch (error: any) {
            const msg = error?.response?.data?.message || "OTP verification failed";
            const left = error?.response?.data?.attemptsLeft;
            setOtpError(msg);
            toast.error(msg, { id: "otp-verification" });

            // Redirect if attempts are exceeded
            if (typeof left === "number" && left < 1) {
                toast.error("Attempts exceeded. Please login again.", { id: "otp-verification" });
                setTimeout(() => navigate("/login"), 1500);
            }
        }
    };

    return (
        <Box minHeight="100vh" display="flex" flexDirection="column" alignItems="center" justifyContent="center" bgcolor="#111827">
            <Typography variant="h5" color="white" mb={4} fontWeight="bold">
                Input OTP Code
            </Typography>
            <Box display="flex" gap={2}>
                {otp.map((digit, idx) => (
                    <TextField
                        key={idx}
                        inputRef={el => (inputs.current[idx] = el)}
                        type="text"
                        inputProps={{
                            maxLength: 1,
                            style: {
                                textAlign: "center",
                                fontSize: 24,
                                color: "white",
                                width: 40,
                                background: "transparent",
                            },
                        }}
                        value={digit}
                        onChange={e => handleChange(e.target.value, idx)}
                        onKeyDown={e => handleKeyDown(e, idx)}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                background: "transparent",
                                color: "white",
                                borderRadius: 2,
                                "& fieldset": {
                                    borderColor: "rgba(255,255,255,0.5)",
                                },
                                "&:hover fieldset": {
                                    borderColor: "white",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "white",
                                },
                            },
                            input: { color: "white" },
                            width: 48,
                        }}
                        autoFocus={idx === 0}
                    />
                ))}
            </Box>
            <Box mt={3} display="flex" flexDirection="column" alignItems="center" gap={2}>
                <Button
                    variant="contained"
                    sx={{
                        minWidth: 120,
                        background: "#00fffc",
                        color: "#111827",
                        fontWeight: "bold",
                        "&:hover": {
                            background: "#1de9b6",
                        },
                        "&.Mui-disabled": {
                            background: "#00fffc",
                            color: "#111827",
                            opacity: 0.6,
                        },
                    }}
                    onClick={handleSubmit}
                    disabled={otp.some(d => d === "")}
                >
                    Submit
                </Button>
                <Button
                    variant="text"
                    sx={{
                        color: "#00fffc",
                        fontWeight: "bold",
                        "&:hover": {
                            color: "#1de9b6",
                        },
                        "&.Mui-disabled": {
                            color: "#00fffc",
                            opacity: 0.6,
                        },
                    }}
                    onClick={handleResend}
                    disabled={cooldown > 0}
                >
                    {cooldown > 0 ? `Re-send in ${cooldown}s` : "Resend OTP"}
                </Button>
                {otpError && (
                    <Typography color="error" mt={2} fontWeight="bold">
                        {otpError}
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default OTP;