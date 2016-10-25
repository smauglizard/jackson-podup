import { Mongo } from 'meteor/mongo';
 
export const Listened = new Mongo.Collection('listened');

Listened.allow({
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
