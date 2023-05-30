// @ts-ignore
import cookieParser from "cookie-parser";

import express from "express";
import dotenv from "dotenv";
import { userRoutes, orderRoutes, productRoutes } from "./routes";
import cors from "express";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/users", userRoutes);
app.use("/orders", orderRoutes);
app.use("/products", productRoutes);

export default app;
