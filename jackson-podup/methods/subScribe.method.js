'use strict';
import request from 'request';
import FeedParser from 'feedparser'
import { Meteor } from 'meteor/meteor';
import { Feeds } from '../imports/api/feeds';
import { Items } from '../imports/api/items';


var addSubscription = function(userId, feedId) {
  Meteor.users.update({
    _id: userId
  },
  {
    $addToSet: {
      subscriptions: feedId 
    }
  });
};

Meteor.methods({
  subScribe: function(url) {
    if(Meteor.isServer) {
      var userId = Meteor.userId();
      var Future = Npm.require('fibers/future');
      var future = new Future();
      var Fiber = Npm.require('fibers');
      var feedparser = new FeedParser();
      var feed = Feeds.findOne({
        url: url 
      });
      if(feed) {
        addSubscription(userId, feed._id);
        return 'already exists';
      }
      else {
        var req = request(url); 
        var feedId;
        req.on('response', function(res) {
          var stream = this;
          stream.pipe(feedparser);
        });
        feedparser.on('readable', function() {
          var stream = this;
          Fiber(function() {
            if(!feedId) {
              feedId = Feeds.insert({
                url: url,
                title: stream.meta.title,
                description: stream.meta.description,
                image: stream.meta.image.url,
                pubDate: stream.meta.pubDate,
                lastChecked: new Date()
              });
              addSubscription(userId, feedId);
              while(item = stream.read()) {
                Items.insert({
                  feedId: feedId,
                  title: item.title,
                  url: item['rss:enclosure']['@'].url,
                  image: item.image.url,
                  pubDate: item.pubDate
                });
              }
            }
          }).run();
        });
        feedparser.on('end', function() {
          future.return(feed);
        });
        
      }
      return future.wait();
    }
  }
});
