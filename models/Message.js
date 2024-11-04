// models/Message.js

const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  content: { type: String, required: true },
  read: { type: Boolean, default: false },
  replied: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", messageSchema);
