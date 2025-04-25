const socketIO = require('socket.io');

const configureSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected');

    // Join product room
    socket.on('joinProduct', (productId) => {
      socket.join(`product_${productId}`);
      console.log(`Client joined product room: ${productId}`);
    });

    // Leave product room
    socket.on('leaveProduct', (productId) => {
      socket.leave(`product_${productId}`);
      console.log(`Client left product room: ${productId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return io;
};

module.exports = configureSocket; 