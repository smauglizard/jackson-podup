import angular from 'angular';
import angularMeteor from 'angular-meteor';
 
import './partyRemove.html';
import { Feeds } from '../../../api/feeds';
import { Items } from '../../../api/items';

class PartyRemove {
  remove() {
    if (this.feed) {
      Feeds.remove({_id:this.feed._id});
      Items.remove({feedId:this.feed._id});

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
