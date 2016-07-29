import { Meteor } from 'meteor/meteor';
import { Parties } from '../imports/api/parties';

Meteor.startup(() => {
  if (Parties.find().count() === 0) {
    const feeds = [{
      'url': 'http://feeds.soundcloud.com/users/soundcloud:users:171455110/sounds.rss' ,
      'link': 'https://soundcloud.com/theparapod/32-the-parapod-mysteries-episode-10',
      'title': '32 The Parapod Mysteries Episode 10',
      'description': 'Ray finally tries to see Dodds off',
      'caretedAt': Date.now(),
      'pubDate': 'Tue, 26 Apr 2016 18:58:26 +0000'
    }, {
      'url': 'http://feeds.soundcloud.com/users/soundcloud:users:171455110/sounds.rss',
      'link': 'https://soundcloud.com/theparapod/31-the-parapod-mysteries-extra-episode-2',
      'title': '31 The Parapod Mysteries Extra Episode 2',
      'description': 'Concluding ritual nonsense',
      'createdAt': Date.now(),
      'pubDate' : 'Sun, 24 Apr 2016 01:02:40 +0000'
    }, {
      'url': 'http://feeds.soundcloud.com/users/soundcloud:users:171455110/sounds.rss',
      'link': 'https://soundcloud.com/theparapod/30-the-parapod-mysteries-episode-9',
      'title': '30 The Parapod Mysteries Episode 9',
      'description': 'The Dodds Doth Protest Too Much',
      'createdAt': Date.now(),
      'pubDate': 'Tue, 19 Apr 2016 10:42:01 +0000'
    }];
 
    feeds.forEach((feed) => {
      Parties.insert(feed)
    });
  }
});
