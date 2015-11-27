/**
 * Created by Slavi on 6.11.2015 г..
 */
angular.module('app.services').factory('calculationsService', function(){
  'use strict';

  function calculateBodyWater(gender, age, height, weight){
    var water = 0;
    if(gender === "m"){
      water = 2.447 - (0.09156 * age) + (0.1074 * height) + (0.3362 * weight);
    } else {
      water = -2.097 + (0.1069 * height) + (0.2466 * weight);
    }

    return water;
  }

  function calculateAlcoholWeight(alcoholQuantity, alcoholStrength){
    return (alcoholQuantity * (alcoholStrength / 100)) * 0.79;
  }

  function calculateBAC(alcoholQuantity, alcoholStrength, bodyWater){
    var alcoholWeight = calculateAlcoholWeight(alcoholQuantity, alcoholStrength),
      BAC = (alcoholWeight / bodyWater) * 0.806;
    return Math.roundDecimal(BAC, 3);
  }

  function calculateCurrentBAC(BAC, startTime, metabolismRate){
    var currentTime = new Date(),
      hoursPassed = (currentTime - startTime) / 3600000,
      newBAC = BAC - (metabolismRate * hoursPassed);
    if(newBAC < 0){
      return 0.000;
    }

    return Math.roundDecimal(newBAC, 3);
  }

  function calculateExpireTime(BAC, startTime, metabolismRate){
    var minuteRate = metabolismRate / 60,
      minutesPassed = Math.round(BAC / minuteRate);
    return startTime.addMinutes(minutesPassed);
  }

  return {
    calculateBodyWater: calculateBodyWater,
    calculateBAC: calculateBAC,
    calculateCurrentBAC: calculateCurrentBAC,
    calculateAlcoholWeight: calculateAlcoholWeight,
    calculateExpireTime: calculateExpireTime
  }
});
