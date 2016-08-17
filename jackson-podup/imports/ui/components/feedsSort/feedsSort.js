import angular from 'angular';
import angularMeteor from 'angular-meteor';
 
import './feedsSort.html';
 
class FeedsSort {
  constructor() {
    this.changed();
  }
 
  changed() {
    this.onChange({
      sort: {
        [this.property]: parseInt(this.order)
      }
    });
  }
}
 
const name = 'feedsSort';
 
// create a module
export default angular.module(name, [
  angularMeteor
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  bindings: {
    onChange: '&',
    property: '@',
    order: '@'
  },
  controllerAs: name,
  controller: FeedsSort
});
