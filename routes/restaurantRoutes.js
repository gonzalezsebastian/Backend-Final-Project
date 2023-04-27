import { Router } from 'express';
import { createRestaurant, getRestaurant, getAllRestaurants, updateRestaurant, deleteRestaurant } from '../controllers/restaurantController.js';

const router = Router();

router.post('/', createRestaurant);

router.get('/', getRestaurant);

router.get('/restaurants', getAllRestaurants);

router.patch('/:restaurantID', updateRestaurant);

router.delete('/:restaurantID', deleteRestaurant);

export default router;