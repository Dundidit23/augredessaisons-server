//userModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  avatar: {
    type: String,
    required: false
  },
  password: {
    type: String,
    required: true
  },
  isOnline: { 
    type: Boolean, 
    default: false // Indique si l'utilisateur est en ligne
  },
  lastActive: { 
    type: Date 
  }
}, {
  timestamps: true // Ajoute des champs createdAt et updatedAt automatiquement
});

const User = mongoose.model('User', userSchema);

module.exports = { User };

