import express from 'express';
import {signup,login,logout} from '../controllers/auth.controller.js';

const router = express.Router();

// Route for user signup
router.post('/signup', signup);

// Route for user login
router.post('/login', login);

// Route for user logout
router.post('/logout', logout);



export default router;