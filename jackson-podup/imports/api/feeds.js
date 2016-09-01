import { Mongo } from 'meteor/mongo';
 
export const Feeds = new Mongo.Collection('feeds');

Feeds.allow({
  insert(userId, party) {
    return true;
  },
  update(userId, party, fields, modifier) {
    return true;
  },
  remove(userId, party) {
    return true;
  }
});
