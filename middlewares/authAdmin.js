// authAdmin.js (Middleware)
const jwt = require("jsonwebtoken");
const { User } = require("../models/userModel");

const authAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Vérifie le token dans le header

  if (!token) {
    return res.status(401).json({ message: "Accès non autorisé, token manquant" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Vérifier la validité du token

    const admin = await User.findById(decoded.id); // Chercher l'admin dans la base de données
    if (!admin || admin.role !== "admin") {
      return res.status(404).json({ message: "Admin non trouvé" });
    }

    req.admin = admin; // Ajouter l'admin à l'objet `req` pour un accès ultérieur
    next();
  } catch (error) {
    console.error("Erreur d'authentification:", error.message);
    res.status(401).json({ message: "Token invalide ou expiré" });
  }
};

module.exports = authAdmin;
