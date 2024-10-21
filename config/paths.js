// config/paths.js
const path = require('path');

// Définit la base du répertoire du projet
const rootDir = path.resolve(__dirname, '..');

module.exports = {
    rootDir,
    uploadsDir: path.join(rootDir, 'uploads/'),
    routes: {
        products: '/api/products',
        categories: '/api/categories',
        users: '/api/users'
    }
};
