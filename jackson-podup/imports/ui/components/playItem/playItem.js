import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';
import uiRouter from 'angular-ui-router';
import { Items } from '../../../api/items';
import { Listened } from '../../../api/listened';
//import { soundManager } from 'wenape_soundmanager';
//var soundManager = Npm.require('soundmanager2');
import './playItem.html';
 
class PlayItem {
  constructor($stateParams, $reactive, $scope, $sce) {
    'ngInject';

    this.url='';
    var arr = [];
    $reactive(this).attach($scope);
    //soundManager = Npm.require('soundmanager');
    this.itemId = $stateParams.itemId;

    this.helpers({
      item() {
        return Items.findOne({_id: this.itemId}); 

      },
      addItem(){
        console.log("adding item...");
        Listened.insert({userId: Meteor.userId(),
          title:this.item.title,
          itemId:this.itemId, 
          url:this.item.url, 
          feedId:this.item.feedId,
          pubDate:this.item.pubDate,
          image:this.item.image
        });
      }
    });
   
    this.url = this.item.url;
    console.log(this.url);

    $scope.audioUrl = $sce.trustAsResourceUrl(this.url); 

  }
  itemSeen(){
    this.addItem(); 
  }

   // soundManager.setup({
   //     url: './swf/',
   //     flashVersion: 9, // optional: shiny features (default = 8)
   //     // optional: ignore Flash where possible, use 100% HTML5 mode
   //     preferFlash: false
   //     //onready: function() {
   //     //  soundManager.createSound();
   //     //}
   //   });
    //} 
    //playIt(){
     // var audio = new Audio(this.item.link);
     // audio.play();
     // soundManager.createSound({
     //   id: itemId,
     //   url: itemLink,
     //   type: 'audio/mp3'
     // }).play();

    //}
  
}
 
const name = 'playItem';
 
// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  //soundManger
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: PlayItem
}).config(config);
 
function config($stateProvider) {
  'ngInject';
 
  $stateProvider.state('playItem', {
    url: '/items/:itemId',
    template: '<play-item></play-item>'
  });
}
