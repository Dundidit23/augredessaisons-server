//userRoutes.js
const express = require("express");
const router = express.Router();
const  authenticate = require("../middlewares/authMiddleware");
const authAdmin  = require("../middlewares/authAdmin");
const {
  registerUser,
  loginUser,
  getUserById,
  updateUserById,
  deleteUserById,
  getAllUsers
} = require("../controllers/userControllers");
const {
  requestPasswordReset,
  resetPassword,
} = require("../controllers/resetPasswordController");

// Register a new user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

// Get one user by ID (authenticated user only)
router.get("/:id", authenticate, getUserById);

// Update user by ID (authenticated user only)
router.put("/:id", authenticate, updateUserById);

// Delete user by ID (optional, only if you want users to delete their account)
router.delete("/:id", authenticate, deleteUserById);

router.post("/request-reset-password", requestPasswordReset);

// Route pour réinitialiser le mot de passe
router.post("/reset-password", resetPassword);

router.get("/", authAdmin, getAllUsers);

module.exports = router;
