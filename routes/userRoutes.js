//userRoutes.js
const express = require("express");
const router = express.Router();
const  authenticate = require("../middlewares/authMiddleware");
const authAdmin  = require("../middlewares/authAdmin");
const {
  registerUser,
  loginUser,
  logoutUser,
  getUserById,
  updateUserById,
  deleteUserById,
  getAllUsers,
  addUser
} = require("../controllers/userControllers");
const {
  requestPasswordReset,
  resetPassword,
} = require("../controllers/resetPasswordController");

// Register a new user
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", authenticate, logoutUser);

router.post('/', authAdmin, async (req, res) => {
  try {
    await addUser(req, res);
  } catch (error) {
    console.error("Erreur lors de l'ajout d'un utilisateur:", error.message);
    res.status(500).json({ message: "Erreur interne lors de l'ajout d'un utilisateur" });
  }
});





router.get("/", authAdmin, getAllUsers);

router.get("/:id", authenticate, getUserById);
router.put("/:id", authenticate, updateUserById);
router.delete("/:id", authAdmin, deleteUserById);


router.post("/request-reset-password", requestPasswordReset);

// Route pour réinitialiser le mot de passe
router.post("/reset-password", resetPassword);

router.get("/", authAdmin, getAllUsers);

module.exports = router;
