// https://coinlib.io/api/v1/coin?key=XXX&pref=EUR&symbol=BTC

var debug = require('./debuger')('coinServices');
const util = require('../services/utlities');
const cache = require('./cacheServices');

/** Get get All Nodes */
function fetchCoinData() {
  debug("Connecting to Backend API for Coin Data: ");

  return new Promise(function (resolve, reject) {
    const url = global.config.coinExchangeAPI.url
    +'?'+'key='
    +global.config.coinExchangeAPI.key
    +global.config.coinExchangeAPI.options;

    return util.getContent(url).then((coinData) => {
      resolve(JSON.parse(coinData));
    }).catch( (error) => {
      reject(error);
    });
  });
};

function setCoinDataIntoCache(coinData) {
  cache.setData("coinData",coinData, (err, reply) => {
    if (err) {
      debug.warning("Coin Data wasn't stored properly!");
    }
  });
}

function getCoinDataFromCache(callback){
  cache.getData("coinData", (reply, err) => {
    if (err) {
      debug.warning("Coin Data wasn't stored properly!");
    }
    callback(reply);
  })
}

module.exports =  {
  fetchCoinData: fetchCoinData,
  setCoinDataIntoCache: setCoinDataIntoCache,
  getCoinDataFromCache: getCoinDataFromCache
}
