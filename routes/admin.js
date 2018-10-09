var express = require('express');
var router = express.Router();
var debug = require('../services/debuger')('ExpressRoute:Admin');
const databaseServices = require('../services/databaseServices');
const bcrypt = require('bcrypt');

// Middleware for JSON Token
const checkAuth = require("../middleware/check-auth");

/* GET Config Database */
router.get('/config', checkAuth, function (req, res, next) {
    databaseServices.getConfig()
        .then(config => {
            if (!config) {
                res.status(500).json({ message: 'No config found!' });
            }
            res.status(200).json(config);
        })

});

/* GET Config Database */
router.post('/config', checkAuth, function (req, res, next) {
    const newSettings = req.body;
    for (let i = 0; i < newSettings.length; i++){
        console.log(newSettings[i]);
    }
    res.status(200).json({message: 'Config settings saved!'});
});

/* GET Config Database */
router.get('/users', checkAuth, function (req, res, next) {
    databaseServices.getUsers()
        .then(users => {
            if (!users) {
                res.status(500).json({ message: 'No users found!'});
            }
            res.status(200).json(users);
        })
});

/* Create user */
router.post('/users', checkAuth, function (req, res, next) {
    debug.warning('Creating user: ' + req.body.displayName)
    bcrypt.hash(req.body.password, 10)
        .then(providedPassword => {
            req.body.password = providedPassword;
            databaseServices.storeUpdateUser(req.body)
                .then(result => {
                    if (result) {
                        res.status(201).json({
                            message: "User created!",
                            result: result
                        });
                    } else {
                        res.status(402).json({
                            message: "User couldn't be created"
                        });
                    }
                })
        }).catch(err => {
            res.status(500).json({
                message: "User couldn't be authenticated",
                error: err
            })
        });

});

/* Create user */
router.post('/users/delete', checkAuth, function (req, res, next) {
    debug.warning('Deleting user: ' + req.body.displayName)
    console.log(req.body);
    databaseServices.deleteUser(req.body.email)
    .then(result => {
        if (result) {
            res.status(201).json({
                message: "User deleted!",
                result: result
            });
        } else {
            res.status(402).json({
                message: "User couldn't be deleted"
            });
        }
    })
});

/* GET Config Database */
router.get('/log', function (req, res, next) {
    var message = {message:'Sent Additional Information', status: 200};
    global.io.sendWsMessage('message',message);
    res.status(402).json({
        type: "Generated Log",
        message: message
    });
});
module.exports = router;
