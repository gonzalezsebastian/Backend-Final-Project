import { Router } from "express";
import { createUser, getToken, getUserByID, updateUser, deleteUser, userLogin } from "../controllers/user.controller";
import { verifyToken } from "../utils/jwt";

const router = Router();

router.post("/create", createUser);

router.post("/login", userLogin);

router.get("/jwt", getToken);

router.get("/:id", getUserByID);

router.patch("/:id", verifyToken, updateUser);

router.delete("/:id", verifyToken, deleteUser);

export default router;
