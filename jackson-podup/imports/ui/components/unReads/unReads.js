import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';
import { UnReads } from '../../../api/unreads';
import { Counts } from 'meteor/tmeasday:publish-counts';
import './unReads.html';
 
class UnReadsDetails {
  constructor($stateParams, $scope, $reactive) {
    'ngInject';
    $reactive(this).attach($scope);

    this.feedId = $stateParams.feedId;


    this.perPage = 3;
    this.page = 1;
  
    this.subscribe('unreads', function() {
      return [{
        limit: parseInt(this.getReactively('perPage')),
        skip: ((parseInt(this.getReactively('page'))) - 1) * (parseInt(this.getReactively('perPage'))),
        feedId: this.feedId
      }];
    });
 
    this.helpers({
      items() {
        return UnReads.find({feedId: this.feedId});
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
 
const name = 'unReads';
 
// create a module
export default angular.module(name, [
  angularMeteor,
  utilsPagination,
  uiRouter 
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: UnReadsDetails
})
.config(config);
 
function config($stateProvider) {
  'ngInject';
 
  $stateProvider.state('unReads', {
    url: '/unreads/:feedId',
    template: '<unReads></unReads>'
  });
}
