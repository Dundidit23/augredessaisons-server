// userRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  dashboard,
} = require('../controllers/userControllers');

// Register a new user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Get all users
router.get('/', authMiddleware, getAllUsers);

// Get one user by ID
router.get('/:id', authMiddleware, getUserById);

// Update user by ID
router.put('/:id', authMiddleware, updateUserById);

// Delete user by ID
router.delete('/:id', authMiddleware, deleteUserById);

// Protected route for admin dashboard
router.get('/dashboard', authMiddleware, dashboard);

module.exports = router;
