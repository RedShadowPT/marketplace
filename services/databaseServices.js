const https = require("https");
var debug = require('./debuger')('DatabaseServices');

/** 
 * Function hydrate node object with proxy as JSON object
 *  @param nodes {Nodes Object}
 */
async function hydrateNodesList(nodes) {
  const length = nodes.length;
  for (let index = 0; index < length; index++) {
    const element = nodes[index];
    try {
      element.proxy = JSON.parse(element.proxy);
    } catch (e) {
      console.log("Error parsing: ", element.proxy)
    }
    nodes[index].proxy = element.proxy;
    if (index == length - 1) { return nodes }
  }
}

/** 
 * Function storeNode will save provided Node into Database
 *  @param node {Node Object}
 */
function storeNode(node) {
  var sqlQueryNode = "INSERT INTO nodes (`id`,`provider`, `providerName`, `providerWallet`, `name`, `type`, `cost`, `firstPrePaidMinutes`, `firstVerificationsNeeded`, `subsequentPrePaidMinutes`, `subsequentVerificationsNeeded`, `allowRefunds`, `downloadSpeed`, `uploadSpeed`, `mSpeed`, `mStability`, `disable`, `hash`) VALUES ";

  sqlQueryNode += "('" + node.id + "','"
    + node.provider + "','"
    + node.providerName + "','"
    + node.providerWallet + "','"
    + node.name + "','"
    + node.type + "',"
    + node.cost + ","
    + node.firstPrePaidMinutes + ","
    + node.firstVerificationsNeeded + ","
    + node.subsequentPrePaidMinutes + ","
    + node.subsequentVerificationsNeeded + ","
    + node.allowRefunds + ","
    + node.downloadSpeed + ","
    + node.uploadSpeed + ","
    + node.mSpeed + ","
    + node.mStability + ","
    + node.disable + ",'"
    + node.hash + "') "
    + "ON DUPLICATE KEY UPDATE ";

  sqlQueryNode += "id='" + node.id + "',"
    + "provider='" + node.provider + "',"
    + "providerName='" + node.providerName + "',"
    + "providerWallet='" + node.providerWallet + "',"
    + "name='" + node.name + "',"
    + "type='" + node.type + "',"
    + "cost=" + node.cost + ","
    + "firstPrePaidMinutes=" + node.firstPrePaidMinutes + ","
    + "firstVerificationsNeeded=" + node.firstVerificationsNeeded + ","
    + "subsequentPrePaidMinutes=" + node.subsequentPrePaidMinutes + ","
    + "subsequentVerificationsNeeded=" + node.subsequentVerificationsNeeded + ","
    + "allowRefunds=" + node.allowRefunds + ","
    + "downloadSpeed=" + node.downloadSpeed + ","
    + "uploadSpeed=" + node.uploadSpeed + ","
    + "mSpeed=" + node.mSpeed + ","
    + "mStability=" + node.mStability + ","
    + "disable=" + node.disable + ","
    + "hash='" + node.hash + "';";

  var sqlQueryProxy = " INSERT INTO nodesProxy (`provider`, `port`, `endpoint`) VALUES "
  sqlQueryProxy += "('" + node.provider + "','"
    + node.proxy[0].port + "','"
    + node.proxy[0].endpoint + "') "
    + "ON DUPLICATE KEY UPDATE ";

  sqlQueryProxy += "provider='" + node.provider + "',"
    + "port='" + node.proxy[0].port + "',"
    + "endpoint='" + node.proxy[0].endpoint + "'";;

  /** 
   * Insert or update node details 
   **/
  global.mysql.query(sqlQueryNode)
    .then(function (err, results, rows) {
      if (err.warningCount > 0) {
        debug(global.config.debug.warning + "NODES: SQL Server has returned a Warning, might be due to trying to insert duplicated node")
      } else {
        debug("Saved " + node.providerName + " Node Data to database");
      }
    })
    .catch(function (err) {
      debug(global.config.debug.danger + err);
    });
  /** 
   * Insert or update nodeProxy details 
   **/
  global.mysql.query(sqlQueryProxy)
    .then(function (err, results, rows) {
      if (err.warningCount > 0) {
        debug(global.config.debug.warning + "NODES-Proxy: SQL Server has returned a Warning, might be due to trying to insert duplicated node")
      } else {
        debug("Saved " + node.providerName + " Node Proxy Data to database");
      }
    })
    .catch(function (err) {
      debug(global.config.debug.danger + err);
    });
}
/** 
 * Function storeGeoData will save provided Geo information into Database
 *  @param nodeGeoData {nodeGeo Object} Node Geo data
 */
