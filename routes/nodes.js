var express = require('express');
var router = express.Router();
var debug = require('../services/debuger')('ExpressRoute:Nodes');

const databaseService = require('../services/databaseServices');


/* GET nodes JSON object. from Database directly */
router.get('/', function (req, res, next) {
  databaseService.getNodeData(true).then(nodesData => {
    // console.log(nodesData);
    res.send(JSON.stringify(nodesData));
  })
});

/* GET Nodes Geo Location JSON object. from Cache 1st */
router.get('/geo', function (req, res, next) {
  databaseService.getGeoDataArray(true, (nodesData) => {
    // console.log(nodesData);
    res.send(JSON.stringify(nodesData));
  })
});

module.exports = router;
