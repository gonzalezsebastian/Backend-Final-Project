import moongose from 'mongoose';

const ProductSchema = new moongose.Schema({
  restaurantID: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true},
  category: { type: String, required: true },
  availableQuantity: { type: Number, required: true },
  price: { type: Number, min:0, required: true },
  productStatus: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
});

const Product = moongose.model('Product', ProductSchema);

export default Product;