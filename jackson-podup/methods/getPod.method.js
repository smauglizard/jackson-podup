'use strict';
import { Meteor } from 'meteor/meteor';
import { Feeds } from '../imports/api/feeds';
import { Items } from '../imports/api/items';

Meteor.methods({

  getPod: function(itemId) {
  if(Meteor.isServer) {
    console.log("in getPod...");
    console.log("itemId in getPod is :", itemId);
    Items.findOne({_id:itemId}, function(err, resp){
      if(err){
        console.log(err.reason);
      } else {
        return resp;
      }
    });
  }
  }
});
