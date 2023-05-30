import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    second_name: { type: String },
    last_names: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    address: {
        type: String,
        required: true,
    },
    isDeleted: { type: Boolean, default: false },
});

UserSchema.pre("find", function () {
    this.where({ isDeleted: { $ne: true } });
});

UserSchema.pre("findOne", function () {
    this.where({ isDeleted: { $ne: true } });
});

const User = mongoose.model("User", UserSchema);

export default User;
