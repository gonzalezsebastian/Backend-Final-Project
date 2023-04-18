import mongoose from 'mongoose';

const RestaurantSchema = new mongoose.Schema({
  adminID: { type: String, required: true },
  name: { type: String, required: true},
  description: { type: String },
  address: { 
    street: { type: String, required: true},
    number: { type: String, required: true},
    city: { type: String, required: true},
    state: { type: String, required: true},
    zip: { type: String, required: true},
    extraInformation: { type: String }
  },
  phone: { type: String, required: true},
  email: { type: String, required: true},
  category: { type: String, required: true },
  rating: { type: Number, default: 0 },
  isDeleted: { type: Boolean, default: false },
});

const Restaurant = mongoose.model('Restaurant', RestaurantSchema);

export default Restaurant;