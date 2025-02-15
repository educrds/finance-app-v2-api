import express from 'express';
import { getUsersLogs, loginUser, registerUser } from '../../controllers/users-controller.js';

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.post('/list-users', getUsersLogs);

export default router;
