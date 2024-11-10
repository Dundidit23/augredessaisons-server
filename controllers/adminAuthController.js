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

    // Vérifier si l'email a un format valide
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Email invalide." });
    }

    // Vérifier si l'utilisateur existe déjà par email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    const existingAdmin = await User.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: "Cet administrateur existe déjà." });
    }

    const hashedPassword = await argon2.hash(password);
    const newAdmin = new User({
      username,
      email,
      password: hashedPassword,
      role: "admin",
    });

    await newAdmin.save();
    res.status(201).json({ message: "Administrateur enregistré avec succès." });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de l'administrateur:", error);
    res.status(500).json({
      message: "Erreur lors de l'enregistrement de l'administrateur.",
      error: error.message,
    });
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

    // Vérifier que l'utilisateur est bien un administrateur
    if (admin.role !== "admin") {
      return res.status(403).json({ message: "Accès refusé" });
    }

    const isPasswordValid = await argon2.verify(admin.password, password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    admin.isOnline = true;
    admin.lastActive = new Date();
    await admin.save();

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      token,
      message: "Connexion réussie",
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        isOnline: admin.isOnline,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la connexion admin:", error);
    return res.status(500).json({ message: "Erreur interne du serveur." });
  }
};

const adminLogout = async (req, res) => {
  try {
    const adminId = req.admin.id;  // On suppose que l'ID de l'admin est récupéré via le middleware de vérification du token

    // Récupérer l'administrateur en base de données
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Administrateur non trouvé" });
    }

    // Mettre à jour le statut "en ligne" à false lors de la déconnexion
    admin.isOnline = false;
    admin.lastActive = new Date();  // Mettre à jour la dernière activité
    await admin.save();

    // Envoi de la réponse de succès
    res.status(200).json({
      message: "Déconnexion réussie",
    });
  } catch (error) {
    console.error("Erreur lors de la déconnexion admin:", error);
    return res.status(500).json({ message: "Erreur interne du serveur." });
  }
};


// Fonction pour mettre à jour les informations d'un admin
const updateAdmin = async (req, res) => {
  const { id } = req.params;
  const { username, email, password, role, status } = req.body;

  try {
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: "Administrateur non trouvé" });
    }

    // Vérification si un super admin essaie de modifier un autre admin
    if (req.admin.role !== 'superadmin' && admin.role === 'superadmin') {
      return res.status(403).json({ message: "Accès refusé" });
    }

    admin.username = username || admin.username;
    admin.email = email || admin.email;
    admin.role = role || admin.role;
    admin.status = status || admin.status;

    if (password && password.trim() !== "") {
      admin.password = await argon2.hash(password);
    }

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

// Fonction pour obtenir tous les admins
const getAllAdmins = async (req, res) => {
  try {
    console.log("Récupération des admins..."); // Debug
    const admins = await User.find({ role: "admin" });
    if (!admins || admins.length === 0) {
      return res.status(404).json({ message: "Aucun administrateur trouvé" });
    }
    res.status(200).json({ admins });
  } catch (error) {
    console.error("Erreur lors de la récupération des admins:", error);
    res.status(500).json({ message: "Erreur lors de la récupération des administrateurs.", error });
  }
};

// Fonction pour mettre à jour le statut "en ligne" d'un admin
const updateStatus = async (req, res) => {
  const { adminId, isOnline } = req.body;
  try {
    // Mettre à jour le statut de l'admin et la dernière activité
    const admin = await Admin.findByIdAndUpdate(
      adminId,
      {
        isOnline,
        lastActive: isOnline ? new Date() : Date.now(),
      },
      { new: true }  // Retourner l'admin mis à jour
    );
    res.status(200).json({ success: true, admin });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

module.exports = {
  adminRegister,
  adminLogin,
  updateAdmin,
  deleteAdmin,
  getAllAdmins,
  updateStatus,
  adminLogout
};
