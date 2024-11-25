//server.js
const express = require('express');
const Stripe = require('stripe');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
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
const http = require('http'); 
const configureSocketIo = require('./config/socketIo'); // Importer votre configuration Socket.IO
const jwt = require('jsonwebtoken');
const app = express();

// Middleware de CORS
app.use(cors({
    origin: 'http://localhost:5173', // Remplacez par l'URL de votre frontend
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});


// Middleware pour parser les requêtes
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("express"));
app.use(bodyParser.json());

app.get("/", function(req, res) {
    res.send("Welcome to GdS-API");
});




// Configuration de multer pour l'upload de fichiers
const upload = multer({ dest: paths.uploadsDir });
app.use('/uploads', express.static(paths.uploadsDir));

// Routes
app.use(paths.routes.products, productRoutes);
app.use(paths.routes.categories, categoriesRoutes);
app.use(paths.routes.users, userRoutes);
app.use(paths.routes.admins, adminRoutes);
app.use(paths.routes.messages, messageRoutes);

console.log(`Routes définies : ${paths.routes.messages}`);
// Middleware d'erreur
app.use((error, req, res, next) => {
    console.error(error.stack);
    res.status(500).send('Something broke!');
});

app.post('/create-payment-intent', async (req, res) => {
    const { amount } = req.body;
  
    try {
      // Créer un PaymentIntent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount, // Montant en cents
        currency: 'eur', // La devise
      });
  
      // Renvoyer le client secret au frontend
      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: error.message });
    }
  });

// Database connection
connectDB();

// Start server
const port = normalizePort(process.env.PORT || '4000');
const server = http.createServer(app); // Créer le serveur HTTP

const io = configureSocketIo(server); // Configurer Socket.IO en utilisant le serveur

server.listen(port, () => {
    const addr = server.address();
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    console.log('Server is listening on ' + bind);
});

// Error handling for server startup
server.on('error', (error) => errorHandler(error, port));