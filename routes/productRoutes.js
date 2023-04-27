import { Router } from 'express';
import { createProduct, getProductbyID, getProductbyRestaurantID, getAllProducts, updateProduct, deleteProduct } from '../controllers/productController.js';

const router = Router();

router.post('/', createProduct);

router.get('/products', getAllProducts);

router.get('/:_id', getProductbyID);

router.get('/', getProductbyRestaurantID);

router.patch('/:_id', updateProduct);

router.delete('/:_id', deleteProduct);

export default router;