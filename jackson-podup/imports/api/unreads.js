import { Mongo } from 'meteor/mongo';
 
export const UnReads = new Mongo.Collection('unreads');

UnReads.allow({
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
