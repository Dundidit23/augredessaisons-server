//productRoutes.js
const express = require('express');
const multer = require('multer');
const {
  getAllProducts,
  createProduct,
  getOneProduct,
  updateProductById,
  deleteProductById
} = require('../controllers/productController');

const router = express.Router();

// Configuration de stockage multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); // Dossier de destination
  },
  filename: function (req, file, cb) {
    const cleanFileName = file.originalname.replace(/[^a-zA-Z0-9.\-]/g, '_');
    cb(null, Date.now() + '-' + cleanFileName); // Nom unique du fichier avec timestamp
  }
});

// Middleware d'upload
const upload = multer({ storage: storage });

// Routes pour les produits
router.route("/")
  .get(getAllProducts)
  .post(upload.single('image'), createProduct); // Créer un nouveau produit

router.route("/:id")
  .get(getOneProduct)
  .put(upload.single('image'), updateProductById) // Mettre à jour un produit
  .delete(deleteProductById); 

module.exports = router;
