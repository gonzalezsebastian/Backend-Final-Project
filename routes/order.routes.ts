import { Router } from "express";
import { createOrder, getOrderByID, getOrdersByEmail, updateOrder } from "../controllers/order.controller";
import { verifyToken } from "../utils/jwt";

const router = Router();

router.post("/create", verifyToken, createOrder);

router.get("/:id", verifyToken, getOrderByID);

router.get("/user/:email", verifyToken, getOrdersByEmail);

router.patch("/:id", verifyToken, updateOrder);

export default router;
