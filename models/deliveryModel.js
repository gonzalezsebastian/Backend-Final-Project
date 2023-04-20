import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const DeliverySchema = new mongoose.Schema(
  {
    restaurantID: { type: Schema.Types.ObjectId, required: true },
    username: { type: Schema.Types.ObjectId, required: true },
    deliveryUsername: { type: Schema.Types.ObjectId, required: true },
    total: { type: Number },
    status: { type: String, default: 'Created' },
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