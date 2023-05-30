import { createProduct, getProductByID, getProducts, getProductsByCategory, updateProduct, deleteProduct } from "../controllers/product.controller";
import { Router } from "express";
import { verifyToken } from "../utils/jwt";

const router = Router();

router.post("/create", verifyToken, createProduct);

router.get("/:id", getProductByID);

router.get("/user/:email", getProducts);

router.get("/category/:category", getProductsByCategory);

router.patch("/:id", verifyToken, updateProduct);

router.delete("/:id", verifyToken, deleteProduct);

export default router;
