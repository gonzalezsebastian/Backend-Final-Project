import { Router } from "express";
import { createUser, getToken, getUserByID, updateUser, deleteUser, userLogin } from "../controllers/user.controller";
import { isLogged } from "../middlewares/auth";

const router = Router();

router.post("/create", createUser);

router.get("/jwt", getToken);

router.get("/:id", getUserByID);

router.patch("/:id", isLogged, updateUser);

router.delete("/:id", isLogged, deleteUser);

export default router;
