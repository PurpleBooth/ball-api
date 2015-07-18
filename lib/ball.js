"use strict";

var _ = require('underscore');

function Ball(hash) {
    var potentialBall;

    if (_.isObject(hash) && isValidObjectBall(hash)) {
        potentialBall = hash;
    }
    else {
        throw "Invalid ball";
    }

    this.hash = potentialBall;

    this.isSameBall = function (ball) {
        return this.hasKey() && ball.hash == this.hash;
    };

    this.hasKey = function () {
        return _.has(this.hash, 'key');
    };

    this.generateRandomKey = function () {
        var text = "";

        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 100; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        this.hash['key'] = text;
    };

    this.metersFromFrom = function (ball) {
        var distanceInKm = distance(this.hash['lat'], this.hash['lon'], ball.hash['lat'], ball.hash['lon'], "K");

        return distanceInKm * 1000;
    };

    this.outputHash = function () {
        return _.omit(this.hash, 'key')
    }
}

function isValidObjectBall(possibleBall) {
    var validKeylessBall = _.isEqual(_.keys(possibleBall), ['lat', 'lon']);
    var validKeyedBall = _.isEqual(_.keys(possibleBall), ['lat', 'lon', 'key']);

    return (validKeylessBall || validKeyedBall) && isValidLatLon(possibleBall['lat'], possibleBall['lon']);
}

function isValidLatLon(lat, lon) {
    return lat <= 90 && lat >= -90 && lon <= 180 && lon >= -180
}

function distance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1 / 180;
    var radlat2 = Math.PI * lat2 / 180;
    var radlon1 = Math.PI * lon1 / 180;
    var radlon2 = Math.PI * lon2 / 180;
    var theta = lon1 - lon2;
    var radtheta = Math.PI * theta / 180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit == "K") {
        dist = dist * 1.609344
    }
    if (unit == "N") {
        dist = dist * 0.8684
    }
    return dist
}

module.exports = Ball;