// server/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    validate: {
      validator: function(v) {
        return v >= 0;
      },
      message: 'Price must be a non-negative number.',
    },
  },
  image: {
    data: Buffer,
    type: String, // Stocke le chemin de l'image (ex: "uploads/image.png")
    required: false,
  },
  category: {
    type: String, // Référence la collection Category
    required: false,
  },
  stock: {
    type: Number,
    required: true,
    validate: {
      validator: function(v) {
        return v >= 0;
      },
      message: 'Stock must be a non-negative number.',
    },
  },
}, { timestamps: true });

// Méthode pour formater le prix avec la devise et le séparateur des milliers
productSchema.methods.formatPrice = function() {
  return this.price.toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  });
};

module.exports = mongoose.model('Product', productSchema);
