import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';
import uiRouter from 'angular-ui-router';
//import { name as Player } from '../../../../client/services/player.service';
import player from '../player/player.js';
import { Items } from '../../../api/items';
import './playItem.html';

// Remind me to do something about scroll..
//angular.module('pod').controller('MainCtrl', function($scope, $http, $window, $route, player) {
//  $scope.getPods = function() {
//    return player.getPods();
//  };
//  player.setFeedSlug($route.current.params.feedSlug);
//  player.fetchPods();
//  $scope.getFilter = player.getFilter;
//  return $scope.triggerScroll = function() {
//    $window.scrollTo($window.scrollX, window.scrollY + 1);
//    return console.log('scroll');
class PlayItem {
  constructor($stateParams, $reactive, $scope, player){
    'ngInject';
    
    //var self = this;
    $reactive(this).attach($scope);
    $scope.url = $stateParams.itemId;
    this.helpers({
      item() {
        console.log("in item function");
        return Items.findOne({_id: $stateParams.itemId}); 
      }
    });
   // Items.findOne({_id: this.url}, function(err, resp){
   //   if(err){
   //     console.log("findOne error is", err);
   //   } else {
   //     $scope.item = resp;
   //   }
   // });
    console.log("$scope.item is", $scope.item);
    //$scope.podClick = function(item) {
     // if (e.target.tagName !== 'A' && e.target.parentNode.tagName !== 'A') {
     //   player.podClick($scope.item);
     // }
    //};
     // return scope.$on('$destroy', function() {
     //   return scope.pod.displayed = false;
     // });
    //}
    $scope.podClick = function(e, item) {
      console.log("podclick triggered");
      if (e.target.tagName !== 'A' && e.target.parentNode.tagName !== 'A') {
        player.podClick(item);
      }
    };
  }

    
}
 
const name = 'playItem';
 
// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  'player'
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
