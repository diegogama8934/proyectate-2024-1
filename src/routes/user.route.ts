import { Router } from 'express';
import { createUser, loginUser, getUserInfo, setUserGoal, addFavorite } from '../controllers/user.controller';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/me', authMiddleware, getUserInfo);
router.post('/goal', authMiddleware, setUserGoal);
router.post('/favorites', authMiddleware, addFavorite);

export default router;
