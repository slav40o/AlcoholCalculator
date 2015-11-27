/**
 * Created by Slavi on 27.11.2015 г..
 */
angular.module('app.services', []).factory('messageService', function ($window, $cordovaToast, deviceService) {

  function showSimpleMessage(message){
    if(deviceService.isMobile()){
      $cordovaToast.showLongBottom(message);
    } else {
      $window.alert(message);
    }
  }

  return {
    showSimpleMessage: showSimpleMessage,
    constructError: function (message, content) {
      return {
        error: {
          message: message,
          content: content
        }
      }
    },

    constructMessage: function (message, content) {
      return {
          message: message,
          content: content
        };
      }
  };
});

