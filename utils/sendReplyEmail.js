// utils/sendReplyEmail.js

const nodemailer = require("nodemailer");
const Message = require("../models/Message");

const sendReplyEmail = async (recipientEmail, subject, replyContent, messageId) => {
  try {
    // Configurer le transporteur avec vos informations de messagerie
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Définir les options de l'email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: `Réponse à votre message : ${subject}`,
      text: replyContent,
    };

    // Envoyer l'email
    await transporter.sendMail(mailOptions);
    console.log("Email de réponse envoyé avec succès !");
    
    // Marquer le message comme envoyé dans la base de données
    await Message.findByIdAndUpdate(messageId, { isSent: true });
    console.log("Message marqué comme envoyé dans la base de données");
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email :", error);
    throw new Error("Erreur lors de l'envoi de l'email de réponse.");
  }
};

module.exports = sendReplyEmail;
