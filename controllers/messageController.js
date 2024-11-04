// controllers/messageController.js

const Message = require("../models/Message"); // Assurez-vous d'avoir un modèle Message
const sendReplyEmail = require("../utils/sendReplyEmail");

// Fonction pour créer un message
const createMessage = async (req, res) => {
  const { name, email, content } = req.body;

  try {
    const message = await Message.create({ name, email, content, read: false, replied: false });
    res.status(201).json({ message: "Message reçu avec succès !", data: message });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la création du message." });
  }
};

// Fonction pour récupérer tous les messages
const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }); // triés par date de création
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des messages." });
  }
};

// Fonction pour récupérer un message spécifique par ID
const getMessageById = async (req, res) => {
  const { id } = req.params;

  try {
    const message = await Message.findById(id);
    if (!message) return res.status(404).json({ error: "Message non trouvé." });
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération du message." });
  }
};

// Fonction pour marquer un message comme lu
const markAsRead = async (req, res) => {
  const { id } = req.params;

  try {
    const message = await Message.findByIdAndUpdate(id, { read: true }, { new: true });
    if (!message) return res.status(404).json({ error: "Message non trouvé." });
    res.status(200).json({ message: "Message marqué comme lu.", data: message });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour du message." });
  }
};

// Fonction pour marquer un message comme répondu
const markAsReplied = async (req, res) => {
  const { id } = req.params;

  try {
    const message = await Message.findByIdAndUpdate(id, { replied: true }, { new: true });
    if (!message) return res.status(404).json({ error: "Message non trouvé." });
    res.status(200).json({ message: "Message marqué comme répondu.", data: message });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour du message." });
  }
};

// Fonction pour envoyer une réponse et marquer le message comme répondu
const replyToMessage = async (req, res) => {
  const { id } = req.params;
  const { subject, responseContent } = req.body;

  try {
    const message = await Message.findById(id);
    if (!message) return res.status(404).json({ error: "Message non trouvé." });

    // Envoyer l'email de réponse
    await sendReplyEmail(message.email, subject, responseContent);

    // Marquer le message comme répondu
    message.replied = true;
    await message.save();

    res.status(200).json({ message: "Réponse envoyée et message marqué comme répondu." });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'envoi de la réponse." });
  }
};

// Fonction pour supprimer un message
const deleteMessage = async (req, res) => {
  const { id } = req.params;

  try {
    const message = await Message.findByIdAndDelete(id);
    if (!message) return res.status(404).json({ error: "Message non trouvé." });
    res.status(200).json({ message: "Message supprimé avec succès." });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la suppression du message." });
  }
};

module.exports = {
  createMessage,
  getAllMessages,
  getMessageById,
  markAsRead,
  markAsReplied,
  replyToMessage,
  deleteMessage,
};
