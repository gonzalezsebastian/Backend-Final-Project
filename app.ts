import express from "express";
import mongoose, { ConnectOptions } from "mongoose";
import dotenv from "dotenv";
import { userRoutes, orderRoutes, productRoutes } from "./routes";
import cors from "express";

dotenv.config();

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

const connectOptions: ConnectOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
} as any;

mongoose
    .connect(process.env.DATABASE || "", connectOptions)
    .then(() => {
        console.log("Connected to MongoDB!");
    })
    .catch((err) => {
        console.log("There was an error with connection!");
        console.log(err);
    });
