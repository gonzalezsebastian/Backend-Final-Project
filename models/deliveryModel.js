import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const DeliverySchema = new mongoose.Schema(
  {
    restaurantID: { type: Schema.Types.ObjectId, required: true },
    username: { type: Schema.Types.ObjectId, ref: 'User',required: true },
    deliveryUsername: { type: Schema.Types.ObjectId, ref: 'User',required: true },
    total: { type: Number },
    status: { type: String, enum: ['Created','Sent', 'Accepted', 'Received', 'Arrived', 'Finished'], default: 'Created' },
    products: {
      type: [
        {
          productID: {type: String, required: true},
          quantity: {type: Number, required: true},
        },
      ],
    },
    distance: { type: Number, immutable: true, default: 0 },
    createdAt: { type: Date, immutable: true, default: Date.now },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Delivery = mongoose.model('Delivery', DeliverySchema);

export default Delivery;