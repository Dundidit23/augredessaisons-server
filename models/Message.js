// models/Message.js

const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  content: { type: String, required: true },
  read: { type: Boolean, default: false },
  replied: { type: Boolean, default: false },
  repliedAt: { type: Date },
  isSent: { type: Boolean, default: false },
  type: {
    type: String,
    enum: ["received", "reply", "outbound"], // Contraint les valeurs possibles
    default: "received" // Valeur par défaut pour un message entrant
  },
  receivedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  repliedAt: { type: Date }
}, {
  timestamps: true // Ajoute createdAt et updatedAt automatiquement
});

module.exports = mongoose.model("Message", messageSchema);
