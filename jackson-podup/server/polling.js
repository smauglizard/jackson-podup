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
    var feedparser, req, cbcount;
    cbcount = 0;
    console.log('fetching', feed.url);
    feedparser = new FeedParser();
    req = request(feed.url);

    req.on('error', Meteor.bindEnvironment(function(err) {
      console.log('req error', err);
      if (cbcount++ < 1) {
        return cb();
      }
    }));
 
    req.on('response', function(res) {
      this.pipe(feedparser);
    });

    feedparser.on('error', Meteor.bindEnvironment(function(err) {
      console.log(feed);
      console.log('feedparser error', err);
      if (cbcount++ < 1) {
        return cb();
      }
    }));


    feedparser.on('readable', Meteor.bindEnvironment(function() {
      var item;
 
      while (item = feedparser.read()) {
        if (!Items.findOne({
          pubDate: item.pubDate
        })) {
          if(item && item['rss:enclosure'] && item['rss:enclosure']['@'] && item['rss:enclosure']['@'].url){
            //item.feedId = feed._id;
            console.log("inserting feedId", feed._id);
            if(Items.insert({
              feedId: feed._id,
              title: item.title,
              url: item['rss:enclosure']['@'].url,
              image: item.image.url,
              pubDate: item.pubDate
            })){
              console.log("added item is...", JSON.stringify({ 
                feedId: item.feedId,
                title: item.title,
                url: item['rss:enclosure']['@'].url,
                image: item.image.url,
                pubDate: item.pubDate
              }));
            }
          }
        }
      }
    }));
    feedparser.on('end', Meteor.bindEnvironment(function() {
      Feeds.update({
        _id: feed._id
      }, {
        $set: {
          lastChecked: new Date()
        }
      });

      if (cbcount++ < 1) {
        return cb();
      }

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
        fetchFeed(feeds[counter++], fetchNext);
      } else {
          console.log('done');
      }
    };
    fetchNext();
    console.log("got here...");
  };
  //var startPollFeeds = function(){
  //    pollFeeds();
  //};
  Meteor.setInterval(pollFeeds, 60 * 60 * 1000);
  //Meteor.setInterval(pollFeeds, 24 * 60 * 60 * 1000);
});












    
