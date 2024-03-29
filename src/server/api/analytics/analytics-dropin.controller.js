/*jshint node:true*/
'use strict';

// Requires
var Parse = require('parse/node').Parse;
var _ = require('underscore');
var moment = require('moment');
var four0four = require('../../utils/404')();

var DropInStats = Parse.Object.extend('Stats_DropIn');

// Export
module.exports = {
  singleStatsData: singleStatsData,
  multipleStatsData: multipleStatsData
};

// Route Logic
function singleStatsData(req, res) {
  var dropinStats = new Parse.Query(DropInStats);

  dropinStats.descending('calcDate');
  dropinStats.first().then(function(results) {
    res.status(200).json({data: results});
  }, function(error) {
    res.status(400).end();
  });
}

function multipleStatsData(req, res) {
  var dropinStats = new Parse.Query(DropInStats);
  var oneWeekAgoDate = new Date(moment(new Date()).subtract(9, 'days')._d);

  dropinStats.descending('calcDate');
  dropinStats.greaterThanOrEqualTo('calcDate', oneWeekAgoDate);
  dropinStats.find().then(function(results) {
    var calcDates = [];
    var trafficValues = [];
    var rewardsValues = [];

    _.each(results, function(result) {
      trafficValues.unshift(result.attributes.totalTrafficByCredit);
      rewardsValues.unshift(result.attributes.totalRewardsRedeemed);
      calcDates.unshift(moment.utc(result.attributes.calcDate).format('MM-DD'));
    });

    var stats = [trafficValues, rewardsValues, calcDates];

    res.status(200).json({data: stats});
  }, function(error) {
    res.status(400).end();
  });
}
