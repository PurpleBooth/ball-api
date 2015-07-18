"use strict";

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

module.exports = client;