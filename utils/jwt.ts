import { NextFunction, Request, Response } from "express";
import { compare, genSaltSync, hash } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { login } from "../types/user";

export const hashPassword = async (password: string) => {
    const salt = genSaltSync()
    return await hash(password, salt)
}

export const comparePassword = async (password: string, hash: string):Promise<boolean> => {
    return await compare(password, hash)
}

export const generateToken = (payload: login) => {
    return jwt.sign(payload, process.env.JWT_SECRET ?? '', { expiresIn: '1h' })
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    try{
        if(!req.cookies?.token) return res.status(401).json({ message: 'Unauthorized. Accept cookies' });
        jwt.verify(req.cookies.token, process.env.JWT_SECRET ?? '', (err: unknown, decoded: unknown) => {
            if(err){
                return res.status(401).json({ message: 'Unauthorized. Invalid token' });
            }
            req.user = decoded as login;
        });
        next();
    }catch(err){
        next(err);
    }
}