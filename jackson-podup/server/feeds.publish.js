'use strict'
import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts'; 
import { Feeds } from '../imports/api/feeds';

Meteor.publish('feeds', function(options, searchString) {
  var user = Meteor.users.findOne({
    _id: this.userId 
  });
  if(options.sort) {

    var where = {
    'title': {
      '$regex': '.*' + (searchString || '') + '.*',
      '$options': 'i'
    },
    '_id': {
      '$in': user.subscriptions || []
    }
  };
  } else {
  //console.log("options is..", options);
  var where = {
    'title': {
      '$regex': '.*' + (searchString || '') + '.*',
      '$options': 'i'
    },
    '_id': {
      '$nin': user.subscriptions || []
    }
  };
  }
  Counts.publish(this, 'numberOfFeeds', Feeds.find(where), {noReady: true});
  return Feeds.find(where, options);
});
