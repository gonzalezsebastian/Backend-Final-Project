import { Router } from 'express';
import { createUser, getUser, getAllUsers, updateUser, deleteUser } from '../controllers/userController.js';

const router = Router();

router.post('/', createUser);

router.get('/', getAllUsers);

router.get('/:id', getUser);

router.patch('/:username', updateUser);

router.delete('/:username', deleteUser);

export default router;
