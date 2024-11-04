// routes/messageRoutes.js

const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");

// Route pour créer un nouveau message
router.post("/", messageController.createMessage);

// Route pour récupérer tous les messages
router.get("/", messageController.getAllMessages);

// Route pour récupérer un message spécifique par ID
router.get("/:id", messageController.getMessageById);

// Route pour marquer un message comme lu
router.patch("/:id/read", messageController.markAsRead);

// Route pour marquer un message comme répondu
router.patch("/:id/replied", messageController.markAsReplied);

// Route pour envoyer une réponse et marquer le message comme répondu
router.post("/:id/reply", messageController.replyToMessage);

// Route pour supprimer un message
router.delete("/:id", messageController.deleteMessage);

module.exports = router;
