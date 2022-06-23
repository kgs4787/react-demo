const chatServer = (server) => {
  const io = require('socket.io').listen(server);
  let users = [];

  io.on('connection', (socket) => {
    socket.on('login', ({ user }) => {
      if (user.userId) {
        users.push({
          ...user,
          socketId: socket.id,
        });
      }

      socket.emit('login', {
        user: {
          ...user,
          socketId: socket.id,
        },
      });

      io.emit('updateUsers', {
        users,
      });

      socket.emit('setWindow', {
        user: {
          ...user,
          socketId: socket.id,
        },
      });

      socket.broadcast.emit('updateWindow', {
        user: {
          ...user,
          socketId: socket.id,
        },
      });
    });

    socket.on('logout', ({ user }) => {
      users = users.filter((user) => user.socketId !== socket.id);
      socket.emit('logout');

      io.emit('updateUsers', {
        users,
      });

      socket.broadcast.emit('removeWindow', {
        user: {
          ...user,
          socketId: socket.id,
        },
      });
    });

    socket.on('disconnect', () => {
      users = users.filter((user) => user.socketId !== socket.id);
    });

    socket.on('join', ({ room, user }) => {
      socket.join(room);
      users = users.filter(
        (currentUser) => currentUser.socketId !== user.socketId
      );

      if (user.userId) {
        users.push({
          ...user,
          socketId: socket.id,
          room,
        });
      }

      socket.emit('updateUser', {
        user: {
          ...user,
          socketId: socket.id,
        },
      });

      io.emit('updateUsers', {
        users,
      });

      io.to(room).emit('join', {
        messages: {
          user: {
            ...user,
            socketId: socket.id,
          },
          type: 'info',
          message: `${user.userId}님이 입장했습니다.`,
          images: [],
        },
      });

      socket.broadcast.emit('updateWindow', {
        user: {
          ...user,
          socketId: socket.id,
        },
      });
    });

    socket.on('chat', ({ room, user, type, message, images }) => {
      io.to(room).emit('chat', {
        messages: {
          user,
          type,
          message,
          images,
        },
      });
    });

    socket.on('leave', ({ room, user }) => {
      users = users.map((user) => {
        if (user.socketId === socket.id) {
          user.room = '';
        }
        return user;
      });

      io.emit('updateUsers', {
        users,
      });

      io.to(room).emit('leave', {
        messages: {
          user,
          type: 'info',
          message: `${user.userId}님이 퇴장했습니다.`,
          images: [],
        },
      });

      socket.emit('resetMessages');
      socket.leave(room);
    });

    socket.on('inviteRoom', ({ sender, receiver, room }) => {
      const time = new Date().getTime();

      io.to(receiver.socketId).emit('inviteRoom', {
        sender,
        room,
        time,
      });
    });

    socket.on('chatWindow', ({ sender, receiver, type, message, images }) => {
      const time = new Date().getTime();

      io.to(receiver.socketId).emit('chatWindow', {
        sender,
        type,
        message,
        images,
        time,
      });
    });
  });
};

module.exports = chatServer;
