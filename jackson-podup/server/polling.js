'use strict';
import request from 'request';
import FeedParser from 'feedparser'
import { Meteor } from 'meteor/meteor';
import { Feeds } from '../imports/api/feeds';
import { Items } from '../imports/api/items';
import { UnReads } from '../imports/api/unreads';

Meteor.startup(function() {
  var fetchFeed, pollFeeds;
  fetchFeed = function(feed, cb) {
    var feedparser, req;
    console.log('fetching', feed.url);
    feedparser = new FeedParser();
    req = request(feed.url);
    req.on('response', function(res) {
      this.pipe(feedparser);
    });
    feedparser.on('readable', Meteor.bindEnvironment(function() {
      var item, results;
      results = [];
      while (item = feedparser.read()) {
        if (!Items.findOne({
          pubDate: item.pubDate
        })) {
          item.feedId = feed._id;
          results.push(Items.insert({
                  feedId: item.feedId,
                  title: item.title,
                  url: item['rss:enclosure']['@'].url,
                  image: item.image.url,
                  pubDate: item.pubDate
          }));
        } else {
          results.push(void 0);
        }
      }
      //return results;
    }));
    return feedparser.on('end', Meteor.bindEnvironment(function() {
      Feeds.update({
        _id: feed._id
      }, {
        $set: {
          lastChecked: new Date()
        }
      });
      //return cb();
    }));
  };
  pollFeeds = function() {
    var counter, feeds, fetchNext;
    feeds = Feeds.find({
      lastChecked: {
        //$lt: new Date().setHours(new Date().getHours() - 1)
          $lt: new Date()
      }
    }).fetch();
    console.log('checking', feeds.length, feeds.length === 1 ? 'feed' : 'feeds');
    counter = 0;
    fetchNext = function() {
      if (counter < feeds.length) {
        return fetchFeed(feeds[counter++], fetchNext);
      } else {
        return console.log('done');
      }
    };
    //return fetchNext();
  };
  pollFeeds();
  return Meteor.setInterval(pollFeeds, 30 * 60 * 1000);
});












    
