var express = require('express');
var router = express.Router();
var debug = require('../services/debuger')('ExpressRoute:Nodes');

const coinServices = require('../services/coinServices');


/* GET Coin Data JSON object. from cache directly */
router.get('/', function(req, res, next) {
  coinServices.getCoinDataFromCache((coinData)=>{
    res.send(coinData);
  })
});

module.exports = router;
