import { Meteor } from 'meteor/meteor';
 
import { Items } from '../imports/api/items';
import { Listened } from '../imports/api/listened';

Meteor.publish('items', function(options, searchString) {
    var user = Meteor.users.findOne({
    _id: this.userId 
    });

    var listened = Listened.find({});
    var listenedIds = listened.map(function(x) { return x.itemId; });
    console.log("listenedIds is...: " + listenedIds);
    if(searchString){
      var where = {
         'title': {
           '$regex': '.*' + (searchString || '') + '.*',
           '$options': 'i'
         }
       
       };
    } else if(options.feedId) {
      var where = {
         'feedId': options.feedId,
         '_id':{
           '$nin' : listenedIds
         }
      };
    }
  
  Counts.publish(this, 'numberOfItems', Items.find(where), {noReady: true});
  return Items.find(where, options);

});

