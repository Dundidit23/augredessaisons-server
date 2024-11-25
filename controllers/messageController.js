// controllers/messageController.js
const Joi = require('joi');
const Message = require("../models/Message"); // Assurez-vous d'avoir un modèle Message
const sendReplyEmail = require("../utils/sendReplyEmail");

const messageSchema = Joi.object({
  name: Joi.string().min(2).required().messages({
    "string.empty": "Le nom est requis.",
    "string.min": "Le nom doit contenir au moins 2 caractères.",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "L'email n'est pas valide.",
    "string.empty": "L'email est requis.",
  }),
  subject: Joi.string().min(3).required().messages({
    "string.empty": "Le sujet est requis.",
    "string.min": "Le sujet doit contenir au moins 3 caractères.",
  }),
  content: Joi.string().min(5).required().messages({
    "string.empty": "Le contenu est requis.",
    "string.min": "Le contenu doit contenir au moins 5 caractères.",
  }),
});

// Fonction pour créer un message
const createMessage = async (req, res) => {
  const { name, email, subject, content } = req.body;
  const newMessage = new Message({
    name,
    email,
    subject,
    content,
    isSent: false, // Message reçu, donc non envoyé
    type: 'received' // Type de message reçu
  });

  try {
    await newMessage.save();
    res.status(201).json({ message: "Message reçu avec succès !", data: newMessage });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement du message :", error);
    res.status(500).json({ error: "Erreur lors de l'enregistrement du message." });
  }
};

// Fonction pour récupérer tous les messages
const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find({ type: 'received' }).sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error("Erreur lors de la récupération des messages :", error);
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
    const message = await Message.findById(id);
    if (!message) return res.status(404).json({ error: "Message non trouvé." });

    if (message.read) {
      return res.status(200).json({ message: "Message déjà marqué comme lu." });
    }

    message.read = true;
    await message.save();

    res.status(200).json({ message: "Message marqué comme lu.", data: message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la mise à jour du message." });
  }
};

// Fonction pour marquer un message comme répondu
const markAsReplied = async (req, res) => {
  const { id } = req.params;
  try {
    const message = await Message.findById(id); // Récupération du message
    if (!message) return res.status(404).json({ error: "Message non trouvé." });

    if (message.replied) {
      return res.status(200).json({ message: "Message déjà marqué comme répondu." });
    }

    // Mise à jour du champ replied
    message.replied = true;
    await message.save(); // Enregistrer les modifications
    res.status(200).json({ message: "Message marqué comme répondu.", data: message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la mise à jour du message." });
  }
};

const replyToMessage = async (req, res) => {
  const { id } = req.params;
  const message = await Message.findById(id);
  if (!message) {
    return res.status(404).json({ error: "Message introuvable" });
  }
  const replyContent = req.body.content;

  try {
    const replyMessage = new Message({
      name: message.name,
      email: message.email,
      subject: `Re: ${message.subject}`,
      content: replyContent,
      isSent: true,
      replied: true,
      type: 'reply'
    });
    await replyMessage.save(); // Enregistrer le message de réponse

    // Mettre à jour le message d'origine
    await Message.findByIdAndUpdate(id, {
      replied: true,
      read: true, // Si vous souhaitez aussi le marquer comme lu
      repliedAt: Date.now()
    });

    res.status(200).json({ success: true, message: "Réponse envoyée avec succès." });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de réponse :", error);
    res.status(500).json({ error: "Erreur lors de l'envoi de la réponse." });
  }
};


const sentMessage = async (req, res) => {
  const { name, email, subject, content } = req.body;
  const newMessage = new Message({
    name,
    email,
    subject,
    content,
    isSent: true, // Message envoyé
    type: 'outbound' // Type de message envoyé
  });

  try {
    await newMessage.save();
    res.status(201).json({ message: "Message envoyé avec succès !", data: newMessage });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement du message :", error);
    res.status(500).json({ error: "Erreur lors de l'enregistrement du message." });
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

const getSentMessages = async (req, res) => {
  try {
    const sentMessages = await Message.find({ isSent: true }).sort({ createdAt: -1 });
    res.status(200).json(sentMessages);
  } catch (error) {
    console.error('Erreur lors de la récupération des messages envoyés:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des messages envoyés.' });
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
  sentMessage,
  getSentMessages
};
