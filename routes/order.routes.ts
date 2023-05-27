import { Router } from "express";
import { OrderController } from "../controllers";
import { isLogged } from "../middlewares/auth";

const router = Router();

router.post("/create", isLogged, OrderController.createOrder);

router.get("/:id", isLogged, OrderController.getOrderByID);

router.get("/:email", isLogged, OrderController.getOrdersByEmail);

router.patch("/:id", isLogged, OrderController.updateOrder);

export default router;
