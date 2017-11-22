FeedParser = Npm.require('feedparser');
request = Npm.require('request');
import { Meteor } from 'meteor/meteor';
import { Feeds } from '../imports/api/feeds';
import { Items } from '../imports/api/items';
import { UnReads } from '../imports/api/unreads';

Meteor.startup(function() {
  var fetchFeed, loadFeeds;

  fetchFeed = function(feed, cb) {
    var cbcount, feedparser, isfeed, options, req;
    cbcount = 0;
    options = {
      url: feed,
      headers: {
        'User-Agent': 'podcatcher'
      }
    };
    isfeed = Feeds.findOne({
      url: feed
    });
    if (isfeed) {
      console.log('already in database');
      return cb();
    }
    feedparser = new FeedParser();
    req = request(options);
    req.on('error', Meteor.bindEnvironment(function(err) {
      console.log('req error', err);
      if (cbcount++ < 1) {
        return cb();
      }
    }));
    req.on('response', function(res) {
      return this.pipe(feedparser);
    });
    feedparser.on('error', Meteor.bindEnvironment(function(err) {
      console.log(feed);
      console.log('feedparser error', err);
      if (cbcount++ < 1) {
        return cb();
      }
    }));
    var feedId;
    feedparser.on('readable', Meteor.bindEnvironment(function() {
      var item, stream;
      stream = feedparser;
      if (!feedId && stream.meta) {
        stream.meta.image = stream.meta.image || {};
        feedId = Feeds.insert({
          url: feed,
          title: stream.meta.title,
          description: stream.meta.description,
          image: stream.meta.image.url,
          pubDate: stream.meta.pubDate,
          lastChecked: new Date()
        });
      }
      while (item = stream.read()) {
        if (item && item['rss:enclosure'] && item['rss:enclosure']['@'] && item['rss:enclosure']['@'].url) {
          Items.insert({
            feedId: feedId,
            title: item.title,
            url: item['rss:enclosure']['@'].url,
            image: item.image.url,
            pubDate: item.pubDate
          });
        } else {
          console.log("item not added, url..", feed); 
        }
      }
     // return results;
    }));
    feedparser.on('end', Meteor.bindEnvironment(function() {
      if (cbcount++ < 1) {
        return cb();
      }
    }));
  };
  loadFeeds = function() {
    var counter, fetchNext, feed_test;
    var feeds = {};
    feeds['feedsList'] = JSON.parse(Assets.getText("starter-feeds.json"));
    console.log("feeds @begining of startup is...: " + feeds.feedsList);

    console.log('checking', feeds.feedsList.length, feeds.feedsList.length === 1 ? 'feed' : 'feeds');
    counter = 0;
    console.log("feeds.feedslist.length is....." + feeds.feedsList.length);

    fetchNext = function() {
      if (counter++ < feeds.feedsList.length) {
        console.log('fetching', counter, '/', feeds.feedsList.length);
        fetchFeed(feeds.feedsList[counter - 1], fetchNext);
      } else {
        return console.log('done');
      }
    };
    feed_test = Feeds.find({}).count();
    if(feed_test < 200){
      fetchNext();
    } else {
        console.log("feeds already fetched...");
    }
  };
  loadFeeds();
});


