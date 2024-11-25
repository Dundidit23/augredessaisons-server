const mongoose = require("mongoose");
const Message = require("../models/Message"); // Ajustez le chemin si nécessaire
const dotenv = require('dotenv');

// Charger le fichier .env
dotenv.config();

(async () => {
  try {
    // Connectez-vous à votre base de données
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connexion à la base de données réussie.");

    // Mise à jour des messages existants
    await Message.updateMany(
      { isSent: false }, // Pour les messages reçus
      { $set: { type: "received" } }
    );

    await Message.updateMany(
      { replied: true }, // Pour les réponses envoyées
      { $set: { type: "reply" } }
    );

    await Message.updateMany(
      { isSent: true, replied: false }, // Pour les messages envoyés non liés à une réponse
      { $set: { type: "outbound" } }
    );

    console.log("Mise à jour des messages terminée !");
  } catch (err) {
    console.error("Erreur lors de la mise à jour :", err);
  } finally {
    // Fermez la connexion à la base de données
    await mongoose.connection.close();
    process.exit();
  }
})();
