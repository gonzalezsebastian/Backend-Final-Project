import { OrderModel } from "../models";
import { Request, Response } from "express";

export const createOrder = async (req: Request, res: Response) => {
    const orderData = req.body;
    try {
        const order = await OrderModel.create(orderData);
        res.status(200).json({ message: "order created", order });
    } catch (error) {
        res.status(500).json({ message: "order not created", error });
    }
};

export const getOrderByID = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const order = await OrderModel.find({ _id: id });
        if (order.length == 0) {
            res.status(404).json({ message: "order not found" });
        }
        res.status(200).json({ data: order[0], message: "order details" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const getOrdersByEmail = async (req: Request, res: Response) => {
    const { email } = req.params;
    const { startDate = new Date(0), endDate = new Date() } = req.query;
    try {
        const orders = await OrderModel.find({
            $or: [
                { email: email },
                { created_at: { $gte: startDate, $lte: endDate } },
            ],
        });
        if (orders.length == 0) {
            res.status(404).json({ message: "orders not found" });
        }
        res.status(200).json({ data: orders, message: "orders list" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const updateOrder = async (req: Request, res: Response) => {
    const { id } = req.params;
    const orderData = req.body;
    try {
        const newOrder = await OrderModel.findByIdAndUpdate(id, orderData);
        res.status(200).json({ message: "order updated", order: newOrder });
    } catch (error) {
        res.status(500).json({ message: "order not updated", error });
    }
};

export default { createOrder, getOrderByID, getOrdersByEmail, updateOrder };
