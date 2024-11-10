// userControllers.js
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const { User } = require("../models/userModel");

// Définition de getUserById
const getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error.message);
    res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur" });
  }
};

// Enregistrement d’un utilisateur
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: "L'email ou le nom d'utilisateur est déjà pris" });
    }

    const hashedPassword = await argon2.hash(password);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Utilisateur bien enregistré" });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement:", error.message);
    res.status(500).json({ error: "Erreur interne lors de l'enregistrement" });
  }
};

// Connexion d’un utilisateur
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email et mot de passe sont requis" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    const validPassword = await argon2.verify(user.password, password);
    if (!validPassword) {
      return res.status(401).json({ error: "Mot de passe incorrect" });
    }

    // Mettre à jour le statut en ligne
    user.isOnline = true;
    user.lastActive = new Date();
    await user.save();

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: "Connexion réussie",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isOnline: user.isOnline,
        lastActive: user.lastActive
      }
    });
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    res.status(500).json({ error: "Erreur interne lors de la connexion" });
  }
};

const logoutUser = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    user.isOnline = false;
    await user.save();

    res.status(200).json({ message: "Utilisateur déconnecté avec succès" });
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error.message);
    res.status(500).json({ error: "Erreur interne lors de la déconnexion" });
  }
};


const addUser = async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password || !role) {
    return res.status(400).json({ error: "Tous les champs sont requis" });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({ error: "L'email ou le nom d'utilisateur est déjà pris" });
    }

    const hashedPassword = await argon2.hash(password);
    const newUser = new User({ username, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: "Utilisateur ajouté avec succès", user: newUser });
  } catch (error) {
    console.error("Erreur lors de l'ajout d'utilisateur :", error);
    res.status(500).json({ error: "Erreur interne" });
  }
};


// Suppression d’un utilisateur par ID
const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur :", error);
    res.status(500).json({ message: "Erreur interne lors de la suppression" });
  }
};

// Mise à jour des informations d’un utilisateur par ID
const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser && existingUser._id.toString() !== id) {
      return res.status(400).json({ message: "Le nom d'utilisateur est déjà utilisé" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { username, email },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
    res.status(500).json({ message: "Erreur interne lors de la mise à jour" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }); // Filtrer par le rôle "user"
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs.", error });
  }
};

module.exports = { getUserById, registerUser, loginUser, logoutUser, deleteUserById, updateUserById, getAllUsers, addUser };
