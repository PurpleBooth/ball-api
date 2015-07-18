"use strict";

var Ball = require('./ball');

module.exports = function (ballMapper, close) {
    this.replace = function (ballHash, callback) {
        try {
            var possibleBall = new Ball(ballHash);

            ballMapper.getBall(function (ball) {
                    if (ball !== null) {
                        if (possibleBall.hasKey()) {
                            if (!ball.isSameBall(possibleBall)) {
                                callback({code: 403, message: 'You don\'t have the ball!'});
                                return;
                            }
                        }
                        else {
                            console.log('Updating ball position to ', ball.outputHash())
                        }
                    }
                    else {
                        if (!possibleBall.metersFromFrom(ball) > close) {
                            callback({code: 409, message: 'Not close enough'});
                            return;
                        }
                        else {
                            console.log('Ball stolen!')
                        }
                    }

                    possibleBall.generateRandomKey();
                    ballMapper.setBall(possibleBall);

                    callback(null, possibleBall.hash);
                }
            )
        }
        catch (message) {
            callback({code: 400, message: message});
        }
    };
};