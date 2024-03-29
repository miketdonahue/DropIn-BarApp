/*jshint node:true*/
'use strict';

// Requires
var Parse = require('parse/node').Parse;
var _ = require('underscore');
var currentUserBarObj = require('../auth/auth.controller').currentUserBarObj;
var four0four = require('../../utils/404')();

var UserStats = Parse.Object.extend('Stats_Users');

// Export
module.exports = {
  statsData: statsData
};

// Route Logic
function statsData(req, res) {
  var userStats = new Parse.Query(UserStats);

  userStats.equalTo('barId', currentUserBarObj());
  userStats.include('barId');
  userStats.descending('calcDate');
  userStats.first().then(function(results) {
    res.status(200).json({data: results});
  }, function(error) {
    res.status(400).end();
  });
}
