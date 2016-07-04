var mongoose = require('mongoose');

var mongo = require('libs/mongo');

var express = require('express');

var MongoStore = require('connect-mongo')(express);

var sessionStore = new MongoStore({mongoose_connection: mongo.connection});

module.exports = sessionStore;