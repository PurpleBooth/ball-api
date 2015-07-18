"use strict";

var _ = require('underscore');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');

app.use(cors());
app.use(bodyParser.json()); // for parsing application/json

app.use('/', require('./routes/ball'));

var server = app.listen(process.env.PORT || 3000, "0.0.0.0", function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});