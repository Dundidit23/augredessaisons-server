// userControllers.js
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const { User } = require("../models/userModel");

// Définition de getUserById
const getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.status(200).json(user);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur :", error);
    res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur" });
  }
};

// Enregistrement d’un utilisateur
const registerUser = async (req, res) => {
    console.log("Données reçues pour l'inscription :", req.body);
    const { username, email, password } = req.body;

    // Log des données reçues pour vérifier leur structure
  
    try {
        // Vérification que tous les champs sont remplis
        if (!username || !email || !password) {
            console.log("Vérification des champs requis échouée :", req.body);
            return res.status(400).json({ error: "Tous les champs sont requis" });
        }

        // Vérification de l'existence d'un utilisateur avec le même email ou nom d'utilisateur
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            console.log("L'email ou le nom d'utilisateur est déjà pris :", existingUser);
            return res.status(400).json({ error: "L'email ou le nom d'utilisateur est déjà pris" });
        }

        // Hachage du mot de passe pour sécurité
        const hashedPassword = await argon2.hash(password);

        // Création d'un nouvel utilisateur avec le mot de passe haché
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        // Envoi de la réponse avec le statut 201 et le nouvel utilisateur (sans le mot de passe)
        res.status(201).json({ 
            message: "Utilisateur bien enregistré un vrai succès",
            user: { 
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        });

    } catch (error) {
        console.error("Erreur lors de l'enregistrement de l'utilisateur:", error);
        res.status(500).json({ error: "Erreur interne lors de l'enregistrement" });
    }
};

// Connexion d’un utilisateur
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Vérification des champs requis
  if (!email || !password) {
    return res.status(400).json({ message: 'Email et mot de passe dovient être présents' });
  }

  try {
    // Recherche de l'utilisateur par email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Identifiants incorrects" });
    }

    // Vérification du mot de passe
    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Identifiants incorrects' });
    }

    // Génération du token JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Réponse avec le token et les informations de l'utilisateur
    res.status(200).json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role, 
        status: user.status
      }
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ message: 'Erreur interne lors de la connexion' });
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

module.exports = { getUserById, registerUser, loginUser, deleteUserById, updateUserById, getAllUsers };
