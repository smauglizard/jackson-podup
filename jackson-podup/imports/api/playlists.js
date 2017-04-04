import { Mongo } from 'meteor/mongo';
 
export const PlayLists = new Mongo.Collection('playlists');

PlayLists.allow({
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
