import { Router } from 'express';
import { createUser, loginUser, getUserInfo, setUserGoal, addFavorite, getUserFavorites } from '../controllers/user.controller';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/me', authMiddleware, getUserInfo);
router.post('/goal', authMiddleware, setUserGoal);
router.post('/favorites', authMiddleware, addFavorite);
router.get('/favorites/', authMiddleware, getUserFavorites);

export default router;
