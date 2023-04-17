import mongoose from 'mongoose';

const DeliverySchema = new mongoose.Schema(
  {
    idRestaurant: { type: String, required: true },
    idUser: { type: String, required: true },
    total: { type: Number, required: true },
    status: { type: String, required: true },
    products: {
      type: [
        {
          idProduct: {type: String, required: true},
          quantity: {type: Number, required: true},
        },
      ],
      unique: true,
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Delivery = mongoose.model('Delivery', DeliverySchema);

export default Delivery;