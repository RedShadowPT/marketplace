/** Debugger Function */
module.exports = function (service) {
  var module = {};
  var isSocketEnabled = (global.io ? true : false);
  io = global.io;

  if (isSocketEnabled) {
    console.log('SUCCESS: Socket.io is Listening!')
  }else {
    console.log('WARNING: Socket.io is Off-Line!')
  }

  module = function (message) {
    module.log(message);
  }

  module.sendWsMessage = function (service, message, status = 200) {
    if (isSocketEnabled) {
      const wsMessage = {
        message: message,
        status: status
      }
      global.io.sendWsMessage(service, wsMessage);
    }
  }

  module.log = function (message) {
    message = global.config.debug.style.Bright
      + global.config.debug.style.FgYellow + '['
      + global.config.debug.style.FgCyan
      + service
      + global.config.debug.style.FgYellow + ']'
      + global.config.debug.style.Reset
      + " : "
      + message;
    module.sendWsMessage('message', message, 200);
    console.log(message);
    return message;
  }

  module.error = function (message) {
    message = global.config.debug.style.Bright
      + global.config.debug.style.FgYellow + '['
      + global.config.debug.style.BgRed
      + global.config.debug.style.FgWhite
      + service
      + global.config.debug.style.BgBlack
      + global.config.debug.style.FgYellow + ']'
      + global.config.debug.style.Reset
      + " : "
      + message;
    module.sendWsMessage('message', message, 500);
    console.error(message);
    return message;
  }

  module.success = function (message) {
    message = global.config.debug.style.Bright
      + global.config.debug.style.FgYellow + '['
      + global.config.debug.style.FgCyan
      + service
      + global.config.debug.style.FgYellow + ']'
      + global.config.debug.style.Reset
      + " : "
      + global.config.debug.success
      + " : "
      + message;
    module.sendWsMessage('message', message, 201);
    console.log(message);
    return message;
  }

  module.danger = function (message) {
    message = global.config.debug.style.Bright
      + global.config.debug.style.FgYellow + '['
      + global.config.debug.style.FgCyan
      + service
      + global.config.debug.style.FgYellow + ']'
      + global.config.debug.style.Reset
      + " : "
      + global.config.debug.danger
      + ": "
      + message;
    module.sendWsMessage('message', message, 502);
    console.log(message);
    return message;
  }

  module.warning = function (message) {
    message = global.config.debug.style.Bright
      + global.config.debug.style.FgYellow + '['
      + global.config.debug.style.FgCyan
      + service
      + global.config.debug.style.FgYellow + ']'
      + global.config.debug.style.Reset
      + " : "
      + global.config.debug.warning
      + ": "
      + message;
    module.sendWsMessage('message', message, 503);
    console.log(message);
    return message;
  }


  return module;
};
