const socketIO = require('socket.io');

const configureSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: ['http://localhost:5000', 'http://localhost:5173','http://192.168.5.91:5173'],
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('✅ New client connected:', socket.id);

    socket.on("joinProduct", (productId) => {
      socket.join(`product_${productId}`);
      console.log(`Client ${socket.id} joined room: product_${productId}`);
    });
  
    socket.on("joinUserRoom", (userId) => {
      socket.join(`user_${userId}`);
      console.log(`Client ${socket.id} joined room: user_${userId}`);
    });
    socket.on('leaveUserRoom', (userId) => {
      socket.leave(`user_${userId}`);
    });
    socket.on("leaveProduct", (productId) => {
      socket.leave(`product_${productId}`);
    });
  
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
};

module.exports = configureSocket; 