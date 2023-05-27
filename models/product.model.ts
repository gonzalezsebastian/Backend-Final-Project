import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
    {
        sellerID: { type: "String", immutable: true, required: true },
        name: { type: String, required: true },
        description: { type: String, required: true },
        category: { type: String, required: true },
        availableQuantity: { type: Number, required: true },
        price: { type: Number, min: 0, required: true },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true, toJSON: { getters: true } }
);

ProductSchema.virtual("productStatus").get(function (this: any) {
    if (this.availableQuantity > 0) return "Available";
    return "Out of stock";
});

ProductSchema.pre("find", function () {
    this.where({ isDeleted: { $ne: true } });
});

ProductSchema.pre("findOne", function () {
    this.where({ isDeleted: { $ne: true } });
});

ProductSchema.pre("findOneAndUpdate", function () {
    this.where({ isDeleted: { $ne: true } });
});

const Product = mongoose.model("Product", ProductSchema);

export default Product;
