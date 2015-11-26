/**
 * Created by Slavi on 15.11.2015 г..
 */

angular.module('app.services').factory('logService', function($log){
  var basicFormatString = "{0}->{1} = {2}";
  function logTime(datetime, controller, action){
    var str = datetime.toLocaleString();
    $log.debug(basicFormatString.format(controller, action, str));
  }

  function log(val, controller, action){
    $log.debug(basicFormatString.format(controller, action, val));
  }

  return {
    logTime: logTime,
    log: log
  };
});

