// auth.middleware.ts
import { Response, NextFunction } from "express";
import User from "../models/user";
import { CustomReq } from "../controllers/user.controller";

const authMiddleware = async ( req: CustomReq, res: Response, next: NextFunction) => {
    const userId = req.header("Authorization");
    // console.log(userId);

    if (!userId) {
        return res.status(401).json({ error: "Access denied. No user ID provided." });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({ error: "User not found." });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export default authMiddleware;