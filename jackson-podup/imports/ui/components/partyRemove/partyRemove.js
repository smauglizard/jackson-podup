import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Meteor }from 'meteor/meteor'; 
import './partyRemove.html';
import { Feeds } from '../../../api/feeds';
import { Items } from '../../../api/items';

class PartyRemove {
  remove() {
    if (this.feed) {
      console.log("removing feed" );
      Meteor.users.update({'_id':Meteor.userId()},{'$pull': {'subscriptions': this.feed._id }});    
    }
  }
}
 
const name = 'partyRemove';
 
// create a module
export default angular.module(name, [
  angularMeteor
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  bindings: {
    feed: '<'
  },
  controllerAs: name,
  controller: PartyRemove
});
