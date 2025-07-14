import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/token-manager.js";

export async function authenticate(req: Request, res: Response, next: NextFunction) {
    const token = req.signedCookies?.authToken;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const payload = await verifyToken(token);
    if (!payload) return res.status(401).json({ message: "Invalid token" });

    (req as any).user = payload;
    next();
}

export function requireVerified(req: Request, res: Response, next: NextFunction) {
    const user = (req as any).user;
    if (!user?.isVerified) {
        return res.status(403).json({ message: "Email not verified" });
    }
    next();
}