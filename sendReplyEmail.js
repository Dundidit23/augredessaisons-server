// sendReplyEmail.js

const nodemailer = require("nodemailer");

// Fonction pour envoyer un email de réponse à l'utilisateur
async function sendReplyEmail(userEmail, subject, message) {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail", // ou un autre service d'email, comme Yahoo, Outlook, etc.
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: subject,
      text: message,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email envoyé avec succès !");
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email :", error);
  }
}

module.exports = sendReplyEmail;
