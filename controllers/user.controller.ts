import User from '../models/user.model';
import { Request, Response, NextFunction } from 'express';
import { hashPassword, comparePassword, generateToken } from '../utils/jwt';
import { login, user, updateUserType } from '../types/user';
import mongoose from 'mongoose';

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { first_name, second_name, email, password, phone, address } = req.body;

        const hashedPassword = await hashPassword(password);

        const user = await User.create({
            first_name: first_name,
            second_name: second_name,
            email: email,
            password: hashedPassword,
            phone: phone,
            address: address
        });

        res.status(201).json(user);

    }catch(err){
        next(err);
    }
};

export const userLogin = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { email, password }: login = req.body;
        const user = await User.findOne({ email: email, isDeleted: false});

        if(!user){
            return next({ message: 'User not found', statusCode: 404 });
        }

        const isPasswordValid = await comparePassword(password, user.password);
        if(!isPasswordValid){
            return next({ message: 'Invalid credentials', statusCode: 401 });
        }

        const token = generateToken({
            email: user.email,
            password: user.password
        });

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'none',
            secure: true
        }).status(200).json({ message: 'User logged in successfully' });

    }catch(err){
        next(err);
    }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try{
        const user = await User.findOne({ _id: id, isDeleted: false }, { password: 0 });

        if(!user){
            return next({ message: 'User not found', statusCode: 404 });
        }

        res.status(200).json(user);

    }catch(err){
        next(err);
    }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { first_name, second_name, email, password, phone, address }:updateUserType = req.body;

    try{
        const user = await User.findOne({ _id: id, isDeleted: false });

        if(!user){
            return next({ message: 'User not found', statusCode: 404 });
        }

        if(req.user?.email !== user.email){
            return next({ message: 'You are not authorized to perform this action', statusCode: 401 });
        }

        await User.updateOne({ _id: id, isDeleted: false}, {
            first_name: first_name,
            second_name: second_name,
            email: email,
            password: password,
            phone: phone,
            address: address,
        },
            {new : true}
        );
        res.status(200).json({ message: 'User updated successfully' });

    }catch(err){
        next(err);
    }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    
    try{
        const user = await User.findOne({ _id: id, isDeleted: false });

        if(!user){
            return next({ message: 'User not found', statusCode: 404 });
        }

        if(req.user?.email !== user.email){
            return next({ message: 'You are not authorized to perform this action', statusCode: 401 });
        }
        await User.updateOne({ _id: id, isDeleted: false }, { isDeleted: true });
        res.status(200).json({ message: 'User deleted successfully' });
    }catch(err){
        next(err);
    }
};