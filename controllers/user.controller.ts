import User from "../models/user.model";
import { Request, Response, NextFunction } from "express";
import { hashPassword, comparePassword, generateToken } from "../utils/jwt";
import { login, ExtendedRequest, updateUserType } from "../types/user";

const createUser = async (req: Request, res: Response) => {
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

        res.status(201).json({ message: "User created", data: user });
    } catch (err) {
        res.send(500).json({ message: "Server error", err });
    }
};

const userLogin = async (req: Request, res: Response) => {
    const { email, password }: login = req.body;
    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            res.send(500).json({ message: "User not found", statusCode: 404 });
        }

        const isPasswordValid = await comparePassword(password, user!.password);
        if (!isPasswordValid) {
            res.send(500).json({
                message: "Invalid credentials",
                statusCode: 401,
            });
        }

        const token = generateToken({
            email: user!.email,
            password: user!.password,
        });

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
        })
            .status(200)
            .json({ message: "User logged in successfully" });
    } catch (err) {
        res.send(500).json({ message: "Server error", err });
    }
};

const getUserByID = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        const user = await User.findOne({ _id: id }, { password: 0 });

        if (!user) {
            return res.send(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User found", data: user });
    } catch (err) {
        res.send(500).json({ message: "Server error", err });
    }
};

const getToken = async (req: ExtendedRequest, res: Response) => {
    const { email, password }: login = req.body;
    let token = null;
    try {
        token = generateToken({
            email: email,
            password: password,
        });
    } catch (err) {
        res.send(500).json({ message: "Server error", err });
    }
    res.send(200).json({ message: "Token generated", token: token });
};

const updateUser = async (req: ExtendedRequest, res: Response) => {
    const { id } = req.params;
    const {
        first_name,
        second_name,
        email,
        password,
        phone,
        address,
    }: updateUserType = req.body;

    try {
        const user = await User.findOne({ _id: id, isDeleted: false });

        if (!user) {
            return res
                .status(404)
                .json({ message: "User not found", statusCode: 404 });
        }

        if (req.user?.email !== user.email) {
            return res.status(404).json({
                message: "You are not authorized to perform this action",
            });
        }

        await User.updateOne(
            { _id: id },
            {
                first_name: first_name,
                second_name: second_name,
                email: email,
                password: password,
                phone: phone,
                address: address,
            },
            { new: true }
        );
        res.status(200).json({ message: "User updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", err });
    }
};

const deleteUser = async (
    req: ExtendedRequest,
    res: Response,
    next: NextFunction
) => {
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
        await User.updateOne({ _id: id }, { isDeleted: true });
        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", err });
    }
};

export default {
    createUser,
    userLogin,
    getUserByID,
    updateUser,
    deleteUser,
    getToken,
};
