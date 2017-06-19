var mongo = require('mongodb').MongoClient;
var express = require('express');
var app = express();
var urlShortener = require('./app/service/url-shortener.js');
var routing = require('./app/routing/routing');
var path = require('path');
var port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/app/usageGuide'));

mongo.connect(process.env.MONGOLAB_URI || 'mongodb://localhost:27017/data', function(err, db) {
  if(err) {
    console.log(err);
  } else {
    urlShortener(app, db);
    routing(app)
  }
});

app.listen(port);
