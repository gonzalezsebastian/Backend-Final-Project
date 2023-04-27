import { Router } from 'express';
import { createDelivery, getDeliverybyID, getDeliverybyFilters, getNotAcceptedDeliverys, getAllDeliverys, updateDelivery, deleteDelivery } from '../controllers/deliveryController.js';

const router = Router();

router.post('/', createDelivery);

router.get('/deliveries', getAllDeliverys);

router.get('/:_id', getDeliverybyID);

router.get('/', getDeliverybyFilters);

router.get('/notAccepted', getNotAcceptedDeliverys);

router.patch('/:_id', updateDelivery);

router.delete('/:_id', deleteDelivery);

export default router;