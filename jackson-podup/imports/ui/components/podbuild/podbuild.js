import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import './podbuild.html';
import { name as FeedsList } from '../feedsList/feedsList';
import { name as PlayItem } from '../playItem/playItem';
import { name as ItemsDetails } from '../itemsDetails/itemsDetails';
import { name as Navigation } from '../navigation/navigation';
//import { name as UnReads } from '../unReads/unReads';

class Podbuild {}

const name = 'podbuild';

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  FeedsList,
  ItemsDetails,
  PlayItem,
  //UnReads,
  Navigation,
  'accounts.ui'
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: Podbuild
  })
  .config(config);
 
function config($locationProvider, $urlRouterProvider) {
  'ngInject';
 
  $locationProvider.html5Mode(true);
 
  $urlRouterProvider.otherwise('/feeds');
}
