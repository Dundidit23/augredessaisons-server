const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
     type: String,
     enum: ['customer', 'admin'],
     default: 'customer' 
  },
  statut: {
    type: String,
    enum: ['online', 'offline'],
    default: 'offline' 
 },
  avatar: {
    type: String,
    required: false,
  },
  password: String,
  profilePic: String
},{
     timestamps: true  
    // timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'  }}
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
