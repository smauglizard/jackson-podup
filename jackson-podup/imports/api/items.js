import { Mongo } from 'meteor/mongo';
 
export const Items = new Mongo.Collection('items');

//Items.allow({
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
