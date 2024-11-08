//adminAuthController.js
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const { User } = require("../models/userModel");

const Admin = User;

// Fonction pour l'enregistrement d'un nouvel admin
const adminRegister = async (req, res) => {
    try {
        const { username, email, password } = req.body;
    
        if (!username || !email || !password) {
          return res.status(400).json({ message: "Tous les champs sont requis." });
        }
    
        const existingAdmin = await User.findOne({ username }); // Utilisez User ici
        if (existingAdmin) {
          return res.status(400).json({ message: "Cet administrateur existe déjà." });
        }
    
        const hashedPassword = await argon2.hash(password);
        const newAdmin = new User({ username, email, password: hashedPassword, role: "admin" });
    
        await newAdmin.save();
        res.status(201).json({ message: "Administrateur enregistré avec succès." });
      } catch (error) {
        console.error("Erreur lors de l'enregistrement de l'administrateur:", error);
        res.status(500).json({ message: "Erreur lors de l'enregistrement de l'administrateur.", error: error.message });
      }
    };
      

// Fonction pour la connexion d'un admin
const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    const admin = await User.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: "Nom d'utilisateur incorrect" });
    }

    const isPasswordValid = await argon2.verify(admin.password, password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Envoyer la réponse avec le bon statut et le token
    return res.status(200).json({
      token,
      message: "Connexion réussie",
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la connexion admin:", error);
    return res.status(500).json({ message: "Erreur interne du serveur." });
  }
};

  

// Fonction pour mettre à jour les informations d'un admin
const updateAdmin = async (req, res) => {
  const { id } = req.params;
  const { username, email, password, role, status } = req.body;

  try {
    // Récupérer l'administrateur existant
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "Administrateur non trouvé" });
    }

    // Mettre à jour les champs si fournis
    admin.username = username || admin.username;
    admin.email = email || admin.email;
    admin.role = role || admin.role;
    admin.status = status || admin.status;

    // Si un nouveau mot de passe est fourni, le hasher avant de sauvegarder
    if (password && password.trim() !== "") {
      admin.password = await argon2.hash(password);
    }

    // Sauvegarder les modifications
    await admin.save();

    res.status(200).json({
      message: "Administrateur mis à jour avec succès",
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        status: admin.status,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'administrateur:", error);
    res.status(500).json({
      message: "Erreur lors de la mise à jour de l'administrateur",
      error: error.message,
    });
  }
};
// Fonction pour supprimer un admin
const deleteAdmin = async (req, res) => {
  const { id } = req.params; // ID de l'administrateur à supprimer

  try {
    const admin = await Admin.findByIdAndDelete(id);
    if (!admin) return res.status(404).json({ message: "Administrateur non trouvé." });

    res.json({ message: "Administrateur supprimé avec succès." });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de l'administrateur.", error });
  }
};
const getAllAdmins = async (req, res) => {
    try {
      const admins = await User.find({ role: "admin" }); // Filtrer par le rôle "admin"
      res.status(200).json({ admins });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération des administrateurs.", error });
    }
  };

module.exports = {
  adminRegister,
  adminLogin,
  updateAdmin,
  deleteAdmin,
  getAllAdmins
};
