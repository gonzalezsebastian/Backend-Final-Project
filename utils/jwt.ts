import { Request, Response } from "express";
import { hash as a2Hash, verify as a2Verify } from "argon2";
import * as jwt from "jsonwebtoken";
import { login, user } from "../types/user";
import { ExtendedRequest } from "../types/user";

export const hashPassword = async (password: string) => await a2Hash(password);

export const comparePassword = async (
    password: string,
    hash: string
): Promise<boolean> => {
    return await a2Verify(password, hash);
};

export const generateToken = (payload: login) => {
    return jwt.sign(payload, "SECRET" || "", { expiresIn: "1h" });
};

export const verifyToken = (req: ExtendedRequest, res: Response) => {
    if (!req.cookies?.token) {
        return res
            .status(401)
            .json({ message: "Unauthorized. Accept cookies" });
    }

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
};
