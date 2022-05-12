const socket = require("socket.io");

function createSocket(http) {
  const io = socket(http);

  io.on("connection", function (socket) {
    socket.join(socket.handshake.query.id)
    // socket.on('DIALOGS:JOIN', (dialogId: string) => {
    //     socket.dialogId = dialogId;
    //     socket.join(dialogId);
    // });
    // socket.on('DIALOGS:TYPING', (obj: any) => {
    //     socket.broadcast.emit('DIALOGS:TYPING', obj);
    // });
    // console.log(socket.handshake.query.token)
    // console.log(
    //   "комната/ Пользователь",
    //   socket.id,
    //   socket.handshake.query.id
    // );

   // socket.leave(socket.handshake.query.id);

  });


  return io;
}

module.exports = createSocket;
