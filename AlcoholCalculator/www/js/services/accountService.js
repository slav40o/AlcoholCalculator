/**
 * Created by Slavi on 1.12.2015 г..
 */
angular.module('app.services').factory('accountService', function($q, messageService, localStorageService, calculationsService){
  'use strict';

  function getCurrentAccount(){
    var account = localStorageService.getObject('app-account');
    if(Object.keys(account).length === 0){
      account =  getDefault();
      localStorageService.setObject('app-account', account);
      localStorageService.set('bodyWater', account.bodyWater);
    }

    return account;
  }

  function updateAccount(data){
    var deferred = $q.defer(),
      account = getCurrentAccount(),
      status;

    if(data.firstName){
      if(checkLength(data.firstName, 1, 15)){
        account.firstName = data.firstName;
      } else {
        status = messageService.constructMessage('Invalid first name!', 'Name must be between 1 and 15 characters.');
      }
    }

    if(data.lastName){
      if(checkLength(data.lastName, 1, 15)){
        account.lastName = data.lastName;
      } else {
        status = messageService.constructMessage('Invalid last name!', 'Name must be between 1 and 15 characters.');
      }
    }

    if(data.gender){
      if(data.gender === 'f' || data.gender === 'm'){
        account.gender = data.gender;
      } else {
        status = messageService.constructMessage('Invalid gender!', 'Gender type must be male or female.');
      }
    }

    if(data.age){
      if(checkNumber(data.age, 18, 130)){
        account.age = data.age;
      } else {
        status = messageService.constructMessage('Invalid age!', 'You should be in legal age to drink.');
      }
    }

    if(data.height){
      if(checkNumber(data.height, 50, 300)){
        account.height = data.height;
      } else {
        status = messageService.constructMessage('Invalid height!', 'The value is not acceptable for a human.');
      }
    }

    if(data.weight){
      if(checkNumber(data.weight, 5, 600)){
        account.weight = data.weight;
      } else {
        status = messageService.constructMessage('Invalid weight!', 'The value is not acceptable for a human.');
      }
    }

    if(status){
      deferred.reject(status);
    } else {
      account.bodyWater = calculationsService.calculateBodyWater(account.gender, account.age, account.height, account.weight);
      localStorageService.setObject('app-account', account);
      localStorageService.set('bodyWater', account.bodyWater);
      deferred.resolve(messageService.constructMessage('Update successful!', 'Account information is updated and saved.'));
    }

    return deferred.promise;
  }

  function getDefault(){
    return {
      firstName: 'First name',
      lastName: 'Last name',
      age: 21,
      gender: 'm',
      weight: 75,
      height: 170,
      bodyWater: calculationsService.calculateBodyWater('m', 21, 170, 75)
    };
  }

  // to be extracted to validator service
  function checkLength(string, minLength, maxLength){
    return string.length >= minLength && string.length <= maxLength;
  }

  function checkNumber(num, min, max){
    return num >= min && num <= max;
  }

  return {
    getCurrent: getCurrentAccount,
    updateAccount: updateAccount
  }
});
