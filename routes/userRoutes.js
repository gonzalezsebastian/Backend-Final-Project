import { Router } from 'express';
import { createUser, getUser, getAllUsers, updateUser, deleteUser } from '../controllers/userController.js';

const router = Router();

router.post('/user', createUser);

router.get('/users', getAllUsers);

router.get('/user/:username', getUser);

router.patch('/user/:username', updateUser);

router.delete('/user/:username', deleteUser);

export default router;
