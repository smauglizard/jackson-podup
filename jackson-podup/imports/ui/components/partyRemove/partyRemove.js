import angular from 'angular';
import angularMeteor from 'angular-meteor';
 
import './partyRemove.html';
import { Feeds } from '../../../api/feeds';

class PartyRemove {
  remove() {
    if (this.feed) {
      Feeds.remove(this.feed._id);
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
