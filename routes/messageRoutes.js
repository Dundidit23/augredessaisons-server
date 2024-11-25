// routes/messageRoutes.js

const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");


router.get("/sent", messageController.getSentMessages);

// Route pour créer un nouveau message
router.post("/", messageController.createMessage);
router.post("/sent", messageController.sentMessage);
router.post("/:id/reply", messageController.replyToMessage);


// Route pour récupérer un message spécifique par ID
router.get("/:id", messageController.getMessageById);

// Route pour marquer un message comme lu
router.patch("/:id/read", messageController.markAsRead);

// Route pour marquer un message comme répondu
router.patch("/:id/replied", messageController.markAsReplied);

// Route pour envoyer une réponse et marquer le message comme répondu

// Route pour supprimer un message
router.delete("/:id", messageController.deleteMessage);


// Route pour récupérer tous les messages
router.get("/", messageController.getAllMessages);

module.exports = router;
