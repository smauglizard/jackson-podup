'use strict';
import request from 'request';
import FeedParser from 'feedparser';
import { Feeds } from '../imports/api/feeds';
import { Items } from '../imports/api/items';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

Meteor.methods({
  addFeeds: function(url) {
    //var ret = check(url, String);
    //console.log(ret);
    if (Meteor.isServer) {
      var Future = Npm.require('fibers/future');
      var Fiber = Npm.require('fibers');
      var future = new Future();
      var feedparser = new FeedParser();
      var allitems = [];
      var lastDate = '';
      var feedId;
      //var url = 'http://feeds.feedburner.com/se-radio';
      // Maybe add subscription of a list of urls..
      var feeds = [{
        'url': url
      }];

      feeds.forEach(function(feed) {
        var exists = Feeds.findOne({
          'url': feed.url
        });
        if (!exists) {
          feedId = Feeds.insert({
            url: feed.url
          }, function(err, res) {
            if (err) {
              console.log(err);
            } else {
              console.log(res);
            }
          });
           
        } else {
          console.log("You are already subscribed to this feed...exists is...");
          // will return in `production'....
          feedId = feed._id;
          console.log('Feed already exists...');
          return 'Feed already exists...';
        }
      });

      options = {
        //url: 'http://feeds.feedburner.com/se-radio'
         url: url
      };
      //var req = request('http://feeds.feedburner.com/se-radio');
      var req = request(options);
      req.on('response', function(res) {
        var stream = this;
        stream.pipe(feedparser);
      });
      feedparser.on('readable', function() {
        var stream = this;
        var item;
        while (item = stream.read()) {
          if(item['rss:enclosure']['@'].url) {
            allitems.push({
            feedId: feedId,
            title: item.title,
            pubdate: new Date(item.pubdate),
            link: item.link,
            //url: item.url,
            url: item['rss:enclosure']['@'].url,
            image: item.image.url
          });
        } else {
            allitems.push({
            feedId: feedId,
            title: item.title,
            pubdate: new Date(item.pubdate),
            link: item.link,
            url: item.url,
            //url: item['rss:enclosure']['@'].url,
            image: item.image.url
          });
        }
          //lastdate = new Date(item.pubdate);
        }
      });
      feedparser.on('end', function() {
        //var url = 'http://feeds.feedburner.com/se-radio';
        Fiber(function() {
          try {
            lastdate = allitems[0].pubdate;
            Feeds.update({
              url: url
            }, {
              $set: {
                'pubdate': lastdate
              }
            });
          } catch (error) {
            console.log("error storing initial date in feeds collection" + error);
          }
          allitems.forEach(function(result) {
            pubdate = new Date(result.pubdate);
            console.log("results[i] in end's forEach is...");
            console.log(result);
            try {
              var newId = Items.insert(result);
            } catch (error) {
              console.log("Could not insert due to" + error);
            }
            if (newId) {
              if (pubdate > lastdate) {
                try {
                 Feeds.update({
                    url: url
                  }, {
                    $set: {
                      'pubdate': pubdate
                    }
                  });
                  lastdate = pubdate;
                 } catch (error) {
                  console.log("Unable to update Feeds due to " + error);
                }
               }
            }
            console.log("newId is...");
            console.log(newId);
            // Add a callback if you care about being `sexy'...
            var array = Items.find({
              _id: newId
            }).fetch();
            console.log("final array is..." + array);

          });
        }).run();
        future['return'](allitems);
      });
      return future.wait();

    }
  }
}); 




