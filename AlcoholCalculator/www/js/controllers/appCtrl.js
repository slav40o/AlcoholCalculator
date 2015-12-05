/**
 * Created by Slavi on 26.11.2015 г..
 */
angular.module('app.controllers', [])
  .controller('AppCtrl', function ($scope, drinksService, deviceService) {
    'use strict';

    $scope.clearHistory = function(){
      drinksService.clearHistory();
      deviceService.setSettings({});
    };
  });

