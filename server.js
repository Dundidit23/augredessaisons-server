const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv').config();
const path = require('path'); // Import the path module
const paths = require('./config/paths');
const multer = require('multer');
const connectDB = require('./config/db');
const normalizePort = require('./config/normalizePort');
const errorHandler = require('./config/errorHandler');
const productRoutes = require('./routes/productRoutes');
const categoriesRoutes = require('./routes/categoriesRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware de CORS
app.use(cors());

// Middleware pour parser les requêtes
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("express"));

// default URL for website
app.get("/api/welcome", (req, res) => {
    res.status(200).send({message: "Welcome to GdS-API" });
});
app.use('/', (req,res) =>{
    res.sendFile(path.join(__dirname, '/index.html'));
    //__dirname : It will resolve to your project folder.
  });


// Database connection
connectDB();

// Configuration de multer pour l'upload de fichiers
const upload = multer({ dest: paths.uploadsDir }); // Destination des fichiers

// Utiliser un chemin statique pour les fichiers uploadés
app.use('/uploads/', express.static(paths.uploadsDir));

// Routes
app.use(paths.routes.products, productRoutes);
app.use(paths.routes.categories, categoriesRoutes);
app.use(paths.routes.users, userRoutes); // Ajouter les routes utilisateurs

// Middleware d'erreur
app.use((error, req, res, next) => {
    console.error(error.stack);
    res.status(500).send('Something broke!');
});

// Start server
const port = normalizePort(process.env.PORT || '5000');
const server = http.createServer(app);
server.listen(port, () => {
    const addr = server.address();
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    console.log('Listening on ' + bind);
});

// Error handling for server startup
server.on('error', (error) => errorHandler(error, port));