"use strict";
// Get Config settings
const config = require("../config.js");
global.config = config;

// Define global event emitter
require('events').EventEmitter.prototype._maxListeners = 100;

// Define Global debug settings
global.config.debug = {
  danger: "\x1b[5m\x1b[4m\x1b[41m\x1b[37m Danger:\x1b[0m ",
  warning: "\x1b[45mWarning:\x1b[0m ",
  success: "\x1b[42mSuccess:\x1b[0m ",
  style: {
    //Styles
    Reset: "\x1b[0m",
    Bright: "\x1b[1m",
    Dim: "\x1b[2m",
    Underscore: "\x1b[4m",
    Blink: "\x1b[5m",
    Reverse: "\x1b[7m",
    Hidden: "\x1b[8m",
    // Foreground Colors
    FgBlack: "\x1b[30m",
    FgRed: "\x1b[31m",
    FgGreen: "\x1b[32m",
    FgYellow: "\x1b[33m",
    FgBlue: "\x1b[34m",
    FgMagenta: "\x1b[35m",
    FgCyan: "\x1b[36m",
    FgWhite: "\x1b[37m",
    // Background Colors
    BgBlack: "\x1b[40m",
    BgRed: "\x1b[41m",
    BgGreen: "\x1b[42m",
    BgYellow: "\x1b[43m",
    BgBlue: "\x1b[44m",
    BgMagenta: "\x1b[45m",
    BgCyan: "\x1b[46m",
    BgWhite: "\x1b[47m"
  }
}

/**
 * Load Debugger
 */
var debug = require('../services/debuger')('InitServices');
debug("Loaded local configuration file");
// initiate Database connection
require('../services/dbConnectionServices');

global.mysql.cachedQuery("SELECT * FROM config").then(function (rows) {
  debug("Loading Database configuration table");
  rows.forEach(function (row) {
    if (!global.config.hasOwnProperty(row.module)) {
      global.config[row.module] = {};
    }
    if (global.config[row.module].hasOwnProperty(row.item)) {
      return;
    }
    switch (row.item_type) {
      case 'int':
        global.config[row.module][row.item] = parseInt(row.item_value);
        break;
      case 'string':
        global.config[row.module][row.item] = row.item_value;
        break;
      case 'bool':
        global.config[row.module][row.item] = (row.item_value === "true");
        break;
      case 'float':
        global.config[row.module][row.item] = parseFloat(row.item_value);
        break;
    }
  });
})
  .then(() => {
    debug.success("Database configuration table Loaded into Global Config");
    /**
     * 
     * Config Service has been initialized
     * Will proceed to create API server and Enable Scheduler
     * 
     */

    /** Load API WebServer */
    console.log('Ready for testing...');
    global.support = require('../services/blockchain.js')();
    console.log(global.support)
    debug;
    global.support.rpcDaemon('getlastblockheader', [], function (body) {
      console.log(body)
    });
    // global.support.rpcDaemon('getblockheaderbyheight', {"height": 0}, function (body) {
    //   console.log(body)
    // });
    // global.support.rpcDaemon('getblocktemplate', {
    //   reserve_size: 17, 
    //   wallet_address:''
    // }, function (body) {
    //   console.log(body)
    // });


  }).catch(function (err) {
    debug.error(err);
    if (global.mysql.connection) {
      global.mysql.connection.destroy()
    }
  });
