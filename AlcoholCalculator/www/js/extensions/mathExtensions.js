/**
 * Created by Slavi on 20.11.2015 г..
 */
(function(){
  Math.roundDecimal = function(num, decimalPlaces){
    var multiplier  = Math.pow(10, decimalPlaces);
    return Math.round(num * multiplier) / multiplier;
  }
})();
