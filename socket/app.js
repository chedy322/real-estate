
const server = require('http').createServer();
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:5173'
  }
});
const port = 3000;
server.listen(port);
// list all the connected users
let connectedUsers = [];

// add connected user to the list
const addUser = (userId, socketId) => {
  const existingUser = connectedUsers.find(user => user.userId === userId);
  if (!existingUser) {
    connectedUsers.push({ userId, socketId });
  }
};

const getUser = (receiverId) => {
  return connectedUsers.find((user) => user.userId === receiverId);
};

const removeUser = (socketId) => {
  connectedUsers = connectedUsers.filter((user) => user.socketId !== socketId);
};

console.log('listening');
io.on('connection', (socket) => {
  socket.on('new user', (userId) => {
    addUser(userId, socket.id);
    console.log('Connected Users:', connectedUsers);
  });

  socket.on('sendMessage', ({ receiverId, data}) => {
    let notification=0
    console.log(receiverId)
    const receiver = getUser(receiverId._id);
    // error here nned to fix it
    console.log("receiver"+receiver)
    if (receiver) {
      // added the notification
      console.log("hey")
      console.log(receiver.socketId)
      notification=notification+1
      io.to(receiver.socketId).emit('getMessage',data,notification);
    }
  });

  socket.on('disconnect', () => {
    removeUser(socket.id);
    console.log('User disconnected:', socket.id);
    console.log('Connected Users:', connectedUsers);
  });
});
