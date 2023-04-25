import Delivery from "../models/deliveryModel.js";
import Product from "../models/productModel.js";
import mongoose from "mongoose";

const createDelivery = async (req, res) => {
    const { restaurantID, username, products } = req.body;
    try{
        if (!sameRestaurant(products, restaurantID)) {
            res.status(400).json({ message: "Products must be from the same restaurant." });
            return;
        }
        const total = await calculateTotal(products);
        const delivery = new Delivery({ restaurantID, username, products, total });
        await delivery.save();
        res.status(201).json(delivery);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getDelivery = async (req, res) => {
    const { deliveryID, username } = req.query;
    try {
        if(deliveryID){
            const delivery = await Delivery.findOne({ deliveryID });
            if(!delivery) return res.status(400).json({ message: 'Deliver not found: Check delivery ID' });;
            res.status(200).json(delivery);
        } else if(username){
            const deliverys = await Delivery.aggregate([
                {
                    $match: {
                        isDeleted: false,
                        $or: [
                            { username: mongoose.Types.ObjectId(username) },
                        ],
                    },
                },
                {
                    $project: {
                        _id: 1,
                        restaurantID: 1,
                        username: 1,
                        products: 1,
                        total: 1,
                        status: 1,
                        timestamp: 1,
                    },
                }
            ]);
            if(!deliverys) return res.status(400).json({ message: 'Delivery not found: Check username' });
            res.status(200).json(deliverys);
        } else {
            res.status(400).json({ message: "Bad request" });
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
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
    const { deliveryID } = req.params;
    const { status } = req.body;
    try {
        if(!checkStatus(status)) return res.status(400).json({ message: 'Invalid status: Can set status to Created' });;
        Delivery.findOneAndUpdate(deliveryID, { status }).exec();
        res.status(200).json({ message: "Delivery updated successfully." });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const deleteDelivery = async (req, res) => {
    try {
        const { deliveryID } = req.params;
        const delivery = await Delivery.findOneAndUpdate(deliveryID, { isDeleted: true });
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

const checkStatus = (status) => {
    return status === 'Created' ? false : true;
};

export { createDelivery, getDelivery, getAllDeliverys, updateDelivery, deleteDelivery }