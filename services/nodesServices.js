var debug = require('./debuger')('NodesServices');
const util = require('../services/utlities');

/** Get get All Nodes */
function fetchNodes() {
  debug("Connecting to Backend API for Nodes: ");

  return new Promise(function (resolve, reject) {
    return util.getContent(global.config.nodeAPI.url)
      .then((nodesList) => {
        resolve(nodesList);
      }).catch((error) => {
        reject(error);
      });
  });
};

module.exports = {
  fetchNodes: fetchNodes
}
