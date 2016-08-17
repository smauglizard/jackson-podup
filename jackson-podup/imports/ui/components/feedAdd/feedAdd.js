import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';
import { Feeds } from '../../../api/feeds';
import './feedAdd.html';
//import { check } from 'meteor/check';

class FeedAdd {
    constructor() {
        'ngInject';
        this.party = {};
        this.url='';
    }
 
  submit() {
    if(Meteor.isClient){
       Meteor.call('addFeeds', this.url, function(err, result) {
            if(err){
                console.log(err.reason);
            } else {
                console.log(result)
            }
        });

    this.reset();
    }
  }

  sub_scribe() {
    if(Meteor.isClient){
       Meteor.call('subScribe', this.url, function(err, result) {
            if(err){
                console.log(err.reason);
            } else {
                console.log(result)
            }
        });

    this.reset();
    }
  }

  reset(){
      this.party = {};
  }
}
 
const name = 'feedAdd';
 
// create a module
export default angular.module(name, [
  angularMeteor
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: FeedAdd
});
