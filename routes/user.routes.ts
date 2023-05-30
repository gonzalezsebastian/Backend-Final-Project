import { Router } from "express";
import { userController } from "../controllers";
import { verifyToken } from "../utils/jwt";

const router = Router();

router.post("/create", userController.createUser);

router.post("/login", userController.userLogin);

router.get("/jwt", userController.getToken);

router.get("/:id", userController.getUserByID);

router.patch("/:id", [verifyToken], userController.updateUser);

router.delete("/:id", [verifyToken], userController.deleteUser);

export default router;