function storeGeoData(nodeGeoData) {
  // Compose query
  var sqlQuery = "INSERT INTO geolocation (`ip`, `providerName`, `endpoint`, `city`, `region`, `region_code`, `country`, `country_name`, `continent_code`, `in_eu`, `latitude`, `longitude`, `timezone`, `asn`, `org`) VALUES ";
  sqlQuery += "('" + nodeGeoData.ip + "','"
    + nodeGeoData.providerName + "','"
    + nodeGeoData.endpoint + "','"
    + nodeGeoData.city + "','"
    + nodeGeoData.region + "','"
    + nodeGeoData.region_code + "','"
    + nodeGeoData.country + "','"
    + nodeGeoData.country_name + "','"
    + nodeGeoData.continent_code + "',"
    + nodeGeoData.in_eu + ","
    + nodeGeoData.latitude * 10000 + "," // Will store as MEDIUMINT (6bytes) better accuracy
    + nodeGeoData.longitude * 10000 + ",'" // Will store as MEDIUMINT (6bytes) better accuracy
    + nodeGeoData.timezone + "','"
    + nodeGeoData.asn + "','"
    + nodeGeoData.org + "') "
    + "ON DUPLICATE KEY UPDATE ";

  sqlQuery += "ip='" + nodeGeoData.ip + "',"
    + "providerName='" + nodeGeoData.providerName + "',"
    + "endpoint='" + nodeGeoData.endpoint + "',"
    + "city='" + nodeGeoData.city + "',"
    + "region='" + nodeGeoData.region + "',"
    + "region_code='" + nodeGeoData.region_code + "',"
    + "country='" + nodeGeoData.country + "',"
    + "country_name='" + nodeGeoData.country_name + "',"
    + "continent_code='" + nodeGeoData.continent_code + "',"
    + "in_eu=" + nodeGeoData.in_eu + ","
    + "latitude=" + nodeGeoData.latitude * 10000 + "," // Will store as MEDIUMINT (6bytes) better accuracy
    + "longitude=" + nodeGeoData.longitude * 10000 + "," // Will store as MEDIUMINT (6bytes) better accuracy
    + "timezone='" + nodeGeoData.timezone + "',"
    + "asn='" + nodeGeoData.asn + "',"
    + "org='" + nodeGeoData.org + "'";

  // Execute Insert query
  global.mysql.query(sqlQuery)
    .then(function (err, results, rows) {
      if (err.warningCount > 0) {
        debug(global.config.debug.warning + "GEO: SQL Server has returned a Warning, might be due to trying to insert duplicated ID for Node: " + nodeGeoData.endpoint)
      } else {
        debug("Saved Geo Location Data for node: " + nodeGeoData.endpoint);
      }
    })
    .catch(function (err) {
      debug(global.config.debug.danger + err);
    });
};

/** 
 * Function getNodeData get nodes 
 *  @param enableCache {true | false}
 *  @param callback function
 *
 */
function getNodeData(enableCache, callback) {

  return new Promise(function (resolve, reject) {

    var sqlQuery = "Select concat('[', group_concat('{\"endpoint\": \"', nodesProxy.endpoint, '\", \"port\": \"', nodesProxy.port, '\", \"country_code\": \"', geolocation.country, '\", \"country_name\": \"', geolocation.country_name, '\", \"continent_code\": \"', geolocation.continent_code, '\", \"city\": \"', geolocation.city, '\"}'), ']') as proxy, nodes.* from nodes, nodesProxy, geolocation where nodes.provider = nodesProxy.`provider` && nodes.providerName = geolocation.providerName group by nodes.provider";

    sqlQuery = {
      sql: sqlQuery,
      cache: enableCache
    }

    // Execute Select query
    global.mysql.query(sqlQuery)
      .then(function (rows) {
        debug("Got Nodes Data");
        resolve(hydrateNodesList(rows)); // resolve promise
      }).catch((err) => {
        debug(global.config.debug.warning + "Query has returned an Error: " + err)
        reject(err);
      })
      .catch(function (err) {
        debug(global.config.debug.danger + err);
        reject(err);
      });
  })
}


