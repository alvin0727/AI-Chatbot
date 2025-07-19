import { TextField, IconButton, InputAdornment, useTheme, useMediaQuery } from "@mui/material";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

type Props = {
    name: string;
    type: string;
    label: string;
};

const CustomizedInput = (prop: Props) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = prop.type === "password";
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down('sm'));
    const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'));

    return (
        <TextField
            margin="normal"
            InputLabelProps={{ style: { color: "white" } }}
            name={prop.name}
            type={isPassword && showPassword ? "text" : prop.type}
            label={prop.label}
            InputProps={{
                style: {
                    width: isXs ? "100%" : isSm ? "300px" : "400px",
                    borderRadius: 10,
                    fontSize: isXs ? 16 : isSm ? 18 : 20,
                    color: "white",
                    background: "transparent"
                },
                endAdornment: isPassword ? (
                    <InputAdornment position="end">
                        <IconButton
                            onClick={() => setShowPassword((show) => !show)}
                            edge="end"
                            sx={{ color: "white" }}
                        >
                            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                        </IconButton>
                    </InputAdornment>
                ) : null,
            }}
            sx={{
                "& .MuiOutlinedInput-root": {
                    background: "transparent",
                    "& input": {
                        background: "transparent",
                        fontSize: isXs ? 16 : isSm ? 18 : 20,
                    },
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
                "& .MuiInputLabel-root": {
                    color: "white",
                    fontSize: isXs ? 16 : isSm ? 18 : 20,
                },
            }}
        />
    );
};
export default CustomizedInput;