"use strict";

// Distance in Metres to allow stealing from
var close = process.env.CLOSE; // metres

var express = require('express');
var router = express.Router();
var client = require('../lib/redis-client');
var ballMapper = new (require('../lib/ball-mapper'))(client);

var ballReplacementService = new (require('../lib/ball-replacement-service'))(ballMapper, close);

router.get('/', function (req, res) {
    ballMapper.getBall(function (ball) {
        if (ball == null) {
            res.status(204);
            res.send('');
            return;
        }

        res.json(ball.outputHash());
    })
});

router.post('/', function (req, res) {
    ballReplacementService.replace(req.body, function (err, success) {
        if (err) {
            res.status(err.code);
            res.json(err.message);
        }
        else {
            res.status(200);
            res.json(success);
        }
    })
});

module.exports = router;