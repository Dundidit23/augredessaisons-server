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
    status: {
      type: String,
      enum: ['online', 'offline'],
      default: 'offline',
   },
    isOnline: { type: Boolean, default: false },
    lastActive: { type: Date }

},{
     timestamps: true  
    // timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'  }}
});

const User = mongoose.model('User', userSchema);

module.exports = { User };
