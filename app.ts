import express from "express";
import { userRoutes, orderRoutes } from "./routes";
import cors from "express";

// Creacion del app
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
});

app.use("/users", userRoutes);
app.use("/orders", orderRoutes);
app.use("/products", productRoutes);
