import express from 'express';
import {signup,login,logout,onboarding} from '../controllers/auth.controller.js';
import {protectRoute} from "../middleware/auth.middleware.js";

const router = express.Router();

// Route for user signup
router.post('/signup', signup);

// Route for user login
router.post('/login', login);

// Route for user logout
router.post('/logout', logout);

// Route for onboarding
router.post("/onboarding",protectRoute, onboarding);

//check if the user is logged in
router .get("/me",protectRoute,(req,res)=>{
    res.status(200).json({
        success:true,
        user:req.user
    })
})

//todo : add forgot password and reset password routes
//todo : add google auth routes



export default router;