/** WebSocket Functions */
module.exports = function (io) {

  var module = {};
  var connections = [];

  module = function (session, message) {
    console.log("Checking for Socket.io Service Setup")
    if (io) {
      io.sockets.on('connection', function (client) {
        connections.push(client)
        var connectionStatus = 'WebSockets]: Connected:' + connections.length + 'sockets connected';
        console.log(connectionStatus);
        client.emit('message', JSON.stringify({ message: connectionStatus, status: 200 }))

        // on Disconnect
        client.on('disconnect', function (data) {
          connections.splice(connections.indexOf(client), 1);
          console.log('[WebSockets]: Disconnected: %s sockets connected', connections.length);
        });

        client.on('new message', function (data) {
          // relay message back
          client.emit('message', { message: data })
          console.log(data);
        })



        // client.emit(session, JSON.stringify(message));
        // console.log("WS: send to Session: " + session + ' MESSAGE: ' + JSON.stringify(message));
      });

    } else {
      console.log("ERROR Socket IO not Defined!")
    }
  }

  module.emitMessage = function (session, message) {
    if (session) {
      if (io) {
        io.sockets.on('connection', function (client) {
          connections.push(client)
          console.log('[WebSockets]: Connected: %s sockets connected', connections.length);

          // on Disconnect
          client.on('disconnect', function (data) {
            connections.splice(connections.indexOf(client), 1);
            console.log('[WebSockets]: Disconnected: %s sockets connected', connections.length);
          });

          client.on('Send message', function (data) {
            // relay message back
            io.sockets.emit('new message', { msg: data })
            console.log(data);
          })

          client.emit(session, JSON.stringify(message));
          console.log("WS: send to Session: " + session + ' MESSAGE: ' + JSON.stringify(message));

        });


      }
    }
  };

  module.sendWsMessage = function (session, message) {
    // console.log('Sending Websocket message to: ' + session)
    io.sockets.emit(session, message);
  }

  return module;
};
