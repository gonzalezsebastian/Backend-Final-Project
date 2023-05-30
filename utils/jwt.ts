import { NextFunction, Request, Response } from "express";
import { hash as a2Hash, verify as a2Verify } from "argon2";
import * as jwt from "jsonwebtoken";
import { login, user } from "../types/user";
import { ExtendedRequest } from "../types/user";

export const hashPassword = async (password: string) => await a2Hash(password);

export const comparePassword = async (
    password: string,
    hash: string
): Promise<boolean> => {
    return await a2Verify(hash, password);
};

export const generateToken = (payload: {
    email: string;
    password: string;
}) => {
    return jwt.sign(payload, process.env.JWT_SECRET || "", { expiresIn: "1h" });
};

export const verifyToken = (
    req: ExtendedRequest,
    res: Response,
    next: NextFunction
) => {
    if (!req.cookies?.token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        jwt.verify(
            req.cookies.token,
            process.env.JWT_SECRET || "",
            (err: unknown, decoded: unknown) => {
                if (err) {
                    return res
                        .status(401)
                        .json({ message: "Unauthorized. Invalid token" });
                }
                req.user = decoded as user;
            }
        );
        next();
    } catch (err) {
        return res.status(500).json({ message: "Server error", err });
    }
};