/** 
 * Function getNodeDataByProvider get nodes 
 *  @param enableCache {true | false}
 *  @param providerID Provider id
 *  @param callback function
 *
 */
function getNodeDataByProvider(enableCache, providerID, callback) {
  var sqlQuery = "Select concat('[', group_concat('{\"endpoint\": \"', nodesProxy.endpoint, '\", \"port\": \"', nodesProxy.port, '\", \"country_code\": \"', geolocation.country, '\", \"country_name\": \"', geolocation.country_name, '\", \"continent_code\": \"', geolocation.continent_code, '\", \"city\": \"', geolocation.city, '\"}'), ']') as proxy, nodes.* from nodes, nodesProxy, geolocation where nodes.provider = nodesProxy.`provider` && nodes.providerName = geolocation.providerName &&  nodes.provider LIKE '" + providerID + "'group by nodes.provider";

  sqlQuery = {
    sql: sqlQuery,
    cache: enableCache
  }

  // Execute Select query
  global.mysql.query(sqlQuery)
    .then(function (rows) {
      debug("Got Nodes Data");
      // console.log(rows)
      callback(rows);
    }).catch((err) => {
      debug(global.config.debug.warning + "Query has returned an Error: " + err)
    })
    .catch(function (err) {
      debug(global.config.debug.danger + err);
    });
}


/** 
 * Function getGeoDataArray get Geo location for nodes
 *  @param enableCache {true | false}
 *  @param callback function
 *
 */
async function getGeoDataArray(enableCache, callback) {
  var sqlQuery = {
    sql: "SELECT (geolocation.`latitude` / 10000) as lat, (geolocation.`longitude`/10000) as lng, geolocation.`providerName` as label, geolocation.`country_name` as country_name, geolocation.`city` as city, geolocation.`country` as country_code, geolocation.`endpoint` as endpoint, geolocation.`continent_code` as geo, false as draggable from geolocation",
    cache: enableCache
  }

  // Execute Select query
  global.mysql.query(sqlQuery).then(function (rows) {
    debug("Got Nodes Geo Location Data");
    callback(rows);
  }).catch((err) => {
    debug(global.config.debug.warning + "Query has returned an Error: " + err)
  })
    .catch(function (err) {
      debug(global.config.debug.danger + err);
    });
}

/** 
 * Function getGEObyIPaddress Check if Geo data exists for given IP address
 *  @param enableCache {true | false}
 *  @param callback function
 *
 */
async function getGEObyIPaddress(ipAddress, callback) {
  return new Promise(async function (resolve, reject) {

    var sqlQuery = "SELECT (geolocation.`latitude` / 10000) as lat, (geolocation.`longitude`/10000) as lng, geolocation.`providerName` as label, geolocation.`country_name` as country_name, geolocation.`city` as city, geolocation.`country` as country_code, geolocation.`endpoint` as endpoint, geolocation.`continent_code` as geo, false as draggable from geolocation where geolocation.`ip` LIKE '" + ipAddress + "'";

    sqlQuery = {
      sql: sqlQuery,
      cache: false
    }

    // Execute Select query
    global.mysql.query(sqlQuery).then(function (rows) {
      debug("GEO data in Database for IP: " + ipAddress + (rows.lenght == 0 ? ' was Not Found' : ' was Found'));
      callback(rows);
      resolve(rows);
    }).catch((err) => {
      debug(global.config.debug.warning + "Query has returned an Error: " + err)
      reject(debug(global.config.debug.warning + "Query has returned an Error: " + err))
    })
      .catch(function (err) {
        debug(global.config.debug.danger + err);
        reject(global.config.debug.danger + err)
      });
  })
}

/** 
 * Function Truncate Data Tables
 *
 */
function truncateDataTables() {
  return new Promise(async function (resolve, reject) {
    var sqlQuery = {
      sql: "call dataPurge(@a)",
      cache: false
    }

    // Execute Select query
    global.mysql.query(sqlQuery).then(function (mySQLReturn) {
      debug("Data Tables Purged Data!");
      resolve(mySQLReturn);
    }).catch((err) => {
      debug(global.config.debug.warning + "Query has returned an Error: " + err)
      reject(err)
    })
      .catch(function (err) {
        debug(global.config.debug.danger + err);
        reject(err)
      });
  })
}

