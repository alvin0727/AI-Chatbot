import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

interface JWTPayload {
    id: string;
    email: string;
    isVerified: boolean;
}

export const createToken = (id: string, email: string, isVerified: boolean): string => {
    const payload: JWTPayload = {
        id,
        email,
        isVerified
    };

    return jwt.sign(payload, config.JWT_SECRET, {
        expiresIn: "60min" // Default to 60 minutes if not set
    });
};

export const verifyToken = (token: string): JWTPayload | null => {
    try {
        return jwt.verify(token, config.JWT_SECRET) as JWTPayload;
    } catch (error) {
        return null;
    }
};

export const createRefreshToken = (id: string, email: string): string => {
    const payload = {
        id,
        email,
    };

    return jwt.sign(payload, config.JWT_REFRESH_SECRET, {
        expiresIn: "7d" // Default to 7 days if not set
    });
};

export const verifyRefreshToken = (token: string): JWTPayload | null => {
    try {
        return jwt.verify(token, config.JWT_REFRESH_SECRET) as JWTPayload;
    } catch (error) {
        return null;
    }
};
