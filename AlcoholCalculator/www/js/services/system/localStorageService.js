/**
 * Created by Slavi on 3/2/2015.
 */
angular.module('system.services').factory('localStorageService', function($window){
    return {
        set: function(key, value) {
            $window.localStorage[key] = value;
        },
        get: function(key, defaultValue) {
            return JSON.parse($window.localStorage[key] || defaultValue);
        },
        setObject: function(key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function(key) {
            return JSON.parse($window.localStorage[key] || '{}');
        },
        deleteObject: function(key){
          $window.localStorage.removeItem(key);
        }
    }
});
