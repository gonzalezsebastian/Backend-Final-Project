import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const OrderSchema = new mongoose.Schema(
  {
    username: { type: Schema.Types.ObjectId, ref: 'User',required: true },
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

const Order = mongoose.model('Order', OrderSchema);

export default Order;