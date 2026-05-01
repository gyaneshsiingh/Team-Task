import express from 'express';
import {register,login,getProfile,logout,getAllUsers} from "../controllers/authControllers.js";
import {protect, requireRole} from '../middleware/auth.js'

const router=express.Router();
router.post('/register',register);
router.post('/login',login);

// Protected routes
router.get('/profile',protect,getProfile);
router.post('/logout',protect,logout);

// Admin-only: get all users for task assignment
router.get('/users', protect, requireRole('admin'), getAllUsers);

export default router;