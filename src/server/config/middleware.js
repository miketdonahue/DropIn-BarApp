/*jshint node:true*/
'use strict';

// Requires
var Parse = require('parse/node').Parse;
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
var cookieParser = require('cookie-parser');
var favicon = require('serve-favicon');
var logger = require('morgan');
var four0four = require('../utils/404')();
var environment = process.env.NODE_ENV;

// Parse Keys
Parse.initialize(process.env.PARSE_ID, process.env.PARSE_SECRET, process.env.PARSE_MASTER);

module.exports = function(app, express) {
  // Middleware
  app.use(favicon(__dirname + '/../favicon.ico'));
  app.use(bodyParser.urlencoded({extended: true, limit: '5mb'}));
  app.use(bodyParser.json({limit: '5mb'}));
  app.use(logger('dev'));

  // Cookies & sessions
  app.use(cookieParser('secretkey'));

  app.use(cookieSession({
    name: 'session',
    secret: 'secret'
  }));

  // API routes
  app.use('/api/v1/auth', require('../api/auth/auth.routes')); // Do not authenticate auth routes themselves

  // Authenticate and Authorize all routes below
  app.use('/api/v1/*', require('../api/auth/auth.controller').hasAccess);

  app.use('/api/v1/analytics', require('../api/analytics/analytics.routes'));
  app.use('/api/v1/events', require('../api/events/events.routes'));
  app.use('/api/v1/profiles', require('../api/profile/profile.routes'));
  app.use('/api/v1/rewards', require('../api/rewards/rewards.routes'));
  app.use('/api/v1/users', require('../api/users/users.routes'));
  app.use('/api/v1/helpers', require('../api/helpers/helpers.routes'));


  // Env builds
  switch (environment) {
    case 'build':
      console.log('** BUILD **');
      app.use(express.static('./build/'));
      // Any invalid calls for templateUrls are under app/* and should return 404
      app.use('/app/*', function(req, res, next) {
        four0four.send404(req, res);
      });
      // Any deep link calls should return index.html
      app.use('/*', express.static('./build/index.html'));
      break;
    default:
      console.log('** DEV **');
      app.use(express.static('./src/client/'));
      app.use(express.static('./'));
      app.use(express.static('./tmp'));
      // Any invalid calls for templateUrls are under app/* and should return 404
      app.use('/app/*', function(req, res, next) {
        four0four.send404(req, res);
      });
      // Any deep link calls should return index.html
      app.use('/*', express.static('./src/client/index.html'));
      break;
  }
};
