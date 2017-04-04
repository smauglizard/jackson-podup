import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';
import './subFeeds.html';
import { Feeds } from '../../../api/feeds';
import { name as FeedsSort } from '../feedsSort/feedsSort';
import { name as FeedAdd } from '../feedAdd/feedAdd';
import { name as PartyRemove } from '../partyRemove/partyRemove';
import { Counts } from 'meteor/tmeasday:publish-counts';
import { Meteor } from 'meteor/meteor';

class subFeeds {
  constructor($scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

    this.perPage = 3;
    this.subFeeds = 1;
    this.page = 1;
    this.sort = {
      name: 1
    };
    this.searchText = ''; 

    this.subscribe('feeds', function() {
    return [{
      sort: this.getReactively('sort'),
      limit: parseInt(this.getReactively('perPage')),
      skip: ((parseInt(this.getReactively('page'))) - 1) * (parseInt(this.getReactively('perPage'))),
      subFeeds: this.subFeeds
    }, this.getReactively('searchText')];
  });


    this.helpers({
      feeds() {
        return Feeds.find({}); //{
          //sort : this.getReactively('sort')
        //}); 
      },
      feedsCount() {
        return Counts.get('numberOfFeeds');
      },
      isLoggedIn() {
        return !!Meteor.userId();
      }
    });
  }
  pageChanged(newPage) {
    this.page = newPage;
  }
  sortChanged(sort) {
    this.sort = sort;
  }
}

const name = 'subFeeds';

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  utilsPagination,
  FeedsSort,
  FeedAdd,
  PartyRemove  
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: subFeeds
})
.config(config);
 
function config($stateProvider) {
  'ngInject';
  $stateProvider
    .state('subFeeds', {
      url: '/subFeeds',
      template: '<sub-feeds></sub-feeds>'
    });
}
