// resetPasswordController.js
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const { User } = require("../models/userModel");
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Fonction pour demander la réinitialisation du mot de passe
const requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "L'email est requis" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        // Génération d'un token de réinitialisation
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetToken = resetToken;
        user.resetTokenExpiration = Date.now() + 3600000; // 1 heure de validité
        await user.save();

        // Configuration de nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // Votre adresse e-mail
                pass: process.env.EMAIL_PASS, // Votre mot de passe d'application
            },
        });

        const mailOptions = {
            to: email,
            subject: 'Réinitialisation de votre mot de passe',
            text: `Vous avez demandé une réinitialisation de votre mot de passe. Veuillez cliquer sur ce lien pour réinitialiser votre mot de passe : http://localhost:4000/reset-password/${resetToken}`,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Un lien de réinitialisation a été envoyé à votre adresse e-mail." });
    } catch (error) {
        console.error("Erreur lors de la réinitialisation du mot de passe :", error);
        res.status(500).json({ message: "Erreur interne lors de la réinitialisation du mot de passe." });
    }
};

// Fonction pour réinitialiser le mot de passe
const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({ message: "Token et nouveau mot de passe requis" });
    }

    try {
        const user = await User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });
        if (!user) {
            return res.status(404).json({ message: "Token invalide ou expiré" });
        }

        // Hachage du nouveau mot de passe
        user.password = await argon2.hash(newPassword);
        user.resetToken = undefined; // Réinitialiser le token
        user.resetTokenExpiration = undefined; // Réinitialiser l'expiration
        await user.save();

        res.status(200).json({ message: "Mot de passe réinitialisé avec succès" });
    } catch (error) {
        console.error("Erreur lors de la réinitialisation du mot de passe :", error);
        res.status(500).json({ message: "Erreur interne lors de la réinitialisation du mot de passe." });
    }
};

module.exports = { requestPasswordReset, resetPassword };