import { createProduct, getProductByID, getProducts, getProductsByCategory, updateProduct, deleteProduct } from "../controllers/product.controller";
import { Router } from "express";
import { isLogged } from "../middlewares/auth";

const router = Router();

router.post("/create", isLogged, createProduct);

router.get("/:id", getProductByID);

router.get("/:email", getProducts);

router.get("/category/:category", getProductsByCategory);

router.patch("/:id", isLogged, updateProduct);

router.delete("/:id", isLogged, deleteProduct);

export default router;
