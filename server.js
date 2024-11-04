//server.js
const express = require('express');
const bodyParser = require('body-parser');
//const http = require('http');
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
const adminRoutes = require('./routes/adminRoutes'); 
const messageRoutes = require("./routes/messageRoutes");

const app = express();

// Middleware de CORS
app.use(cors());

// Middleware pour parser les requêtes
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("express"));
app.use(bodyParser.json());

app.get("/", function(req, res) {
    res.send("Welcome to GdS-API");
});




// Configuration de multer pour l'upload de fichiers
const upload = multer({ dest: paths.uploadsDir }); // Destination des fichiers

// Utiliser un chemin statique pour les fichiers uploadés
app.use('/uploads', express.static(paths.uploadsDir));

// Routes
app.use(paths.routes.products, productRoutes);
app.use(paths.routes.categories, categoriesRoutes);
app.use(paths.routes.users, userRoutes);
app.use(paths.routes.admins, adminRoutes);
app.use(paths.routes.messages, messageRoutes);

// Middleware d'erreur
app.use((error, req, res, next) => {
    console.error(error.stack);
    res.status(500).send('Something broke!');
});

// Database connection
connectDB();

// Start server
const port = normalizePort(process.env.PORT || '4000');
//const server = http.createServer(app);
//server.listen(port, () => {
    const server = app.listen(port, () => {
    const addr = server.address();
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    console.log('Server is listening on ' + bind);
});

// Error handling for server startup
server.on('error', (error) => errorHandler(error, port));