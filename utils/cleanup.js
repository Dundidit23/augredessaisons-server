// cleanup.js (dans config ou utils)
const mongoose = require('mongoose');
const User = require('../models/userModel'); // Assurez-vous que le chemin est correct

// Connexion à MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/votre_base_de_donnees', {
    });
    console.log('Connecté à MongoDB');
  } catch (error) {
    console.error('Erreur de connexion à MongoDB:', error);
    process.exit(1);
  }
};

// Script pour supprimer le champ `statut` de tous les utilisateurs
const removeStatutField = async () => {
  try {
    const result = await User.updateMany({}, { $unset: { statut: "" } });
    console.log(`${result.modifiedCount} documents mis à jour.`);
  } catch (error) {
    console.error('Erreur lors de la suppression du champ statut:', error);
    console.log('User:', User);
console.log('User.updateMany:', User.updateMany)
  }
};

// Exécuter le script
const runScript = async () => {
  await connectDB();
  await removeStatutField();
  mongoose.connection.close(); // Fermer la connexion
};

runScript();
