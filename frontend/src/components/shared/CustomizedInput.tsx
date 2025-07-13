import { TextField, IconButton, InputAdornment } from "@mui/material";
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

    return (
        <TextField
            margin="normal"
            InputLabelProps={{ style: { color: "white" } }}
            name={prop.name}
            type={isPassword && showPassword ? "text" : prop.type}
            label={prop.label}
            InputProps={{
                style: {
                    width: "400px",
                    borderRadius: 10,
                    fontSize: 20,
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
                },
            }}
        />
    );
};
export default CustomizedInput;