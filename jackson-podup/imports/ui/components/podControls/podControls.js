import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';
import uiRouter from 'angular-ui-router';
//import { name as PodControls } from '../podControls/podControls';
import player from '../player/player.js';
//import { Items } from '../../../api/items';
import './podControls.html';

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
'use strict';
const name = 'podControls';
export default angular.module('PodControls', [angularMeteor,uiRouter,'player'])
.directive('podControls', ['player',function(player) {
  return {
    restrict: 'E',
    //template,
    templateUrl: `imports/ui/components/${name}/${name}.html`, 
    //template: '<pod-controls></pod-controls>',
    replace: true,
    link: function($scope, elem) {
      return $scope.controlsClick = function(e) {
        console.log("e in controlsClick is:", e);
        console.log(e.layerX, $('.statusbar', elem).width());
        e.preventDefault();
        e.cancelBubble = true;
        player.setPosition((e.layerX || e.offsetX) / $('.statusbar', elem).width());
        return console.log('controls click');
      };
    }
  };
}]);

//class PodControls {} 
//  constructor($reactive, $scope, player){
//    'ngInject';
// 
//    $reactive(this).attach($scope); 
//////angular.module('pod').directive('podControls', function(player) {
//////  return {
//////    restrict: 'E',
//////    templateUrl: 'directives/pod-controls/pod-controls.html',
//////    replace: true,
//////    link: function(scope, elem) {
//
//    $scope.controlsClick = function(e) {
//        console.log(e.layerX, $('.statusbar', e).width());
//        e.preventDefault();
//        e.cancelBubble = true;
//        player.setPosition(e.layerX / $('.statusbar', e).width());
//        console.log('controls click');
//      };
//  }
//}
// 
//const name = 'podControls';
// 
//// create a module
//export default angular.module(name, [
//  angularMeteor,
//  uiRouter,
//  'player'
//]).component(name, {
//  template,
//  controllerAs: name,
//  controller: PodControls
//}).config(config);
// 
//function config($stateProvider) {
//  'ngInject';
// 
//  $stateProvider.state('podControls', {
//   // url: '/items/:itemId',
//    link: function($scope, elem){
//            return  $scope.controlsClick = function(e) {
//                      console.log(e.layerX, $('.statusbar', elem).width());
//                      e.preventDefault();
//                      e.cancelBubble = true;
//                      player.setPosition(e.layerX / $('.statusbar', elem).width());
//        //return console.log('controls click');
//      };
//    },
//    template: '<pod-controls></pod-controls>'
//  });
//}

