import { Meteor } from 'meteor/meteor';
 
import { Items } from '../imports/api/items';

Meteor.publish('items', function(options) {

  var user = Meteor.users.findOne({
    _id: this.userId 
  });
  var where = {
    //'title': {
    //  '$regex': '.*' + (searchString || '') + '.*',
    //  '$options': 'i'
    //},
    'feedId': {
      '$in': user.subscriptions
    },
    'feedId': options.feedId
    
    //'pubDate': {
    //  $gte: dateFrom,
    //  $lte: dateTo
  };
  //};
  Counts.publish(this, 'numberOfItems', Items.find(where), {noReady: true});
  return Items.find({}, options);

});
//if (Meteor.isServer) {
//  Meteor.publish('items', function(options) {
//    var user = Meteor.users.findOne({_id: this.userId});
//    //if(user) {
//    return Items.find({}, options);
//    //} else {
//    //    return null;
//    //}
//
//    Counts.publish(this, 'numberOfItems', Items.find(), {
//      noReady: true
//    });
//  });
//}

