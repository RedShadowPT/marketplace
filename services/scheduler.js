module.exports = function () {
  const debug = require('./debuger')('Scheduler');

  /** 
   * Load Application Services
  */

  const nodesService = require('./nodesServices');
  const databaseService = require('./databaseServices');
  const geoServices = require('./geoServices');
  const coinServices = require('./coinServices');

  // Control variables
  let workInProgress = false;
  const dbVersion = (global.config.global.dbVersion !== 'undefined' ? global.config.global.dbVersion : 1);

  function getNodesData(callback) {
    nodesService.fetchNodes()
      .then((data) => {
        const nodes = JSON.parse(data);
        if (nodes.protocolVersion === '2') {
          callback(nodes.providers);
        } else {
          new Error(debug.error(global.config.debug.danger + ' Source Protocol version has changed, may break stuff!'));
        }
      })
      .catch((error) => {
        new Error(debug.error(global.config.debug.danger + ' Connecting to Nodes API: ' + error));
      });
  }

  async function getGeoLocationForNodes(nodes) {
    await geoServices.getGeoLocationForNodes(nodes, (geoData) => {
    }).then((data) => {
      debug('Checking Geo Location for nodes')
    }).catch((error) => {
      new Error(debug.error(global.config.debug.danger + ' Connecting to Geo API: ' + error))
    });
  }

  function NodesScheduler() {
    if (!workInProgress) {
      debug("Start fetching Nodes");
      workInProgress = true;
      getNodesData((nodes => {
        if (nodes.length > 0) {
          debug.success("Got " + nodes.length + " Fresh Nodes");
          getGeoLocationForNodes(nodes);
          nodes.forEach(node => {
            databaseService.storeNode(node);
          });
        }
        workInProgress = false;
      }))
      coinServices.fetchCoinData().then(coinData => {
        coinServices.setCoinDataIntoCache(coinData);
      }).catch(err => debug.error(err));
    }
    debug("Scheduler will be sleeping for " + global.config.scheduler.fetchNodeDataEvery + " minute(s)");
    setTimeout(function () {
      debug("Going to restart: fetching Nodes");
      NodesScheduler();
    }, global.config.scheduler.fetchNodeDataEvery * 1000 * 60); // DB Value in minutes
  };

  function dataMaintenance() {
    // only supported on dbVersion 2
    if (dbVersion >= 2) {
      debug.warning("Data Maintenance is starting...");
      // for now only clear database
      databaseService.truncateDataTables().then(val => { NodesScheduler() });
      setTimeout(function () {
        debug.warning('Data Maintenance will restart!')
        dataMaintenance();
      }, global.config.scheduler.purgeDataEvery * 1000 * 60 * 60); // DB value in hours
    }
  }
  // Init
  NodesScheduler();
 // dataMaintenance();
}