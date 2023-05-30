import User from "../models/user.model";
import { Request, Response, NextFunction } from "express";
import { hashPassword, comparePassword, generateToken } from "../utils/jwt";
import { login, ExtendedRequest, updateUserType } from "../types/user";

export const createUser = async (req: Request, res: Response) => {
    try {
        const { first_name, second_name, email, password, phone, address } =
            req.body;

        const hashedPassword = await hashPassword(password);

        const user = await User.create({
            first_name: first_name,
            second_name: second_name,
            email: email,
            password: hashedPassword,
            phone: phone,
            address: address,
        });

        return res.status(201).json({ message: "User created", data: user });
    } catch (err) {
        return res.status(500).json({ message: "User not created", err });
    }
};

export const userLogin = async (req: Request, res: Response) => {
    const { email, password }: login = req.body;
    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await comparePassword(password, user!.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

        const token = generateToken({
            email: user!.email,
            password: user!.password,
        });

        return res
            .cookie("token", token, {
                httpOnly: false,
                sameSite: "none",
                secure: true,
            })
            .status(200)
            .json({ message: "User logged in successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Server error", err });
    }
};

export const getUserByID = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const user = await User.findOne({ _id: id, isDeleted: false });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "User found", data: user });
    } catch (err) {
        return res.status(500).json({ message: "Server error", err });
    }
};

export const getToken = async (req: ExtendedRequest, res: Response) => {
    const { email, password }: login = req.body;
    let token = null;
    try {
        token = generateToken({
            email: email,
            password: password,
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", err });
    }
    return res.status(200).json({ message: "Token generated", token: token });
};

export const updateUser = async (req: ExtendedRequest, res: Response) => {
    const { id } = req.params;
    try {
        const user = await User.findOne({ _id: id, isDeleted: false });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (req.user?.email !== user.email) {
            return res.status(404).json({
                message: "You are not authorized to perform this action",
            });
        }
        try {
            await User.updateOne({ _id: id }, req.body, {
                new: true,
            });
        } catch (err) {
            return res.status(500).json({ message: "Error updating", err });
        }
        return res.status(200).json({ message: "User updated successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Server error", err });
    }
};

export const deleteUser = async (req: ExtendedRequest, res: Response) => {
    const { id } = req.params;

    try {
        const user = await User.findOne({ _id: id, isDeleted: false });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        if (req.user?.email !== user.email) {
            return res.status(403).json({
                message: "You are not authorized to perform this action",
            });
        }
        await User.updateOne({ _id: id, isDeleted: false });
        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", err });
    }
};

export default {
    createUser,
    userLogin,
    getUserByID,
    getToken,
    updateUser,
    deleteUser,
};
