import mongoose from "mongoose";
import { Request, Response } from "express";
import { ProductModel } from "../models";
import { ExtendedRequest } from "../types/user";

export const createProduct = async (req: ExtendedRequest, res: Response) => {
    try {
        const product = await ProductModel.create({
            sellerID: req.user?.email,
            ...req.body,
        });
        return res
            .status(201)
            .json({ message: "Product created", data: product });
    } catch (err) {
        return res.status(500).json({ message: "Server error", err });
    }
};

export const getProductByID = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const product = await ProductModel.findOne({
            _id: new mongoose.Types.ObjectId(id),
            isDeleted: false,
        });
        if (!product)
            return res.status(404).json({ message: "Product not found" });
        return res
            .status(200)
            .json({ message: "Product found", data: product });
    } catch (err) {
        return res.status(500).json({ message: "Server error", err });
    }
};

export const getProducts = async (req: ExtendedRequest, res: Response) => {
    const { email } = req.params;
    const { category = "", search_text = "" } = req.query;
    try {
        const products = await ProductModel.find(
            {
                sellerID: email,
                $or: [
                    {
                        category: { $regex: new RegExp(`${category}`, "i") },
                        name: { $regex: new RegExp(`${search_text}`, "i") },
                    },
                ],
                isDeleted: false,
            }
        );
        if (products.length === 0) return res.status(404).json({ message: "Products not found" });
        return res.status(200).json({ message: "Products found", data: products });
    } catch (err) {
        return res.status(500).json({ message: err });
    }
};

export const getProductsByCategory = async (req: Request, res: Response) => {
    const { category } = req.params;
    try {
        const products = await ProductModel.find({ category: category, isDeleted: false });
        if (products.length === 0) return res.status(404).json({ message: "Products not found" });
        return res.status(200).json({ message: "Products found", data: products });
    } catch (err) {
        return res.status(500).json({ message: "Server error", err });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const product = await ProductModel.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        await ProductModel.updateOne({ _id: id }, req.body);
        return res.status(200).json({ message: "Product updated" });
    } catch (err) {
        return res.status(500).json({ message: "Server error", err });
    }
};

export const deleteProduct = async (req: ExtendedRequest, res: Response) => {
    const { id } = req.params;

    try {
        const product = await ProductModel.findOne({ _id: id, isDeleted: false });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        await ProductModel.updateOne({ _id: id }, { isDeleted: true });
        return res.status(200).json({ message: "Product deleted successfully" });
    } catch (err) {
        console.log("Error in delete product", err);
        return res.status(500).json({ message: "Server error", err });
    }
};

export default {
    createProduct,
    getProductByID,
    getProducts,
    getProductsByCategory,
    updateProduct,
    deleteProduct,
};
