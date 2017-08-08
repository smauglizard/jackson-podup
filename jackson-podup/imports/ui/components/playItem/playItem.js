import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';
import uiRouter from 'angular-ui-router';
import { soundManager } from 'soundmanager2';
import { Items } from '../../../api/items';
import { name as PlayListAdd } from '../playlistAdd/playlistAdd';
import { Listened } from '../../../api/listened';
//import { soundManager } from 'wenape_soundmanager';
//var soundManager = Npm.require('soundmanager2');
import './playItem.html';
//Maybe import a controls component(?)

class PlayItem {
  constructor($stateParams, $reactive, $scope, $sce, $timeout, $http, $window) {
    'ngInject';
    //var item;
    //var self = this;
    //self.url='';
    var arr = [];
  // $window.onpageshow = function(event) {
  //  if (event.persisted) {
  //      $window.location.reload() 
  //  }
  // };  
    //if(!!$window.performance && $window.performance.navigation.type == 2)
//{
  //  $window.location.reload();
//}
    $reactive(this).attach($scope);
    //self.myWindow = angular.element($window);
    //var vitemId = $stateParams.itemId;
    //this.itemId = vitemId;
    this.itemId = $stateParams.itemId;
    var vitemId = this.itemId;
    console.log('this.itemId is: ', this.itemId);
    console.log("json.stringify itemId is :", JSON.stringify(this.itemId));
    //var stringItem = JSON.stringify(itemId);
  
    //doSubscribe = function(){
    this.perPage = 3;
    this.sort = {
      name: 1
    };
    this.searchText = ''; 

    this.subscribe('items', function() {
      console.log('In subscribe....');
      return [{
      //sort: this.getReactively('sort'),
        limit: parseInt(this.getReactively('perPage')),
        skip: ((parseInt(this.getReactively('page'))) - 1) * (parseInt(this.getReactively('perPage')))
      }, this.getReactively('searchText')];
    });
    get_pod = function(){
      //if(Meteor.isServer) {
        console.log("in sub_scribe....");
        Meteor.call('getPod', vitemId, function(err, result) {
          if(err){
            console.log(err.reason);
          } else {
            console.log(result);
            $scope.pod = result;
          }
      });
     //}

    };
    //this.item = item;
    this.helpers({
      item() {
        console.log("in item function");
        return Items.findOne({_id: this.itemId}); 

      },
      listened(){
        return Listened.findOne({itemId: this.getReactively('itemId')});
      },
  
       isLoggedIn() {
        return !!Meteor.userId();
      }
    });
    //};
    //this.url = this.item.url;
    //this.myWindow.history.pushState('', null, './');
    //  this.myWindow.on('popstate', function(){
    //          $location.reload(true);
    //});
    if(!this.item){
      console.log("in item if..");
      get_pod();
      //$scope.item = self.singleItem;
      console.log("$scope.item in this.item if is", this.item);
      //$scope.item = self.item;
      this.url = $scope.pod.url;
    } else {
      console.log("this.item is: ", this.item);
      $scope.item = this.item;
    //this.url = $scope.item.url;
      this.url = this.item.url;
    }
   //this.page = +(location.hash.replace('#', '') || 1);
   // $window.addEventListener( "pageshow", function ( event ) {
  ///var historyTraversal = event.persisted || ( typeof $window.performance != "undefined" && $window.performance.navigation.type === 2 );
  //if ( historyTraversal ) {
    // Handle page restore.
    //$window.location.reload();
  //}
//});
  //deref = $scope.$watch(function() 
  //          { return Meteor.userId();
  //          }, function(n) 
  //             { if(n) {doSubscribe();self.deref()}
  //});

    //this.pageChanged = function(newPage) {
    //  this.page = newPage;
    //  location.hash = newPage;
    //};

  //var hashChange = function() {
  //  this.page = +(location.hash.replace('#', '') || 1);
  //};

  //$window.addEventListener('hashchange', hashChange);
  //$scope.$on('$destroy', function() {
  //  $window.removeEventListener('hashchange', hashChange);
  //});

 
 
    
    //$scope.audioUrl = $sce.trustAsResourceUrl(this.url);
    //$scope.item.displayed = true;
    $scope.podClick = function(e) {
      if (e.target.tagName !== 'A' && e.target.parentNode.tagName !== 'A') {
        console.log("I made it through the if");
        console.log('this podClick is', this.podClick);
        //maybe remove scope.
        return podClick($scope.item);
      }
    };
  console.log("$scope.podClick is...:", this.podClick);
  var current, data, direction, events, filter, lastPod, lastSound, pods, volume;
  console.log("soundManager status: soundManager is", soundManager);
  soundManager.setup({
    //flashVersion: 9,
    useHTML5Audio: true,
    preferFlash: false,
    debugMode: false,
    //url: 'node_modules/Soundmanager2/swf/'
  });
  pods = [];
  lastPod = {};
  lastSound = null;
  volume = 66;
  data = {
    feedSlug: ''
  };
  soundManager.setVolume(volume);
  events = {
    play: function() {
      return $timeout(function() {
        lastPod.paused = false;
        return lastPod.playing = true;
      });
    },
    stop: function() {
      return $timeout(function() {
        lastPod.paused = false;
        return lastPod.playing = false;
      });
    },
    pause: function() {
      return $timeout(function() {
        return lastPod.paused = true;
      });
    },
    resume: function() {
      return $timeout(function() {
        lastPod.paused = false;
        return lastPod.playing = true;
      });
    },
    finish: function() {
      return $timeout(function() {
        lastPod.paused = false;
        lastPod.playing = false;
        lastPod.position = '';
        return skip(lastPod);
      });
    },
    whileplaying: function() {
      return $timeout(function() {
        lastPod.playPercent = lastSound.position / getDurationEstimate(lastSound) * 100;
        lastPod.position = getTime(lastSound.position) + ' / ' + getTime(getDurationEstimate(lastSound));
        if (lastPod.playPercent > 10 && !lastPod.reportedListen) {
          //lastPod.reportedListen = true;
          //return $http.post('/api/report-listen', {
          //  podId: lastPod._id
          self.addItem();
          //});
        }
      });
    },
    whileloading: function() {
      return $timeout(function() {
        return lastPod.loadPercent = lastSound.bytesLoaded / lastSound.bytesTotal * 100;
      });
    },
    error: function(err) {
      return console.log(err);
    }
  };
   addItem = function(){
     console.trace();
     console.log("adding item...");
     Listened.insert({
       userId: Meteor.userId(), 
       title:this.item.title,
       itemId:this.itemId, 
       url:this.item.url, 
       feedId:this.item.feedId,
       pubDate:this.item.pubDate,
       image:this.item.image
     });
    };

  getTime = function(nMSec) {
    var min, nSec, sec;
    nSec = Math.floor(nMSec / 1000);
    min = Math.floor(nSec / 60);
    sec = nSec - (min * 60);
    return min + ':' + (sec < 10 ? '0' + sec : sec);
  };
  getDurationEstimate = function(oSound) {
    if (oSound.instanceOptions.isMovieStar) {
      return oSound.duration;
    } else {
      return oSound.durationEstimate || 0;
    }
  };
  skip = function(pod) {
    console.log("pod in skip is", pod);
    var foundPod, j, len, mpod;
    foundPod = false;
    if (!pod) {
      foundPod = true;
      pod = {
        url: ''
      };
    }
    for (j = 0, len = pods.length; j < len; j++) {
      mpod = pods[j];
      if (mpod.url === pod.url) {
        foundPod = true;
      } else {
        if (foundPod && mpod.displayed) {
          return togglePlay(mpod);
        }
      }
    }
  };
  togglePlay = function(item) {
    if (lastSound && lastSound.id === item.url) {
      if (lastSound.readyState !== 2) {
        if (lastSound.playState !== 1) {
          return lastSound.play();
        } else {
          return lastSound.togglePause();
        }
      }
    } else {
      if (lastSound) {
        soundManager.stop(lastSound.id);
        soundManager.unload(lastSound.id);
      }
      if (lastPod) {
        lastPod.playing = false;
        lastPod.position = '';
      }
      console.log('creating sound', item);
      lastSound = soundManager.createSound({
        id: item.url,
        url: decodeURI(item.url),
        onplay: events.play,
        onstop: events.stop,
        onpause: events.pause,
        onresume: events.resume,
        onfinish: events.finish,
        whileplaying: events.whileplaying,
        whileloading: events.whileloading,
        onerror: events.error
      });
      lastPod = item;
      lastSound.play();
      //database.setCurrent(lastPod);
      return soundManager.setVolume(volume);
    }
  };
  sortPods = function() {
    if (direction && direction.value === 'ASC') {
      return pods.sort(function(a, b) {
        return a.pubDate - b.pubDate;
      });
    } else {
      return pods.sort(function(a, b) {
        return b.pubDate - a.pubDate;
      });
    }
  };
  scrollABit = function() {
    return $timeout(function() {
      return $window.scrollTo($window.scrollX, $window.scrollY + 1);
    });
  };
  //direction = database.getDirection();
  //filter = database.getFilter();
  //current = database.getCurrent();
  //return {
  getPods = function() {
    return pods;
  };
  getPod = function() {
      return lastPod;
  };
  podClick = function(item) {
      console.log('podClick');
    if (!item) {
        return skip(null);
    } else {
        return togglePlay(item);
    }
  };
  setVolume = function(vol) {
      volume = vol;
      return soundManager.setVolume(volume);
  };
  getVolume = function() {
      return volume;
  };
   // fetchPods: function() {
   //   return $http.post('/api/pods', data).then(function(response) {
   //     return $timeout(function() {
   //       var i, j, k, l, len, len1, len2, pod, ref, ref1, rpod;
   //       for (j = 0, len = pods.length; j < len; j++) {
   //         pod = pods[j];
   //         pod.tokeep = false;
   //         ref = response.data;
   //         for (k = 0, len1 = ref.length; k < len1; k++) {
   //           rpod = ref[k];
   //           if (pod.url === rpod.url) {
   //             pod.tokeep = true;
   //             rpod.exists = true;
   //             break;
   //           }
   //         }
   //       }
   //       i = pods.length;
   //       while (i-- > 0) {
   //         if (!pods[i].tokeep && pods[i].url !== lastPod.url) {
   //           pods.splice(i, 1);
   //         }
   //       }
   //       ref1 = response.data;
   //       for (l = 0, len2 = ref1.length; l < len2; l++) {
   //         rpod = ref1[l];
   //         if (!rpod.exists) {
   //           pods.push(rpod);
   //         }
   //       }
   //       sortPods();
   //       return scrollABit();
   //     });
   //   }, function() {
   //     return console.log('error');
   //   });
   // },
  setPosition = function(pos) {
      var nMsecOffset;
      nMsecOffset = Math.floor(pos * getDurationEstimate(lastSound));
      if (!isNaN(nMsecOffset)) {
        nMsecOffset = Math.min(nMsecOffset, lastSound.duration);
      }
      if (!isNaN(nMsecOffset)) {
        lastSound.setPosition(nMsecOffset);
      }
      return lastSound.resume();
   };
    setFeedSlug = function(slug) {
      return data.feedSlug = slug;
    };
   // setDirection = function(dir) {
   //   database.setDirection({
   //     value: dir
   //   });
   //   direction = database.getDirection();
   //   sortPods();
   //   return scrollABit();
   // };
    getDirection = function() {
      if (direction && direction.value) {
        return direction.value;
      }
      return 'DESC';
    };
   // setFilter = function(newFilter) {
   //   database.setFilter({
   //     value: newFilter
   //   });
   //   filter = database.getFilter();
   //   return scrollABit();
   // };
    getFilter = function() {
      if (filter && filter.value) {
        return filter.value;
      }
      return 'unlistened';
    };
    scrollABit = function() {
      return scrollABit();
    };
  //}; return close


    
    
  } // constructor close
  //itemSeen(){
  //  this.addItem(); 
  //}  
}
 
const name = 'playItem';
 
// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  PlayListAdd
]).component(name, {
  templateUrl: `imports/ui/components/${name}/${name}.html`,
  controllerAs: name,
  controller: PlayItem
}).config(config);
 
function config($stateProvider) {
  'ngInject';
 
  $stateProvider.state('playItem', {
    url: '/items/:itemId',
    template: '<play-item></play-item>'
  });
}
