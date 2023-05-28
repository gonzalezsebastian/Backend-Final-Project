import { Router } from "express";
import { userController } from "../controllers";
import { isLogged } from "../middlewares/auth";

const router = Router();

router.post("/create", userController.createUser);

router.get("/jwt", userController.getToken);

router.get("/:id", userController.getUserByID);

router.patch("/:id", isLogged, userController.updateUser);

router.delete("/:id", isLogged, userController.deleteUser);

export default router;
