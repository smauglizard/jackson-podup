import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';
import './feedsList.html';
import { Feeds } from '../../../api/feeds';
//import { name as FeedsSort } from '../feedsSort/feedsSort';
import { name as FeedAdd } from '../feedAdd/feedAdd';
import { name as subFeeds } from '../subFeeds/subFeeds';
import { name as PartyRemove } from '../partyRemove/partyRemove';
import { Counts } from 'meteor/tmeasday:publish-counts';
import { Meteor } from 'meteor/meteor';

class FeedsList {
  constructor($scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);
    //$scope.feed.url='';
    this.perPage = 3;
    this.page = 1;
    this.sort = {
      name: 1
    };
    this.searchText = ''; 

    this.subscribe('feeds', function() {
    return [{
      //sort: this.getReactively('sort'),
      limit: parseInt(this.getReactively('perPage')),
      skip: ((parseInt(this.getReactively('page'))) - 1) * (parseInt(this.getReactively('perPage')))
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

  sub_scribe(url) {
    if(Meteor.isClient){
       console.log("in sub_scribe....");
       Meteor.call('subScribe', url, function(err, result) {
            if(err){
                console.log(err.reason);
            } else {
                console.log(result);
                return;
            }
        });

    }
  }

  pageChanged(newPage) {
    this.page = newPage;
  }
  //sortChanged(sort) {
  //  this.sort = sort;
  //}
}

const name = 'feedsList';

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  utilsPagination,
  FeedAdd,
  PartyRemove,
  subFeeds
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
