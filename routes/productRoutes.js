import { Router } from 'express';
import { createProduct, getProduct, getAllProducts, updateProduct, deleteProduct } from '../controllers/productController.js';

const router = Router();

router.post('/', createProduct);

router.get('/products', getAllProducts);

router.get('/:id', getProduct);

router.patch('/:id', updateProduct);

router.delete('/:id', deleteProduct);

export default router;