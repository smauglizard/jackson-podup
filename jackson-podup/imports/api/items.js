import { Mongo } from 'meteor/mongo';
 
export const Items = new Mongo.Collection('items');

Items.allow({
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
