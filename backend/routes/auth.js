const express = require('express');
const { body } = require('express-validator');
const { register, login, getMe, updateProfile, getAllUsers, deleteUser } = require('../controllers/authController');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], register);

// Login
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], login);

// Get current user (protected)
router.get('/me', auth, getMe);

// Update profile (protected)
router.put('/profile', auth, [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email is required')
], updateProfile);

// Get all users
router.get('/users', getAllUsers);

// Delete user (Admin only)
router.delete('/users/:id', adminAuth, deleteUser);

module.exports = router;
