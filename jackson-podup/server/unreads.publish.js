import { Meteor } from 'meteor/meteor';
 
import { Items } from '../imports/api/items';

Meteor.publish('items', function(options) {

  //var user = Meteor.users.findOne({
  //  _id: this.userId 
  //});
  var where = {
    'feedId': options.feedId
    
  };
  
  Counts.publish(this, 'numberOfItems', UnReads.find(where), {noReady: true});
  return UnReads.find(where, options);

});

