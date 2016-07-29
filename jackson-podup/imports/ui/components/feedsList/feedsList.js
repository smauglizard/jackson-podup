import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import './feedsList.html';
import { Feeds } from '../../../api/feeds';
import { name as FeedAdd } from '../feedAdd/feedAdd';
import { name as PartyRemove } from '../partyRemove/partyRemove';

class FeedsList {
  constructor($scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

    this.helpers({
      feeds() {
        return Feeds.find({});
      }
    });
  }
}

const name = 'feedsList';

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  FeedAdd,
  PartyRemove  
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: FeedsList
})
.config(config);
 
function config($stateProvider) {
  'ngInject';
  $stateProvider
    .state('feeds', {
      url: '/feeds',
      template: '<feeds-list></feeds-list>'
    });
}
