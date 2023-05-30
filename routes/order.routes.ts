import { Router } from "express";
import { orderController } from "../controllers";
import { verifyToken } from "../utils/jwt";

const router = Router();

router.post("/create", verifyToken, orderController.createOrder);

router.get("/:id", verifyToken, orderController.getOrderByID);

router.get("/:email", verifyToken, orderController.getOrdersByEmail);

router.patch("/:id", verifyToken, orderController.updateOrder);

export default router;
