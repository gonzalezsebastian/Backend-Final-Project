import { Router } from 'express';
import { createUser, getUser, updateUser, deleteUser } from '../controllers/userController.js';

const router = Router();

router.post('/', createUser);

router.get('/', getUser);

router.patch('/:username', updateUser);

router.delete('/:username', deleteUser);

export default router;
