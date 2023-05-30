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
            _id: id,
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
    const { categoria = "", texto_busqueda = "" } = req.query;
    try {
        const products = await ProductModel.find(
            {
                email: email,
                nombre: { $regex: new RegExp(`${texto_busqueda}`, "i") },
            },
            {
                $or: [
                    {
                        categoria: { $regex: new RegExp(`${categoria}`, "i") },
                    },
                ],
            }
        );
        return res
            .status(200)
            .send({ message: "Products found", data: products });
    } catch (err) {
        return res.status(500).send({ message: err });
    }
};

export const getProductsByCategory = async (req: Request, res: Response) => {
    const { category } = req.params;
    try {
        const producsts = await ProductModel.find({ category: category });
        return res
            .status(200)
            .json({ message: "Products found", data: producsts });
    } catch (err) {
        return res.status(500).json({ message: "Server error", err });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await ProductModel.findOneAndUpdate({ _id: id }, req.body).exec();
        return res.status(200).json({ message: "Product updated" });
    } catch (err) {
        return res.status(500).json({ message: "Server error", err });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await ProductModel.findOneAndDelete({ _id: id }).exec();
        return res.status(200).json({ message: "Product deleted" });
    } catch (err) {
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
