/**
 * Created by Slavi on 2.12.2015 г..
 */
angular.module('app.services').factory('convertService', function(deviceService){
  'use strict';

  function convertToMetric(data){
    var settings = deviceService.getSettings();
    if(data.weight && settings.weight === 'lb'){
      data.weight = Math.roundDecimal(data.weight / 2.2046, 2);
    }

    if(data.height && settings.height === 'ft'){
      data.height = Math.roundDecimal(data.height * 30.48, 2);
    }

    if(data.volume && settings.volume === 'oz'){
      data.volume = Math.roundDecimal(data.volume * 29.5735, 2);
    }

    return data;
  }

  function convertFromMetric(data){
    var settings = deviceService.getSettings();
    if(data.weight && settings.weight === 'kg'){
      data.weight = Math.roundDecimal(data.weight * 2.2046, 2);
    }

    if(data.height && settings.height === 'cm'){
      data.height = Math.roundDecimal(data.height / 30.48, 2);
    }

    if(data.volume && settings.volume === 'ml'){
      data.volume = Math.roundDecimal(data.volume / 29.5735, 2);
    }

    return data;
  }

  return {
    convertToMetric: convertToMetric,
    convertFromMetric: convertFromMetric
  }
});
