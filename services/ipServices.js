var debug = require('./debuger')('IPServices');
const util = require('./utlities');
// Require database functions
const databaseService = require('./databaseServices');

const { Resolver } = require('dns').promises;
const resolver = new Resolver();
resolver.setServers([global.config.global.dnsServer1, global.config.global.dnsServer2]);

/** Check if given string is an IP address */
function ValidateIPaddress(valueToCheck) {
  if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(valueToCheck)) {
    return (true)
  }
  return (false)
};

/**
 * DNS Resolve FQDN to IP
 */
async function delayedDNSResolver(fqdn) {
  return (async function () {
    const addresses = await resolver.resolve4(fqdn);
    debug('Resolved FQDN "' + fqdn + '" to IP address ' + addresses)
    return addresses;
  })();
};

/** 
 * Check if given  valueToCheck is an IP address or FQDN 
 *  @output: if valueToCheck is IP then return IP
 *           if valueToCheck is FQDN then DNS resolve and return an array with all IPs
*/
async function isFQDNorIP(valueToCheck) {
  let returnIP = []
  if (await ValidateIPaddress(valueToCheck)) {
    returnIP = [valueToCheck];
  } else {
    if (typeof valueToCheck === 'string') {
      await delayedDNSResolver(valueToCheck).then(resolvedIP => {
        // console.log("Got IP: ",resolvedIP, " for => ", valueToCheck)
        util.flattenArray(resolvedIP).then(flatArray => returnIP = flatArray )
      })
    }
  }
  return returnIP
}

//** Create a flat Array of JSON Object for NEW Nodes */
async function flatNewNodesEndpoint(newNodes) {
  let newProxy = [];
  for (ii = 0; ii < newNodes.length; ii++) {
    let _newEndpoint = newNodes[ii].proxy;
    _newEndpoint = util.flattenArray(_newEndpoint)

    for (i = 0; i < _newEndpoint.length; i++) {
      newProxy.push({ providerName: newNodes[ii].providerName, endpoint: _newEndpoint[i].endpoint });
    }
  }

  return newProxy;
}

/** Create a Flat Array of objects for the Nodes in Database and Compare with flat New Nodes array */
async function compareStoredGeo(storedNodes, newNodes) {
  const newEndpoints = await flatNewNodesEndpoint(newNodes)
  let storedEndpoints = [];

  for (i = 0; i < storedNodes.length; i++) {
    storedEndpoints.push({ providerName: storedNodes[i].label, endpoint: storedNodes[i].endpoint })
  }

  let onlyNew = newEndpoints.filter(util.comparer(storedEndpoints))
  let onlyStored = storedEndpoints.filter(util.comparer(newEndpoints));
  return onlyNew.concat(onlyStored);
}

/** make a clean list for IPs for GeoLocation request */
async function sortIpListforGeoLocation(nodesList, callback) {
  let length = nodesList.length;
  let fetchedGeoIpAddresses = [];
  debug('Got ' + nodesList.length + ' New Nodes');
};

module.exports = {
  sortIpListforGeoLocation: sortIpListforGeoLocation,
  ValidateIPaddress: ValidateIPaddress,
  isFQDNorIP:isFQDNorIP,
  resolver: resolver
}