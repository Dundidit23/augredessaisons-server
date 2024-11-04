// utils/sendReplyEmail.js

const nodemailer = require("nodemailer");

const sendReplyEmail = async (recipientEmail, subject, messageContent) => {
  try {
    // Configurer le transporteur avec vos informations de messagerie
    const transporter = nodemailer.createTransport({
      service: "gmail", // ou utilisez un autre service comme Outlook, Yahoo, etc.
      auth: {
        user: process.env.EMAIL_USER, // Utilisateur (email)
        pass: process.env.EMAIL_PASS, // Mot de passe ou app password
      },
    });

    // Définir les options de l'email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: subject,
      text: messageContent,
    };

    // Envoyer l'email
    await transporter.sendMail(mailOptions);
    console.log("Email de réponse envoyé avec succès !");
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email :", error);
    throw new Error("Erreur lors de l'envoi de l'email de réponse.");
  }
};

module.exports = sendReplyEmail;
