export const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('🔌 User connected');

    socket.on('disconnect', () => {
      console.log('❌ User disconnected');
    });
  });

  global.io = io; // attach globally
};
