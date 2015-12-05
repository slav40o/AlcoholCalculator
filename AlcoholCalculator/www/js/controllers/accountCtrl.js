/**
 * Created by Slavi on 26.11.2015 г..
 */
angular.module('app.controllers')
  .controller('AccountCtrl', function($scope, messageService, accountService, deviceService) {
    'use strict';

    $scope.account = accountService.getCurrent();

    $scope.settings = deviceService.getSettings();

    $scope.saveChanges = function(account, form){
      if (form.$valid){
        accountService.updateAccount(account).then(function(success){
          messageService.showSimpleMessage(success.message);
          // Show message to clear drink history or to recalculate for current;
        }, function(error){
          messageService.showSimpleMessage(error.message);
        })
      } else {
        messageService.showSimpleMessage('Invalid data');
      }
    };
  });
