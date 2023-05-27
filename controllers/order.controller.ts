import { OrderModel } from "../models";
import { Request, Response } from "express";

const createOrder = async (req: Request, res: Response) => {
    const orderData = req.body;
    try {
        const order = await OrderModel.create(orderData);
        res.status(200).json({ message: "order created", order });
    } catch (error) {
        res.status(500).json({ message: "order not created", error });
    }
};

const getOrderByID = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const order = await OrderModel.find({ _id: id });
        res.status(200).json({ data: order, message: "order details" });
    } catch (error) {
        res.status(500).json({ message: "order not found", error });
    }
};

const getOrdersByEmail = async (req: Request, res: Response) => {
    const { email } = req.params;
    const filter = req.query ?? {};
    const startDate = filter.startDate ?? new Date(0);
    const endDate = filter.endDate ?? new Date();
    try {
        const orders = await OrderModel.find({
            $or: [
                { email: email },
                { created_at: { $gte: startDate, $lte: endDate } },
            ],
        });
        res.status(200).json({ data: orders, message: "orders list" });
    } catch (error) {
        res.status(500).json({ message: "orders not found", error });
    }
};

const updateOrder = async (req: Request, res: Response) => {
    const { id } = req.params;
    const orderData = req.body;
    try {
        await OrderModel.findByIdAndUpdate(id, orderData);
        res.status(200).json({ message: "order updated" });
    } catch (error) {
        res.status(500).json({ message: "order not updated", error });
    }
};

export default { createOrder, getOrderByID, getOrdersByEmail, updateOrder };
