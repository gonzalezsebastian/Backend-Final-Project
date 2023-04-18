import mongoose from 'mongoose';

const DeliverySchema = new mongoose.Schema(
  {
    restaurantID: { type: String, required: true },
    username: { type: String, required: true },
    deliveryUsername: { type: String, required: true },
    total: { type: Number, required: true },
    status: { type: String, default: 'pending' },
    products: {
      type: [
        {
          productID: {type: String, required: true},
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