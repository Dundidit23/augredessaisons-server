// middlewares/authAdmin.js
const jwt = require("jsonwebtoken");
const { User } = require("../models/userModel");

const authAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  // Log du token pour vérifier s'il est bien présent
  console.log("Token reçu:", token);

  if (!token) {
    console.log("Erreur: Token manquant");
    return res.status(401).json({ message: "Token manquant" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Log du contenu décodé
    console.log("Token décodé:", decoded);

    // Vérification du rôle
    if (decoded.role !== "admin") {
      console.log("Erreur: Accès interdit, rôle incorrect");
      return res.status(403).json({ message: "Accès interdit, administrateur requis" });
    }

    // Vérification si l'admin existe dans la base de données
    const admin = await User.findById(decoded.id);
    if (!admin) {
      console.log("Erreur: Admin non trouvé");
      return res.status(404).json({ message: "Admin non trouvé" });
    }

    req.admin = admin;
    next();
  } catch (err) {
    console.log("Erreur: Token invalide ou expiré", err.message);
    res.status(403).json({ message: "Token invalide ou expiré" });
  }
};

module.exports = authAdmin;
