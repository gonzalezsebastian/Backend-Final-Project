import { Request, Response } from "express";
import { ProductModel } from "../models";
import { ExtendedRequest } from "../types/user";

const createProduct = async (req: ExtendedRequest, res: Response) => {
    try {
        const product = await ProductModel.create({
            sellerID: req.user?.email,
            ...req.body,
        });
        res.status(201).json({ message: "Product created", data: product });
    } catch (err) {
        res.send(500).json({ message: "Server error", err });
    }
};

const getProductByID = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const product = await ProductModel.findOne({ _id: id });
        res.status(200).json({ message: "Product found", data: product });
    } catch (err) {
        res.send(500).json({ message: "Server error", err });
    }
};

const getProducts = async (req: ExtendedRequest, res: Response) => {
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
        res.status(200).send({ message: "Products found", data: products });
    } catch (err) {
        res.status(500).send({ message: err });
    }
};

const getProductsByCategory = async (req: Request, res: Response) => {
    const { category } = req.params;
    try {
        const producsts = await ProductModel.find({ category: category });
        res.status(200).json({ message: "Products found", data: producsts });
    } catch (err) {
        res.send(500).json({ message: "Server error", err });
    }
};

const updateProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await ProductModel.findOneAndUpdate({ _id: id }, req.body).exec();
        res.status(200).json({ message: "Product updated" });
    } catch (err) {
        res.send(500).json({ message: "Server error", err });
    }
};

const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await ProductModel.findOneAndDelete({ _id: id }).exec();
        res.status(200).json({ message: "Product deleted" });
    } catch (err) {
        res.send(500).json({ message: "Server error", err });
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
