import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    second_name: { type: String, required: true },
    last_names: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    address: {
        street: { type: String, required: true },
        number: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zip: { type: String, required: true },
        extraInformation: { type: String },
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
