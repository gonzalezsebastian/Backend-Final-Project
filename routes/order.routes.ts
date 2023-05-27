import { Router } from "express";
import { orderController } from "../controllers";
import { isLogged } from "../middlewares/auth";

const router = Router();

router.post("/create", isLogged, orderController.createOrder);

router.get("/:id", isLogged, orderController.getOrderByID);

router.get("/:email", isLogged, orderController.getOrdersByEmail);

router.patch("/:id", isLogged, orderController.updateOrder);

export default router;
