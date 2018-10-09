var express = require('express');
var router = express.Router();
var debug = require('../services/debuger')('ExpressRoute:API');

const databaseService = require('../services/databaseServices');
// Middleware for JSON Token
const checkAuth = require("../middleware/check-auth");

/* GET nodes JSON object. from Database directly */
router.get('/nodes', checkAuth, function(req, res, next) {
  databaseService.getNodeData(false, (nodesData)=>{
    res.send(JSON.stringify(nodesData));
  })
});

/* GET nodes JSON object. from Database directly */
router.get('/nodes/:provider', checkAuth, function(req, res, next) {
  databaseService.getNodeDataByProvider(false, req.params.provider, (nodesData)=>{
    res.send(JSON.stringify(nodesData));
  })
});

/* GET Nodes Geo Location JSON object. from Database directly */
router.get('/geo', checkAuth, function(req, res, next) {
  databaseService.getGeoDataArray(false, (nodesData)=>{
    res.send(JSON.stringify(nodesData));
  })
});

//getGEObyIPaddress
/* GET Nodes Geo Location JSON object. from Database directly */
router.get('/geo/:ip', checkAuth, function(req, res, next) {
  databaseService.getGEObyIPaddress(req.params.ip, (nodesData)=>{
    res.send(JSON.stringify(nodesData));
  })
});


module.exports = router;
