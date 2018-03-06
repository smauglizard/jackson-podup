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
      var options = {
           url: url,
           headers: {
        //'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/602.4.8 (KHTML, like Gecko) Version/10.0.3 Safari/602.4.8'
                'User-Agent': 'podcatcher'
             }
        };

      var feed = Feeds.findOne({
        url: url 
      });
      if(feed) {
        addSubscription(userId, feed._id);
        return 'already exists';
      }
      else {
        var req = request(options); 
        var feedId;
        req.on('response', function(res) {
          var stream = this;
          stream.pipe(feedparser);
        });
        feedparser.on('error', function() {
            return;
          });

        feedparser.on('readable', function() {
          var stream = this;
          var item;
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
                  if(item && item['rss:enclosure'] && item['rss:enclosure']['@'] && item['rss:enclosure']['@'].url){
                    Items.insert({
                      feedId: feedId,
                      title: item.title,
                      url: item['rss:enclosure']['@'].url,
                      image: item.image.url,
                      pubDate: item.pubDate
                    });
                  } else {
                       console.log("item not stored for feed..." + url);
                       continue;
                  }
              }
            }
          }).run();
        });
        feedparser.on('end', function() {
          future.return(feedId);
        });
        
      }
      return future.wait();
    }
  }
});
