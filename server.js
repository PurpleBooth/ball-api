var _ = require('underscore');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json

var client;
if (process.env.REDIS_URL) {
    var host = require("url").parse(process.env.REDIS_URL);
    client = require("redis").createClient(host.port, host.hostname);
    client.auth(host.auth.split(":")[1]);
}
else {
    client = require("redis").createClient(process.env.REDIS_PORT_6379_TCP_PORT, process.env.REDIS_PORT_6379_TCP_ADDR);
}

client.on("error", function (err) {
    console.log("Error " + err);
});

var close = process.env.CLOSE; // metres
function getBall(callback) {
    client.get('ball', function (err, reply) {
        if(err || _.isUndefined(reply)) {
            callback(null);
        }

        callback(JSON.parse(reply));
    });
}

function setBall(ball) {
    client.set('ball', JSON.stringify(ball));
}

function makeKey() {
    var text = "";

    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 100; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
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

function possibleBallClose(possibleBall, ball) {
    var distanceInKm = distance(possibleBall['lat'], possibleBall['lon'], ball['lat'], ball['lon'], "K");

    return (distanceInKm * 1000 <= close)
}


app.get('/', function (req, res) {
    getBall(function (ball) {
        if (ball == null) {
            res.status(204);
            res.send('');
            return;
        }

        res.json(_.omit(ball, 'key'));
    })
});

app.post('/', function (req, res) {
    var possibleBall = req.body;

    if (!_.isEqual(_.keys(possibleBall), ['lat', 'lon']) && !_.isEqual(_.keys(possibleBall), ['lat', 'lon', 'key'])) {
        res.status(400);
        res.json('Not a ball update');

        return;
    }

    if (possibleBall['lat'] >= 90 || possibleBall['lat'] <= -90 || possibleBall['lat'] >= 180 || possibleBall['lat'] <= -180) {
        res.status(400);
        res.json('Invalid lat long');

        return;
    }

    getBall(function (ball) {
        if (ball !== null) {
            if (_.has(possibleBall, 'key') && !_.isEqual(possibleBall['key'], ball['key'])) {
                res.status(403);
                res.json('You don\'t have the ball!');
                return;
            }
            else {
                console.log('Updating ball position to ', ball)
            }

            if (!_.has(possibleBall, 'key') && !possibleBallClose(possibleBall, ball)) {
                res.status(409);
                res.json('Not close enough');
                return;
            }
            else {
                console.log('Ball stolen!')
            }
        }

        var newBall = possibleBall;
        newBall['key'] = makeKey();
        setBall(newBall);

        res.json(newBall);
    })
});
var server = app.listen(process.env.PORT || 3000, "0.0.0.0", function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});