import angular from 'angular';
import angularMeteor from 'angular-meteor';
import angularMoment from 'angular-moment';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';
import { Items } from '../../../api/items';
import { Counts } from 'meteor/tmeasday:publish-counts';
import './itemsDetails.html';

class ItemsDetails {
  constructor($stateParams, $scope, $reactive, moment) {
    'ngInject';

    $reactive(this).attach($scope);

    this.feedId = $stateParams.feedId;
    this.period = $stateParams.period;

    this.perPage = 3;
    this.page = 1;
    this.searchText = '';
    this.date = new Date();
    var startDate = moment();

    if(this.period == 'weeks') {
       this.dateFrom = startDate.subtract(7, 'days').toDate();
       this.dateTo = this.date;
    } else if(this.period == 'months') {
        this.dateFrom = startDate.subtract(1, 'months').toDate();
        this.dateTo = this.date;
    } else if(this.period == 'prev-months') {
        this.dateFrom = startDate.subtract(5, 'years').toDate();
        this.dateTo = startDate.subtract(1, 'months').toDate();
    }

    this.subscribe('items', function() {
      return [{
        limit: parseInt(this.getReactively('perPage')),
        skip: ((parseInt(this.getReactively('page'))) - 1) * (parseInt(this.getReactively('perPage'))),
        feedId: this.feedId,
        dateFrom: this.dateFrom,
        dateTo: this.dateTo
      }, this.getReactively('searchText') ];
    });
 
    this.helpers({
      items() {
        return Items.find({feedId: this.feedId});
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
  uiRouter,
  angularMoment
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: ItemsDetails
})
.config(config);
 
function config($stateProvider) {
  'ngInject';
 
  $stateProvider.state('itemsDetails', {
    url: '/feeds/:feedId?period',
    template: '<items-details></items-details>'
  });
}
