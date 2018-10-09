const https = require("https");
var debug = require('./debuger')('GeoServices');
const util = require('./utlities');

// IP and DNS Services
const ipServices = require('../services/ipServices');

// Database Services
const databaseService = require('../services/databaseServices');

/** Get IP Location for given IP */
function getIPLocation(ipAddress) {
  debug("Getting 'fresh' Geo data for IP: " + ipAddress);
  return new Promise(function (resolve, reject) {
    return util.getContent(global.config.geoAPI.url + ipAddress + "/json/").then((ipGeoData) => {
      resolve(JSON.parse(ipGeoData));
    }).catch((error) => {
      reject(error);
    });
  });
};

/** GetIPLocation Bulk */
async function getGeoLocationForNodes(nodesList, callback) {
  return new Promise(async function (resolve, reject) {

    for (i = 0; i < nodesList.length; i++) {
      let providerName = nodesList[i].providerName;
      for (p = 0; p < nodesList[i].proxy.length; p++) {
        let endpoint = nodesList[i].proxy[p].endpoint;
        let endpointAddress = await ipServices.isFQDNorIP(nodesList[i].proxy[p].endpoint)
        for (e = 0; e < endpointAddress.length; e++) {
          databaseService.getGEObyIPaddress(endpointAddress.toString(), async function (data) {
            // if returned data is empy then get location and store
            if (data.length == 0) {
              debug.warning("New node detected will get GEO location for (" +endpointAddress+ ")")
              getIPLocation(endpointAddress.toString()).then(geoDataforIP => {
                const geoObject = Object.assign({}, 
                  {
                  providerName : providerName,
                  endpoint: endpoint,
                 }, geoDataforIP);
                 databaseService.storeGeoData(geoObject);
              })
            } 
          })
        }
      }
    }
   });
};

/** Module Exports Public Functions */
module.exports = {
  getIPLocation: getIPLocation,
  getGeoLocationForNodes: getGeoLocationForNodes,
};
