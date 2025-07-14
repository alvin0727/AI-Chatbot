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

export const verifyToken = async (token: string): Promise<JWTPayload | null> => {
    return new Promise((resolve) => {
        jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
            if (err) return resolve(null);
            resolve(decoded as JWTPayload);
        });
    });
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
export const verifyRefreshToken = async (token: string): Promise<JWTPayload | null> => {
    return new Promise((resolve) => {
        jwt.verify(token, config.JWT_REFRESH_SECRET, (err, decoded) => {
            if (err) return resolve(null);
            resolve(decoded as JWTPayload);
        });
    });
};