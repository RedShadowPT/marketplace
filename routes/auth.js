var express = require('express');
var router = express.Router();
var debug = require('../services/debuger')('ExpressRoute:Auth');
const databaseServices = require('../services/databaseServices');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/* Login admin user */
router.post('/login', function (req, res, next) {
  let userAuth;
  databaseServices.getUser(req.body.email)
    .then(user => {
      if (!user || user.length == 0) {
        return res.status(401).json({
          message: "Invalid User credentials!"
        });
      }
      userAuth = user[0];
      return bcrypt.compare(req.body.password, userAuth.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Invalid User credentials!"
        });
      }
      /**
       *  User provided valid credentials
       * Create JSON Token for User
      */
      const token = jwt.sign(
        {
          id: userAuth.id,
          email: userAuth.email,
          displayName: userAuth.displayName,
          isAdmin: userAuth.isAdmin,
          isEnabled: userAuth.isEnabled
        },
        global.config.tokenSecret,
        {
          expiresIn: "1h"
        });
      // return to frontend the token
      res.status(200).json({
        id: userAuth.id,
        email: userAuth.email,
        displayName: userAuth.displayName,
        isAdmin: userAuth.isAdmin,
        isEnabled: userAuth.isEnabled,
        token: token
      })
    })
    .catch(err => {
      res.status(500).json({
        message: "Server Returned an error on Authentication",
        error: err
      })
    });
});

/* Login admin user */
router.post('/logout', function (req, res, next) {
  res.send("Auth");
});



module.exports = router;
