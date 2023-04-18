import { Router } from 'express';
import { createRestaurant, getAllRestaurants, getRestaurant, updateRestaurant, deleteRestaurant } from '../controllers/restaurantController.js';

const router = Router();

router.post('/', createRestaurant);

router.get('/restaurants', getAllRestaurants);

router.get('/:restaurantID', getRestaurant);

router.patch('/:restaurantID', updateRestaurant);

router.delete('/:restaurantID', deleteRestaurant);

export default router;