import User from '../models/userModel.js';
import mongoose from 'mongoose';

const createUser = async (req, res) => {
    const { username, first_name, second_name, email, password, phone, address, role} = req.body;
    const user = new User({ username, first_name, second_name, email, password, phone, address, role});
    try {
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

const getUser = async (req, res) => {
    try {
        const { email, password, username } = req.query;
        let user;
        if (email && password) {
            user = await User.findOne({ email, password });
        } else if (username) {
            user = await User.findOne({ username });
        } else {
            res.status(400).json({ message: "Bad request" });
            return;
        }
        if (!user) {
            res.status(404).json({ message: "The User does not exists or the credentials do not match" });
            return;
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const updateUser = async (req, res) => {
    const { username } = req.params;
    const { first_name, second_name, email, password, phone, address } = req.body;
    try {
        User.findOneAndUpdate(username, {
            first_name,
            second_name,
            email,
            password,
            phone,
            address
        }).exec();
    } catch (err){
        res.status(500).send({ message: err.message });
        return;
    }
    res.status(200).send({ message: "User was updated successfully." });
}

const deleteUser = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOneAndUpdate(username, { isDeleted: true });
        if (!user) {
            res.status(404).send({ message: "User not found." });
            return;
        }
    } catch (err){
        res.status(500).send({ message: err.message });
        return;
    }
    res.send({ message: "User was deleted successfully!" });
}

export { createUser, getUser, getAllUsers, updateUser, deleteUser };