var debug = require('./debuger')('CacheServices');

// Init redis service
const redis = require('redis');

const client = redis.createClient(global.config.cacheServer);
// promissify redis client
const util = require('util');
client.get = util.promisify(client.get)

client.on('connect', () => {
  debug('Connected to Redis...');
})

/** Store Data into redis for Caching */
function setJSONData(key, value, callback) {
  // const length = value.length;
  // for (let index = 0; index < length; index++){

  // }
  client.set(key, JSON.stringify(value), (err, reply) => {
    if(!reply){
      debug('Object not found in cache')
      callback(err, reply);
    } else {
      debug.success('Object Stored in cache')
      callback(err, reply); // Redis doesn't store values in JSON format, it will be required parse this return string.
    }
  })
}

/** Store Data into redis for Caching */
function getData(key, callback) {
  client.get(key).then((reply, err) => {
    if(!reply){
      debug.warning('Object not found in cache' + err)
      callback(reply, err);
    } else {
      callback(JSON.parse(reply)); // Redis doesn't store values in JSON format, it will be required parse this return string.
    }
  })
}

module.exports = {
  client : client,
  setData: setJSONData,
  getData: getData
}