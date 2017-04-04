import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';
import { PlayLists } from '../../../api/playlists';
import { Items } from '../../../api/items';
import './playlistAdd.html';

class PlayListAdd {
    constructor($stateParams, $scope, $reactive) {
      'ngInject';
      $reactive(this).attach($scope);

      this.itemId = $stateParams.itemId;
      console.log("this.itemId is: " + this.itemId);
      this.items={};
      this.helpers({
        item() {
          return Items.findOne({_id: this.itemId});
        }//,
       // addToList(name){
       //   console.log("in addToList, item is :" + this.item);
       //   PlayLists.insert({
       //     "playlistName":name,
       //     "itemId":this.itemId,
       //     "url":this.item.url,
       //     "title":this.item.title,
       //     "image":this.item.image,
       //     "pubDate":this.item.pubDate
       //   });
       // }
      });
      this.items.url = this.item.url;
      this.items.title = this.item.title;
      this.items.image = this.item.image;
      this.items.pubDtae = this.item.pubDate;
    }
    addToList(name){
      console.log("in addToList...");
      PlayLists.insert({
        "playlistName":name,
        "itemId":this.itemId,
        "url":this.items.url,
        "title":this.items.title,
        "image":this.items.image,
        "pubDate":this.items.pubDate
      });
    }
    addList(){
        this.addToList(this.name);
    }
}

const name = 'playlistAdd';
 
// create a module
export default angular.module(name, [
  angularMeteor
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: PlayListAdd
})
.config(config);
 
function config($stateProvider) {
  'ngInject';
 
  $stateProvider.state('playlistAdd', {
    url: '/items/:itemId/playlists/insert',
    template: '<playlist-add></playlist-add>'
  });
}

