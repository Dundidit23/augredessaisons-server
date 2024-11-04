// middlewares/authAdmin.js
const jwt = require("jsonwebtoken");

const authAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Accès refusé" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Vérification du rôle
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Accès interdit, administrateur requis" });
    }

    req.admin = decoded; // Assigne l'admin décodé au request pour les opérations ultérieures
    next();
  } catch (err) {
    res.status(403).json({ message: "Accès interdit" });
  }
};

module.exports = authAdmin;
