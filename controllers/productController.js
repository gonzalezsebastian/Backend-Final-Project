import Product from "../models/productModel.js";
import mongoose from "mongoose";

const createProduct = async (req, res) => {
    const { restaurantID, name, description, category, availableQuantity, price } = req.body;

    if (!mongoose.Types.ObjectId.isValid(restaurantID)) {
      return res.status(400).json({ message: 'Invalid restaurant ID' });
    }
    const productStatus = availableQuantity > 0 ? true : availableQuantity === 0 ? false : null;
    if (productStatus === null) {
      return res.status(400).json({ message: 'Invalid available quantity' });
    }
    const product = new Product({ restaurantID, name, description, availableQuantity, category, price, productStatus });
    try {
      await product.save();
      res.status(201).json(product);
    } catch (error) {
      res.status(409).json({ message: error.message });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const getProduct = async (req, res) => {
    const { _id } = req.params;
    try {
        const product = await Product.findById(_id);
        res.status(200).json(product);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const updateProduct = async (req, res) => {
    const { _id } = req.params;
    const { name, description, category, availableQuantity, price } = req.body;
    const productStatus = availableQuantity > 0 ? true : availableQuantity === 0 ? false : null;
    if (productStatus === null) {
      return res.status(400).json({ message: 'Invalid available quantity' });
    }
    try {
        Product.findByIdAndUpdate(_id, {
            name,
            description,
            availableQuantity,
            category,
            price,
            productStatus
        }).exec();
    } catch (err) {
        res.status(500).send({ message: err.message });
        return;
    }
    res.status(200).send({ message: "Product was updated successfully." });
};

const deleteProduct = async (req, res) => {
    const { _id } = req.params;
    try {
        const product = await Product.findByIdAndUpdate(_id, { isDeleted: true });
        if (!product) {
            res.status(404).send({ message: "Product not found." });
            return;
        }
        res.status(200).send({ message: "Product was deleted successfully." });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

export { createProduct, getProduct, getAllProducts, updateProduct, deleteProduct };