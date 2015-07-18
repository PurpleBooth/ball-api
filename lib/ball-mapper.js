"use strict";

var _ = require('underscore');
var Ball = require('./ball');

module.exports = function (client) {
    this.getBall = function (callback) {
        client.get('ball', function (err, reply) {
            if (err || _.isUndefined(reply)) {
                callback(null);
            }
            try {
                callback(new Ball(JSON.parse(reply)));
            } catch (e) {
                callback(null);
            }
        });
    };

    this.setBall = function setBall(ball) {
        client.set('ball', JSON.stringify(ball.hash));
    };
};
