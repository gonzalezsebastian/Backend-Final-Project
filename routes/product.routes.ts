import { productController } from "../controllers";
import { Router } from "express";
import { isLogged } from "../middlewares/auth";

const router = Router();

router.post("/create", isLogged, productController.createProduct);

router.get("/:id", productController.getProductByID);

router.get("/:email", productController.getProducts);

router.get("/category/:category", productController.getProductsByCategory);

router.patch("/:id", isLogged, productController.updateProduct);

router.delete("/:id", isLogged, productController.deleteProduct);

export default router;
