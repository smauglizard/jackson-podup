import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import { Items } from '../../../api/items'; 
import './itemsDetails.html';
 
class ItemsDetails {
  constructor($stateParams, $scope, $reactive) {
    'ngInject';
    $reactive(this).attach($scope);

    this.feedId = $stateParams.feedId;

    this.helpers({
            items() {
                return Items.find({feedId: this.feedId});
            }
    });
  }
}
 
const name = 'itemsDetails';
 
// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter 
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: ItemsDetails
})
.config(config);
 
function config($stateProvider) {
  'ngInject';
 
  $stateProvider.state('itemsDetails', {
    url: '/feeds/:feedId',
    template: '<items-details></items-details>'
  });
}
