import { Mongo } from 'meteor/mongo';
 
export const Feeds = new Mongo.Collection('feeds');

//Feeds.allow({
//  insert(userId, party) {
//    return userId === userId;
//  },
//  update(userId, party, fields, modifier) {
//    return userId === userId;
//  },
//  remove(userId, party) {
//    return userId === userId;
//  }
//});
