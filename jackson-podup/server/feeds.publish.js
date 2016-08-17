import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts'; 
import { Feeds } from '../imports/api/feeds';
 
if (Meteor.isServer) {
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
      '$in': user.subscriptions
    }
  };
  Counts.publish(this, 'numberOfFeeds', Feeds.find(where), {noReady: true});
  return Feeds.find(where, options);
});
}
 // Meteor.publish('feeds', function(searchString) {
 //   var user = Meteor.users.findOne({_id: this.userId});
 //   console.log("user after db call is..." + user);
 //   if(!user){
 //       selector = {
 //           'title':{
 //               $regex: '.*{searchString}.*',
 //               $options : 'i'
 //           }
 //       };

 //       //return Feeds.find(selector);
 //   } else {
 //       selector = {
 //          'title': {
 //                   $regex: '.*' + ( searchString || '') + '.*', 
 //                   $options: 'i'
 //               },
 //               '_id': {
 //                   '$in': user.subscriptions
 //               }
 //       
 //       };
 //   }

 //   Counts.publish(this, 'numberOfFeeds', Feeds.find(selector), {
 //     noReady: true
 //   });
 //   return Feeds.find(selector);

 // });
//}
//if (Meteor.isServer) {
//  Meteor.publish('feeds', function(searchString) {
//    var user = Meteor.users.findOne({_id: this.userId});
//    selector = {}
//    if(searchString) {
//      selector.title = {
//        $regex: '.*' + searchString + '.*',
//        $options : 'i'
//      }
//    }
//    else {
//      if(user) {
//        selector._id = {
//          '$in': user.subscriptions
//        };
//      }
//    }
//    Counts.publish(this, 'numberOfFeeds', Feeds.find(selector), {
//      noReady: true
//    });
//    return Feeds.find(selector);
//  });
//}

