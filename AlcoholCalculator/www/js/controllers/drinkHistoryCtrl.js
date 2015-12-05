/**
 * Created by Slavi on 26.11.2015 г..
 */
angular.module('app.controllers')
  .controller('DrinkHistoryCtrl', function($scope, $state, drinksService, logService, localStorageService, messageService, deviceService) {
    'use strict';

    $scope.settings = deviceService.getSettings();
    $scope.$on('$ionicView.beforeEnter', function(){
      var isDrinkAdded = localStorageService.get('drink-state-changed', false);
      if(isDrinkAdded){
        reloadDrinks();
      }
    });

    $scope.allDrinks = drinksService.getHistory();
    $scope.deleteDrink = function(drink){
      if(drink && drink.id){
        drinksService.deleteDrink(drink.id).then(function(success){
          messageService.showSimpleMessage(success.message);
          removeDrinkFromList(drink);
        }, function(error){
          messageService.showSimpleMessage(error.message);
        });
      } else {
        logService.log('Wrong Id','DrinkHistoryCtrl','Delete drink');
        //TO DO: Show error!
        messageService.showSimpleMessage('Delete fail!Wrong drink id.');
      }
    };

    function removeDrinkFromList(drink){
      var index = $scope.allDrinks.indexOfObject('id', drink.id);
      $scope.allDrinks.splice(index, 1);
    }

    function reloadDrinks(){
      $scope.allDrinks = drinksService.getHistory();
      $scope.count = $scope.allDrinks.length;
      localStorageService.set('drink-state-changed', false);
      logService.log('Reloaded','DrinkHistoryCtrl','reload drink list');
    }
  });
