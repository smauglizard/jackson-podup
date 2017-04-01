'use strict';
import request from 'request';
import FeedParser from 'feedparser'
import { Meteor } from 'meteor/meteor';
import { Feeds } from '../imports/api/feeds';
import { Items } from '../imports/api/items';
import { UnReads } from '../imports/api/unreads';

Meteor.startup(function() {
  var Fiber = Npm.require('fibers');
  //var userId = this.userId;
  var Future = Npm.require('fibers/future');
    
  var fetchFeed, pollFeeds;
  fetchFeed = function(feed, cb) {
    var isFeed;
    var future = new Future();
    console.log("iN fetchFeed, feed is........." + feed);
    var results = [];
    var options = {
      url: feed,
      headers: {
             'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/602.4.8 (KHTML, like Gecko) Version/10.0.3 Safari/602.4.8'
 
      }
    };
    isFeed = Feeds.findOne({
            url:feed 
    });
    if(isFeed) {
      console.log("feed already there, adding subscription for...." + feed);
      console.log("@returning...........")
      return cb();
    }
    else {
      console.log("in else, this indicates feed not alread in db, feed is...." + feed);
      var feedId;
      var feedparser, req;
      console.log('fetching', feed);
      feedparser = new FeedParser();
      req = request(options);
      req.on('error', Meteor.bindEnvironment(function(err) {
        console.log("error @request is..." + err);
        return cb();
      }));

      req.on('response', function(res) {
        var stream = this;
        stream.pipe(feedparser);
      });

      feedparser.on('error', Meteor.bindEnvironment(function(err) {
        console.log("feedparser error is....." + err);
        return cb();
      }));
 
      feedparser.on('readable', function() {
        var item;
        var stream = this;
        //console.log("stream is............" + stream);
        Fiber(function() { 
        if(!feedId) {
          console.log("Adding Feed...." + feed);
          feedId = Feeds.insert({
            url: feed,
            title: stream.meta.title,
            description: stream.meta.description,
            image: stream.meta.image.url,
            pubDate: stream.meta.pubDate,
            lastChecked: new Date()
          });
        
         
          while (item = stream.read()) {
            if(item && item['rss:enclosure'] && item['rss:enclosure']['@'] && item['rss:enclosure']['@'].url){  
              results.push(Items.insert({
                feedId: feedId,
                title: item.title,
                url: item['rss:enclosure']['@'].url,
                image: item.image.url,
                pubDate: item.pubDate
              }));
            } else {
                console.log("item not conformant to feedparser, item not stored, item is....." + item);
                results.push(void 0);
            }
 
         }
        }  
      }).run();
      
      });
      return feedparser.on('end', Meteor.bindEnvironment(function() {
        console.log("done with feed, results[] is..........." + results);
        future.return(cb());
      }));
    }
    return future.wait();
  };
  pollFeeds = function() {
    var counter, fetchNext;
    var feeds = {};
    feeds['feedsList'] = JSON.parse(Assets.getText("starter-feeds.json"));
    console.log("feeds @begining of startup is...: " + feeds.feedsList);

    console.log('checking', feeds.feedsList.length, feeds.feedsList.length === 1 ? 'feed' : 'feeds');
    counter = 0;
    console.log("feeds.feedslist.length is....." + feeds.feedsList.length);

    fetchNext = function() {
      if (counter < feeds.feedsList.length) {
        console.log("Fetching feed......" + feeds.feedsList[counter]);
        fetchFeed(feeds.feedsList[counter++], fetchNext);
      } else {
        return console.log('done');
      }
    };
    
    fetchNext();
  };
  pollFeeds();
  //return 
  Meteor.setInterval(pollFeeds, 30 * 60 * 1000);
});












    
