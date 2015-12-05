/**
 * Created by Slavi on 26.11.2015 г..
 */
angular.module('app.controllers')
  .controller('SettingsCtrl', function($scope, $q, deviceService, drinksService, accountService, convertService) {
    'use strict';

    $scope.settings = deviceService.getSettings();
    initialSettings($scope.settings);

    $scope.changeSettings = function(settingType){
      if(settingType !== 'volume'){
        recalculateAccount().then(function(){
          deviceService.setSettings( $scope.settings );
        });
      } else {
        recalculateDrinks().then(function(){
          deviceService.setSettings( $scope.settings );
        });
      }
    };

    function initialSettings(settings){
      if(settings.volume == 'ml'){
        $scope.mlSelected = true;
      } else {
        $scope.ozSelected = true;
      }

      if(settings.height == 'cm'){
        $scope.cmSelected = true;
      }else {
        $scope.ftSelected = true;
      }

      if(settings.weight == 'kg'){
        $scope.kgSelected = true;
      }else {
        $scope.lbSelected = true;
      }
    }

    function recalculateAccount(){
      var deferred = $q.defer(),
        weight, height,
        account = accountService.getCurrent(),
        newSettings = $scope.settings,
        oldSettings = deviceService.getSettings();

      if(oldSettings.weight == 'kg' && newSettings.weight =='lb'){
        weight = convertService.convertFromMetric({weight: account.weight}).weight;
      } else if(oldSettings.weight == 'lb' && newSettings.weight =='kg'){
        weight = convertService.convertToMetric({weight: account.weight}).weight;
      }

      if(oldSettings.height == 'cm' && newSettings.height =='ft'){
        height = convertService.convertFromMetric({height: account.height}).height;
      } else if(oldSettings.height == 'ft' && newSettings.height =='cm'){
        height = convertService.convertToMetric({height: account.height}).height;
      }

      accountService.updateAccount({
        height: height,
        weight: weight
      }).then(function(success){
        deferred.resolve(success);
      }, function(error){
        deferred.reject(error);
      });


      return deferred.promise;
    }

    function recalculateDrinks(){
      var deferred = $q.defer();
      drinksService.getDrinksList().then(function(success){
        var drinks = success,
          oldSettings = deviceService.getSettings(),
          newSettings = $scope.settings,
          convertAction = convertService.convertToMetric;
        if(oldSettings.volume == 'ml' && newSettings.volume == 'oz'){
          convertAction = convertService.convertFromMetric;
        }

        for(var i = 0; i < drinks.length; i++){
          drinks[i].quantity = convertAction({volume: drinks[i].quantity})
        }

        drinksService.setHistory(drinks);
        deferred.resolve(success);
      }, function(error){
        deferred.reject(error);
      });

      return deferred.promise;
    }
  });
