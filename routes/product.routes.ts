import { productController } from "../controllers";
import { Router } from "express";
import { verifyToken } from "../utils/jwt";

const router = Router();

router.post("/create", verifyToken, productController.createProduct);

router.get("/:id", productController.getProductByID);

router.get("/:email", productController.getProducts);

router.get("/category/:category", productController.getProductsByCategory);

router.patch("/:id", verifyToken, productController.updateProduct);

router.delete("/:id", verifyToken, productController.deleteProduct);

export default router;
