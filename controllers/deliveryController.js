import Delivery from "../models/deliveryModel.js";
import Product from "../models/productModel.js";
import Restaurant from "../models/restaurantModel.js";
import mongoose from "mongoose";

const createDelivery = async (req, res) => {
    const { restaurantID, username, products } = req.body;
    try{
        if (!sameRestaurant(products, restaurantID)) {
            return res.status(400).json({ message: "Products must be from the same restaurant." });
        }
        const total = await calculateTotal(products);
        const distance = Math.floor(Math.random() * (1000 - 100) + 100);
        const delivery = new Delivery({ restaurantID, username, products, total, distance });
        await delivery.save();
        // Increment restaurant rating by 1
        await Restaurant.findOneAndUpdate({ restaurantID: restaurantID }, { $inc: { rating: 1 } });
        res.status(201).json(delivery);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getDeliverybyID = async (req, res) => {
    const { _id } = req.params;
    try {
        const delivery = await Delivery.findById(_id);
        if (!delivery) {
            res.status(404).json({ message: "Delivery not found." });
        } else {
            res.status(200).json(delivery);
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const getDeliverybyFilters = async (req, res) => {
    try {
        const { restaurantID, username, deliveryUsername, startDate, endDate, sortbyDistance } = req.query;

        const query = { isDeleted: false };
        if (restaurantID) query.restaurantID = restaurantID;
        if (username) query.username = username;
        if (deliveryUsername) query.deliveryUsername = deliveryUsername;
        if (startDate && endDate) query.createdAt = { $gte: startDate, $lte: endDate };

        const deliveries = Delivery.find(query);
        if (sortbyDistance) query.sort({ distance: 1 });

        res.status(200).json(deliveries);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getNotAcceptedDeliverys = async (req, res) => {
    try {
        const deliveries = await Delivery.find({ status: 'Sent' }, { isDeleted: false });
        res.status(200).json(deliveries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllDeliverys = async (req, res) => {
    try {
        const deliverys = await Delivery.find();
        res.status(200).json(deliverys);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const updateDelivery = async (req, res) => {
    const { _id } = req.params;
    const { username, deliveryUsername, restaurantID, products, status } = req.body;
    try {
        const updatedDelivery = await Delivery.findByIdAndUpdate(
            { _id: _id, isDeleted: false, status: 'Created' },
            {
                $set: {
                    username,
                    deliveryUsername,
                    restaurantID,
                    products,
                    status,
                },
            },
            { new: true }
        );
        if (!updatedDelivery) {
            return res.status(404).json({ message: "Delivery not found." });
        }
        res.status(200).json(updatedDelivery);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteDelivery = async (req, res) => {
    try {
        const { _id } = req.params;
        const delivery = await Delivery.findOneAndUpdate(_id, { isDeleted: true });
        if (!delivery) {
            res.status(404).send({ message: "Delivery not found." });
        } else {
            res.status(200).send({ message: "Delivery deleted successfully." });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

const calculateTotal = async (products) => {
    let total = 0;
    products.map(async (product) => {
        const productFound = await Product.findById(product.productID);
        if (!productFound) {
            res.status(404).json({ message: error.message+` Product ${product.productID} not found.` });
        }
        total += productFound.price * product.quantity;
    });
    return total;
};

const sameRestaurant = (products, restaurantID) => {
    return products.map((product) => product.restaurantID === restaurantID)
                   .every((isSame) => isSame);
};

export { createDelivery, getDeliverybyID, getDeliverybyFilters, getNotAcceptedDeliverys, getAllDeliverys, updateDelivery, deleteDelivery }