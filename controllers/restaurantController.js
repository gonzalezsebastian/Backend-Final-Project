import Restaurant from "../models/restaurantModel.js";
import mongoose from "mongoose";

const createRestaurant = async (req, res) => {
    const { adminID, name, address, phone, email, category } = req.body;
    const restaurant = new Restaurant({ adminID, name, address, phone, email, category });
    try {
        await restaurant.save();
        res.status(201).json(restaurant);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

const getRestaurant = async (req, res) => {
    const { restaurantID } = req.params;
    try {
        const restaurant = await Restaurant.findOne({ restaurantID });
        if (!restaurant) throw new Error("Restaurant not found");
        res.status(200).json(restaurant);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.status(200).json(restaurants);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const updateRestaurant = async (req, res) => {
    const { restaurantID } = req.params;
    const { adminID, name, address, phone, email, category } = req.body;
    try {
        Restaurant.findOneAndUpdate(restaurantID, {
            adminID,
            name,
            address,
            phone,
            email,
            category
        }).exec();
    } catch (err) {
        res.status(500).send({ message: err.message });
        return;
    }
    res.status(200).send({ message: "Restaurant was updated successfully." });
};

const deleteRestaurant = async (req, res) => {
    try {
        const { restaurantID } = req.params;
        const restaurant = await Restaurant.findOneAndUpdate(restaurantID, { isDeleted: true });
        if (!restaurant) {
            res.status(404).send({ message: "Restaurant not found." });
            return;
        }
        res.status(200).send({ message: "Restaurant was deleted successfully." });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

export { createRestaurant, getRestaurant, getAllRestaurants, updateRestaurant, deleteRestaurant };