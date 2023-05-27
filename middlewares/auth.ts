import { Response, NextFunction } from "express";
import { ExtendedRequest } from "../types/user";

export const isLogged = (
    req: ExtendedRequest,
    res: Response,
    next: NextFunction
) => {
    if (req.user) {
        next();
    } else {
        res.status(401).json({ message: "unauthorized" });
    }
};
