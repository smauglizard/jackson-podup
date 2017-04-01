'use strict'
import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts'; 
import { Feeds } from '../imports/api/feeds';

Meteor.publish('feeds', function(options, searchString) {
  var user = Meteor.users.findOne({
    _id: this.userId 
  });
  var where = {
    'title': {
      '$regex': '.*' + (searchString || '') + '.*',
      '$options': 'i'
    },
    '_id': {
      '$nin': user.subscriptions
    }
  };
  Counts.publish(this, 'numberOfFeeds', Feeds.find(where), {noReady: true});
  return Feeds.find(where, options);
});