/** 
 * Function get User
 * @param email {user email}
 */
function getUser(email) {
  return new Promise(async function (resolve, reject) {
    var sqlQuery = {
      sql: "SELECT * from users WHERE email LIKE '" + email + "' && isEnabled = 1",
      cache: false
    }

    // Execute Select query
    global.mysql.query(sqlQuery).then(function (mySQLReturn) {
      resolve(mySQLReturn);
    }).catch((err) => {
      debug(global.config.debug.warning + "Query has returned an Error: " + err)
      reject(err)
    })
      .catch(function (err) {
        debug(global.config.debug.danger + err);
        reject(err)
      });
  })
}

/** 
 * Function get all Users
 */
function getUsers() {
  return new Promise(async function (resolve, reject) {
    var sqlQuery = {
      sql: "SELECT * FROM users",
      cache: false
    }

    // Execute Select query
    global.mysql.query(sqlQuery).then(function (mySQLReturn) {
      resolve(mySQLReturn);
    }).catch((err) => {
      debug(global.config.debug.warning + "Query has returned an Error: " + err)
      reject(err)
    })
      .catch(function (err) {
        debug(global.config.debug.danger + err);
        reject(err)
      });
  })
}

/** 
 * Function Store or Update User
 * @param user {user Object}
 */
function storeUpdateUser(user) {
  return new Promise(async function (resolve, reject) {
    var sqlQuery = {
      sql: "INSERT INTO users (`id`,`email`,`password`,`displayName`,`isAdmin`, `isEnabled`) VALUES (null,'"
        + user.email + "','"
        + user.password + "','"
        + user.displayName + "',"
        + user.isAdmin + ","
        + user.isEnabled + ")"
        + "ON DUPLICATE KEY UPDATE "
        + "email='" + user.email + "',"
        + "password='" + user.password + "',"
        + "displayName='" + user.displayName + "',"
        + "isAdmin=" + user.isAdmin + ","
        + "isEnabled=" + user.isEnabled + ";",
      cache: false
    }

    // Execute Select query
    global.mysql.query(sqlQuery).then(function (mySQLReturn) {
      resolve(mySQLReturn);
    }).catch((err) => {
      debug(global.config.debug.warning + "Query has returned an Error: " + err)
      reject(err)
    })
      .catch(function (err) {
        debug(global.config.debug.danger + err);
        reject(err)
      });
  })
}

/** 
 * Function Delete User Credentials
 * @param email {user email}
 */
function deleteUser(email) {
  return new Promise(async function (resolve, reject) {
    var sqlQuery = {
      sql: "Delete from users WHERE email LIKE '" + email + "'",
      cache: false
    }

    // Execute Select query
    global.mysql.query(sqlQuery).then(function (mySQLReturn) {
      resolve(mySQLReturn);
    }).catch((err) => {
      debug(global.config.debug.warning + "Query has returned an Error: " + err)
      reject(err)
    })
      .catch(function (err) {
        debug(global.config.debug.danger + err);
        reject(err)
      });
  })
}

/** 
 * Function get Config
 */
function getConfig() {
  return new Promise(async function (resolve, reject) {
    var sqlQuery = {
      sql: "SELECT * FROM config",
      cache: false
    }

    // Execute Select query
    global.mysql.query(sqlQuery).then(function (mySQLReturn) {
      resolve(mySQLReturn);
    }).catch((err) => {
      debug(global.config.debug.warning + "Query has returned an Error: " + err)
      reject(err)
    })
      .catch(function (err) {
        debug(global.config.debug.danger + err);
        reject(err)
      });
  })
}
/** 
 * Module Exports
 */
module.exports = {
  storeNode: storeNode,
  storeGeoData: storeGeoData,
  getNodeData: getNodeData,
  getNodeDataByProvider: getNodeDataByProvider,
  getGEObyIPaddress: getGEObyIPaddress,
  getGeoDataArray: getGeoDataArray,
  truncateDataTables: truncateDataTables,
  getUser: getUser,
  getUsers: getUsers,
  storeUpdateUser: storeUpdateUser,
  deleteUser: deleteUser,
  getConfig: getConfig
}