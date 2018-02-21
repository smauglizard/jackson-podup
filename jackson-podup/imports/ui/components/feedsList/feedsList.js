import angular from 'angular';
//import Location from 'angular';
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
 constructor($scope, $reactive, $window) {
   'ngInject';
   console.log('constructor');
   var self = this;

   $reactive(self).attach($scope);
  var bootstrap_enabled = (typeof $().modal == 'function');
   console.log("bootstrap_enabled is", bootstrap_enabled);
   doSubscribe = function(){
    self.perPage = 3;
    self.sort = {
      name: 1
    };
    self.searchText = ''; 

    self.subscribe('feeds', function() {
      return [{
      //sort: this.getReactively('sort'),
        limit: parseInt(this.getReactively('perPage')),
        skip: ((parseInt(this.getReactively('page'))) - 1) * (parseInt(this.getReactively('perPage')))
      }, this.getReactively('searchText')];
    });
   
     self.helpers({
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
  };

  self.page = +(location.hash.replace('#', '') || 1);

  deref = $scope.$watch(function() 
            { return Meteor.userId();
            }, function(n) 
               { if(n) {doSubscribe();self.deref()}
            });

  self.pageChanged = function(newPage) {
    self.page = newPage;
    location.hash = newPage;
  };

  var hashChange = function() {
    self.page = +(location.hash.replace('#', '') || 1);
  };

  $window.addEventListener('hashchange', hashChange);
  $scope.$on('$destroy', function() {
    $window.removeEventListener('hashchange', hashChange);
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

// pageChanged(newPage) {
//    $scope.page = newPage;
//    location.hash = newPage;
// }
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
