import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
    {
        email: { type: String, required: true },
        total: { type: Number },
        status: {
            type: String,
            enum: [
                "Created",
                "Sent",
                "Accepted",
                "Received",
                "Arrived",
                "Finished",
            ],
            default: "Created",
        },
        products: {
            type: [
                {
                    productID: { type: String, required: true },
                    quantity: { type: Number, required: true, default: 1 },
                },
            ],
        },
        distance: { type: Number, immutable: true, default: 0 },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

OrderSchema.pre("find", function () {
    this.where({ isDeleted: { $ne: true } });
});

OrderSchema.pre("findOne", function () {
    this.where({ isDeleted: { $ne: true } });
});

OrderSchema.pre("findOneAndUpdate", function () {
    this.where({ isDeleted: { $ne: true } });
});

const Order = mongoose.model("Order", OrderSchema);

export default Order;
