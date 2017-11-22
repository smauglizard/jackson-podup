import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';
import uiRouter from 'angular-ui-router';
import { name as PodControls } from '../podControls/podControls';
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
    //$scope.pod = player.lastPod;
    this.subscribe('items', function() {
        return [{
          itemId: $stateParams.itemId
        }];
    });

    this.helpers({
      item() {
        console.log("in item function");
        return Items.findOne({_id: $scope.url}); 
      }
    });
    console.log("$scope.item is", $scope.item);
    $scope.podClick = function(e, item) {
      //$scope.pod = player.getPod();
      if (e.target.tagName !== 'A' && e.target.parentNode.tagName !== 'A') {
        player.podClick(item);
        $scope.pod = player.getPod();
      }

    };
    console.log("player.lastPod is: ", player.getPod());
    $scope.pod = player.getPod();
    console.log("$scope.pod is: ", $scope.pod);
     // return scope.$on('$destroy', function() {
     //   return scope.pod.displayed = false;
     // });
    }
}
 
const name = 'playItem';
 
// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  PodControls,
  'player'
]).component(name, {
  //template,
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
