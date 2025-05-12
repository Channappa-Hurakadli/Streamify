import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getUnifyToken } from '../controllers/chat.controller.js';

const router = express.Router();

router.get('/token',protectRoute,getUnifyToken)

export default router;