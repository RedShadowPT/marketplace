"use strict";
const request = require('request');
const requestJson = require('request-json');
const debug = require('./debuger')('BlockChain');

function jsonRequest(host, port, data, callback, path) {
  path = path || 'json_rpc';
  let uri;
  uri = "http://" + host + ":" + port + "/";
  debug("JSON URI: " + uri + path + " Args: " + JSON.stringify(data));
  let client = requestJson.createClient(uri, { timeout: 300000 });
  client.headers["Content-Type"] = "application/json";
  client.headers["Content-Length"] = data.length;
  client.headers["Accept"] = "application/json";

  client.post(path, data, function (err, res, body) {
    if (err) {
      return callback(err);
    }
    debug("JSON result: " + JSON.stringify(body));
    return callback(body);
  });

}

function rpc(host, port, method, params, callback) {

  let data = {
    id: "0",
    jsonrpc: "2.0",
    method: method,
    params: params
  };
  return jsonRequest(host, port, data, callback);
}

function blockCompare(a, b) {
  if (a.height < b.height) {
    return 1;
  }

  if (a.height > b.height) {
    return -1;
  }
  return 0;
}

function tsCompare(a, b) {
  if (a.ts < b.ts) {
    return 1;
  }

  if (a.ts > b.ts) {
    return -1;
  }
  return 0;
}

module.exports = function () {
  return {
    rpcDaemon: function (method, params, callback) {
      rpc(global.config.daemon.address, global.config.daemon.port, method, params, callback);
    },
    rpcWallet: function (method, params, callback) {
      rpc(global.config.wallet.address, global.config.wallet.port, method, params, callback);
    },
    jsonRequest: jsonRequest,
    blockCompare: blockCompare,
    tsCompare: tsCompare
  };
};
