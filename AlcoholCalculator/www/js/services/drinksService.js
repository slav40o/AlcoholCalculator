/**
 * Created by Slavi on 10.11.2015 г..
 */
angular.module('app.services')
  .factory('drinksService', function($http, $q, logService, localStorageService, calculationsService, uuidService){
  'use strict';

  function addDrink(drink){
    var drinks = getHistory();
    var result = addDrinkElement(drink, drinks);
    setHistory(drinks);
    //control drink and return result status
    localStorageService.set('drink-state-changed', true);
    localStorageService.setObject('last-drink', drink);
    return result;
  }

  function createNewDrink() {
    var drink = localStorageService.getObject('last-drink');
    drink.time = new Date();
    drink.id = uuidService.generateUUID();
    return drink;
  }

  function getHistory(){
    var drinksObject = localStorageService.getObject('drink-history');
    return drinksObject.history || [];
  }

  function setHistory(drinks){
    var drinksObject = localStorageService.getObject('drink-history');
    drinksObject.history = drinks;
    localStorageService.setObject('drink-history', drinksObject);
  }

  function addDrinkElement(drink, drinksList){
    var bodyWater = localStorageService.get('bodyWater', 0);
    if(bodyWater <= 0) {
      return constructError('Body water is not calculated!', 'Body water should be calculated when the account information is changed.');
    }

    drink.weight = calculationsService.calculateAlcoholWeight(drink.quantity, drink.strength);
    drink.BAC = calculationsService.calculateBAC(drink.quantity, drink.strength, bodyWater);
    drink.expireTime = calculationsService.calculateExpireTime(drink.BAC, new Date(drink.time), 0.13);
    drinksList.push(drink);
    drinksList.sort(function(a, b){
      var a1, b1;
      if(a.time instanceof Date){
        a1 = a.time;
      } else {
        a1 = new Date(a.time);
      }

      if(b.time instanceof Date){
        b1 = b.time;
      } else {
        b1 = new Date(b.time);
      }
      return b1 - a1;
    });

    var result = constructSuccess('Successfully added!', 'Drink was added to the drink history');
    logService.log(JSON.stringify(drink), 'drinksService', 'new drink has been created');
    return result.drink = drink;
  }

  function getDrinksList(){
    var deferred = $q.defer(),
      drinkTypes = localStorageService.getObject('drinkTypes');

    if(Object.keys(drinkTypes).length == 0 || drinkTypes.length < 5){
     //$http.get('data/drink-types.json')
     //  .success(function(data){
     //    drinkTypes = data.drinkTypes;
     //    deferred.resolve(drinkTypes);
     //}).error(function(error){
     //    deferred.reject(error)
     //  })
      drinkTypes = drinkList();
      localStorageService.setObject('drinkTypes', drinkTypes);
      deferred.resolve(drinkTypes);
    } else {
      deferred.resolve(drinkTypes);
    }

    return deferred.promise;
  }
    function getById(id){
      var deferred = $q.defer(),
        drinks = getHistory(),
        index = drinks.indexOfObject('id', id);
      if(index < 0){
        var error = constructError('Invalid drink id!', 'Drink with id {0} is not found in the drink history.'.format(id));
        deferred.reject(error);
      } else {
        var drink = drinks[index];
        deferred.resolve(drink);
      }

      return deferred.promise;
    }

  function deleteDrink(id){
    var drinks = getHistory(),
      index = drinks.indexOfObject('id', id);
    if(index < 0){
      return constructError('Invalid drink id!', 'Drink with id {0} is not found in the drink history.'.format(id));
    }
    drinks.splice(index, 1);
    setHistory(drinks);
    localStorageService.set('drink-state-changed', true);
    return constructSuccess('Deletion successful!', 'Drink with id {0} is removed from the drink history.'.format(id));
  }

  function updateDrink(id, data){
    var drinks = getHistory(),
      index = drinks.indexOfObject('id', id);
    if(index < 0){
      return constructError('Invalid drink id!', 'Drink with id {0} is not found in the drink history.'.format(id));
    }
    var drink = drinks[index],
      isChanged = false;
    if(data.strength && data.strength > 0 && data.strength < 100){
      drink.strength = data.strength;
      isChanged = true;
    }

    if(data.quantity && data.quantity > 0){
      drink.quantity = data.quantity;
      isChanged = true;
    }

    if(data.time){
      drink.time = data.time;
      isChanged = true;
    }

    if(data.type){
      drink.type = data.type;
      isChanged = true;
    }

    if(isChanged){
      var bodyWater = localStorageService.get('bodyWater', 0);
      if(bodyWater <= 0) {
        return constructError('Body water is not calculated!', 'Could not update information about drink: {0}.'.format(id));
      }

      drink.BAC = calculationsService.calculateBAC(drink.quantity, drink.strength, bodyWater);
      localStorageService.set('drink-state-changed', true);
      setHistory(drinks);
      var result = constructSuccess('Drink info successfully updated!', 'Drink with id: {} is updated'.format(id));
      return result.drink = drink;
    }
  }

  /* Just for now...load them from api */
  function drinkList(){
    return  [
      {
        "id": 1,
        "strength": 40,
        "quantity": 50,
        "type": "Whisky",
        "brand": "",
        "img": "img/whisky.jpg"
      }, {
        "id": 2,
        "strength": 15,
        "quantity": 100,
        "type": "Whine",
        "brand": "",
        "img": "img/whine.jpg"
      },{
        "id": 3,
        "strength": 4.5,
        "quantity": 500,
        "type": "Beer",
        "brand": "",
        "img": "img/beer.jpg"
      }, {
        "id": 5,
        "strength": 15,
        "quantity": 50,
        "type": "Liqueur",
        "brand": "",
        "img": "img/liqueur.jpg"
      }, {
        "id": 6,
        "strength": 40,
        "quantity": 25,
        "type": "Tequila",
        "brand": "",
        "img": "img/tequila.jpg"
      }, {
        "id": 7,
        "strength": 40,
        "quantity": 50,
        "type": "Vodka",
        "brand": "",
        "img": "img/vodka.jpg"
      }, {
        "id": 8,
        "strength": 40,
        "quantity": 50,
        "type": "Brandy",
        "brand": "",
        "img": "img/brandy.jpg"
      }, {
        "id": 9,
        "strength": 38,
        "quantity": 50,
        "type": "Rum",
        "brand": "",
        "img": "img/rum.jpg"
      }, {
        "id": 11,
        "strength": 40,
        "quantity": 50,
        "type": "Gin",
        "brand": "",
        "img": "img/gin.jpg"
      }, {
        "id": 12,
        "strength": 45,
        "quantity": 50,
        "type": "Rakia",
        "brand": "",
        "img": "img/rakia.jpg"
      }, {
        "id": 13,
        "strength": 80,
        "quantity": 25,
        "type": "Absinthe",
        "brand": "",
        "img": "img/absinthe.jpg"
      }, {
        "id": 14,
        "strength": 40,
        "quantity": 50,
        "type": "Other",
        "brand": "",
        "img": "img/alcohol.jpg"
      }
    ]
  }

  //Extract to external service
  function constructError(message, content){
    return {
      error: {
        message: message,
        content: content
      }
    };
  }

  function constructSuccess(message, content){
    return {
      success: {
        message: message,
        content: content
      }
    };
  }

  return {
    addDrink: addDrink,
    getById: getById,
    getLast: createNewDrink,
    getHistory: getHistory,
    getDrinksList: getDrinksList,
    deleteDrink: deleteDrink,
    updateDrink: updateDrink
  }
});
