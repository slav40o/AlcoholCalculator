/**
 * Created by Slavi on 26.11.2015 г..
 */
angular.module('app.controllers')
  .controller('DrinkCtrl', function ($scope, $ionicModal, $stateParams, $state, deviceService, drinksService, logService) {
    'use strict';
    var id = $stateParams.id;
    setupPickers(new Date(), 0);

    if (!id || id == "new") {
      $scope.drink = drinksService.getLast();
      $scope.action = "Add";
      initialize();
    } else {
      drinksService.getById(id).then(function (drink) {
        $scope.drink = drink;
        $scope.drink.time = new Date(drink.time);
        $scope.action = "Change";
        initialize();
      }, function (error) {
        //TO DO: show error
        logService.logTime(error.message, 'AddNewDrinkCtrl', 'Initialize error');
      });
    }

    $scope.addDrink = function (drink, form) {
      if (form.$valid && $scope.drink.time) {
        var result = drinksService.addDrink($scope.drink);
        if(result.error){
          //TO DO: SHOW ERROR
        } else {
          $state.go('app.dash');
        }
      } else {
        //TO DO: show appropriate message
        //showError('Invalid data!', deviceService, $cordovaToast)
      }
    };

    function initialize() {
      var hours = $scope.drink.time.getHours(),
        minutes = $scope.drink.time.getMinutes(),
        seconds = ((hours * 60) + minutes) * 60;
      setTime(seconds);
      setupPickers($scope.drink.time, seconds);

      drinksService.getDrinksList().then(function (drinksList) {
        $scope.drinksList = drinksList;
      }, function () {
        $scope.drinksList = [];
      });
      setupDrinksModal();
    }

    function setupPickers(date, seconds) {
      $scope.timePickerObject = {
        inputEpochTime: (seconds),  //Optional
        step: 5,  //Optional
        format: 12,  //Optional
        titleLabel: '12-hour Format',  //Optional
        setLabel: 'Set',  //Optional
        closeLabel: 'Close',  //Optional
        setButtonType: 'button-positive',  //Optional
        closeButtonType: 'button-stable',  //Optional
        callback: function (val) {    //Mandatory
          if (val) setTime(val);

        }
      };

      $scope.datepickerObject = {
        titleLabel: 'Change date',  //Optional
        todayLabel: 'Today',  //Optional
        setLabel: 'Set',  //Optional
        setButtonType: 'button-positive',  //Optional
        todayButtonType: 'button-stable',  //Optional
        inputDate: date,  //Optional
        mondayFirst: true,  //Optional
        //  weekDaysList: weekDaysList, //Optional
        //  monthList: monthList, //Optional
        templateType: 'modal', //Optional
        showTodayButton: 'true', //Optional
        modalHeaderColor: 'bar-positive', //Optional
        modalFooterColor: 'bar-positive', //Optional
        callback: function (val) {  //Mandatory
          if (val) setDrinkDate(val);
        },
        dateFormat: 'dd-MM-yyyy', //Optional
        closeOnSelect: false //Optional
      };
    }

    function setupDrinksModal() {
      $ionicModal.fromTemplateUrl('templates/partials/choose-drink-modal.html', {
        scope: $scope,
        animation: 'slide-in-left-right'
      }).then(function (modal) {
        $scope.modal = modal
      });

      $scope.openModal = function () {
        $scope.modal.show()
      };

      $scope.closeModal = function (drinkTemplate) {
        setDrinkProps(drinkTemplate);
        $scope.modal.hide();
      };

      $scope.$on('$destroy', function () {
        $scope.modal.remove();
      });
    }

    function setTime(seconds) {
      var hours = Math.floor(seconds / 60 / 60),
        minutes = Math.round((seconds - (hours * 60 * 60)) / 60);
      $scope.minutes = minutes;
      $scope.hours = hours;
      setDrinkTime(hours, minutes);
    }

    function setDrinkTime(hours, minutes) {
      $scope.drink.time.setMinutes(minutes);
      $scope.drink.time.setHours(hours);
      logService.logTime($scope.drink.time, 'AddNewDrinkCtrl', 'time set');
    }

    function setDrinkDate(date) {
      $scope.drink.time = date;
      $scope.drink.time.setMinutes($scope.minutes);
      $scope.drink.time.setHours($scope.hours);
      $scope.datepickerObject.inputDate = date;
      logService.logTime($scope.drink.time, 'AddNewDrinkCtrl', 'date set');
    }

    function setDrinkProps(drink) {
      $scope.drink.type = drink.type;
      $scope.drink.img = drink.img;
      $scope.drink.strength = drink.strength;
      $scope.drink.quantity = drink.quantity;
    }
  });
