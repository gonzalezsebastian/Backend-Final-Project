import { Router } from 'express';
import { createDelivery, getDelivery, getAllDeliverys, updateDelivery, deleteDelivery } from '../controllers/deliveryController.js';

const router = Router();

router.post('/', createDelivery);

router.get('/deliveries', getAllDeliverys);

router.get('/:id', getDelivery);

router.patch('/:id', updateDelivery);

router.delete('/:id', deleteDelivery);

export default router;