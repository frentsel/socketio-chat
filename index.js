var io = require('socket.io').listen(8080);

io.sockets.on('connection', (socket, username) => {

  socket.emit('message', {
    username: 'System',
    message: 'You are connected!'
  });

  socket.broadcast.emit('message', {
    username: 'System',
    message: 'Another client has just connected!'
  });

  socket.on('put', (obj) => socket.broadcast.emit('put', obj));

  socket.on('login', (username) => socket.username = username);

  socket.on('message', (message) => {
    console.log('message: ', message);
    socket.emit('message', { username: socket.username, message });
    socket.broadcast.emit('message', { username: socket.username, message });
  });
});
