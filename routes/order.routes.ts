import { Router } from "express";
import { createOrder, getOrderByID, getOrdersByEmail, updateOrder } from "../controllers/order.controller";
import { isLogged } from "../middlewares/auth";

const router = Router();

router.post("/create", isLogged, createOrder);

router.get("/:id", isLogged, getOrderByID);

router.get("/:email", isLogged, getOrdersByEmail);

router.patch("/:id", isLogged, updateOrder);

export default router;
