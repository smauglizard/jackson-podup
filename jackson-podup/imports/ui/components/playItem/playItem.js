import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
 
import './playItem.html';
 
class PlayItem {
  constructor($stateParams) {
    'ngInject';
 
    this.itemId = $stateParams.itemId;
  }
}
 
const name = 'playItem';
 
// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: PlayItem
}).config(config);
 
function config($stateProvider) {
  'ngInject';
 
  $stateProvider.state('playItem', {
    url: '/feeds/:itemId',
    template: '<play-item></play-item>'
  });
}
