import moongose from 'mongoose';

const ProductSchema = new moongose.Schema({
  restaurantID: { type: String, required: true },
  restaurantName: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, default: 'active' },
  isDeleted: { type: Boolean, default: false },
});

const Product = moongose.model('Product', ProductSchema);

export default Product;