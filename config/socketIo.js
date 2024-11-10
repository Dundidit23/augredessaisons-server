const socketIo = require('socket.io');
const { User } = require('../models/userModel');  // Assurez-vous d'importer votre modèle User

let onlineUsers = {};

const configureSocketIo = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('Un utilisateur est connecté avec id:', socket.id);

    // Lorsque l'utilisateur se connecte, on l'ajoute en ligne
    socket.on('userOnline', async (userId) => {
      if (!onlineUsers[userId]) {
        onlineUsers[userId] = socket.id;
        console.log(`${userId} est maintenant en ligne`);

        // Mettre à jour l'état de l'utilisateur dans la base de données
        try {
          await User.findByIdAndUpdate(userId, { isOnline: true, lastActive: new Date() });

          // Émettre les événements pour la mise à jour du statut de l'utilisateur
          io.emit('updateUserStatus', { userId, status: 'online' });
          io.emit('message', { text: `${userId} est connecté` }); // Message pour tous
        } catch (err) {
          console.error('Erreur lors de la mise à jour du statut de l\'utilisateur:', err);
        }
      } else {
        console.log(`${userId} est déjà en ligne`);
      }
    });

    // Lorsque l'utilisateur se déconnecte, on le marque comme hors ligne
    socket.on('disconnect', async () => {
      let disconnectedUserId = null;
      for (let userId in onlineUsers) {
        if (onlineUsers[userId] === socket.id) {
          disconnectedUserId = userId;
          break;
        }
      }

      if (disconnectedUserId) {
        delete onlineUsers[disconnectedUserId];
        console.log(`${disconnectedUserId} est hors ligne`);

        // Mettre à jour l'état de l'utilisateur dans la base de données
        try {
          await User.findByIdAndUpdate(disconnectedUserId, { isOnline: false });

          // Émettre les événements pour la mise à jour du statut de l'utilisateur
          io.emit('status_update', { userId: disconnectedUserId, status: 'offline' });
          io.emit('message', { text: `${disconnectedUserId} est déconnecté` }); // Message pour tous
        } catch (err) {
          console.error('Erreur lors de la mise à jour du statut de l\'utilisateur:', err);
        }
      }
    });

    // Gestion des erreurs de socket
    socket.on('error', (err) => {
      console.error('Erreur de socket:', err);
    });
  });

  return io;
};

module.exports = configureSocketIo;
