import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';
import { Items } from '../../../api/items';
import { Counts } from 'meteor/tmeasday:publish-counts';
import './itemsDetails.html';
 
class ItemsDetails {
  constructor($stateParams, $scope, $reactive) {
    'ngInject';
    $reactive(this).attach($scope);

    this.feedId = $stateParams.feedId;


    this.perPage = 3;
    this.page = 1;
    //this.sort = {
    //  name: 1
    //};
    //this.subscibe('feeds');
    this.subscribe('items', function() {
      return [{
        //sort: $scope.getReactively('sort'),
        limit: parseInt(this.getReactively('perPage')),
        skip: ((parseInt(this.getReactively('page'))) - 1) * (parseInt(this.getReactively('perPage')))
      }];
    });
 
    this.helpers({
      items() {
        return Items.find({feedId: this.feedId}); //, {
            //sort: this.getReactively('sort')
        //});
      },
      itemsCount() {
        return Counts.get('numberOfItems');
      }
    });
  }
  pageChanged(newPage) {
    this.page = newPage;
  }
}
 
const name = 'itemsDetails';
 
// create a module
export default angular.module(name, [
  angularMeteor,
  utilsPagination,
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
