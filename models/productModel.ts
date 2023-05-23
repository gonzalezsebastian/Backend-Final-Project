import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true},
  category: { type: String, required: true },
  availableQuantity: { type: Number, required: true },
  price: { type: Number, min:0, required: true },
  productStatus: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
});

const Product = mongoose.model('Product', ProductSchema);

export default Product;