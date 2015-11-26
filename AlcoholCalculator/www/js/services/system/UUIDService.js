/**
 * Created by Slavi on 19.11.2015 г..
 */
angular.module('system.services').factory('uuidService', function($log){
  function generateUUID() {
    var d = new Date().getTime();
    return uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random()*16)%16 | 0;
      d = Math.floor(d/16);
      return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
  }

  return {
    generateUUID: generateUUID
  };
});

