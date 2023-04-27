import mongoose from 'mongoose';

const RestaurantSchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurantID: { type: String, required: true, unique: true },
  name: { type: String, required: true},
  address: { 
    street: { type: String, required: true},
    number: { type: String, required: true},
    city: { type: String, required: true},
    state: { type: String, required: true},
    zip: { type: String, required: true},
    extraInformation: { type: String }
  },
  phone: { type: String, required: true},
  categories: { type: [String], required: true },
  rating: { type: Number, default: 0 },
  products: { type: [String], default: [] },
  isDeleted: { type: Boolean, default: false },
});

const Restaurant = mongoose.model('Restaurant', RestaurantSchema);

export default Restaurant;