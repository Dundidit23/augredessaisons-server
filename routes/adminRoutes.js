//adminRoutes.js
const express = require('express');
const {
  adminLogin,
  adminRegister,
  updateAdmin,
  deleteAdmin,
  getAllAdmins,
  updateStatus
} = require('../controllers/adminAuthController');
const authAdmin = require('../middlewares/authAdmin'); // Assurez-vous que ce middleware est importé

const router = express.Router();

// Route pour la connexion admin
router.post('/login', adminLogin);

// Route pour enregistrer un nouvel administrateur
router.post('/register', adminRegister);

router.post('/update-status', authAdmin, updateStatus);

// Route pour mettre à jour un administrateur
router.put('/:id', authAdmin, updateAdmin);

// Route pour supprimer un administrateur
router.delete('/:id', authAdmin, deleteAdmin);

router.get("/", authAdmin, getAllAdmins);

module.exports = router;
