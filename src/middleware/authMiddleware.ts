import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user";
import { CustomReq } from "../controllers/user.controller";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

const authMiddleware = async (
    req: CustomReq,
    res: Response,
    next: NextFunction
) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    console.log(JWT_SECRET);
    console.log(token);

    if (!token) {
        console.log("!token");
        return res
            .status(401)
            .json({ error: "Access denied. No token provided." });
    }

    try {
        console.log("Intento del decoded");
        const decoded: any = jwt.verify(token, JWT_SECRET);
        console.log(decoded);
        req.user = await User.findById(decoded.id);
        next();
    } catch (ex) {
        console.log(ex);
        res.status(400).json({ error: `${ex}` });
    }
};

export default authMiddleware;
