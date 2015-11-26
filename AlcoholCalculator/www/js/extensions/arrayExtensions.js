/**
 * Created by Slavi on 17.11.2015 г..
 */
(function(){
  function binaryFind(searchElement) {
    'use strict';

    var minIndex = 0;
    var maxIndex = this.length - 1;
    var currentIndex;
    var currentElement;

    while (minIndex <= maxIndex) {
      currentIndex = (minIndex + maxIndex) / 2 | 0;
      currentElement = this[currentIndex];

      if (currentElement < searchElement) {
        minIndex = currentIndex + 1;
      }
      else if (currentElement > searchElement) {
        maxIndex = currentIndex - 1;
      }
      else {
        return { // Modification
          found: true,
          index: currentIndex
        };
      }
    }

    return { // Modification
      found: false,
      index: currentElement < searchElement ? currentIndex + 1 : currentIndex
    };
  }

  Array.prototype.binaryFind = binaryFind;

  Array.prototype.addSorted = function(element) {
    var res = this.binaryFind(element);
    if (!res.found) this.splice(res.index, 0, element);
  };

  Array.prototype.indexOfObject = function(property, value) {
    for (var i = 0, len = this.length; i < len; i++) {
      if (this[i][property] === value)
        return i;
    }

    return -1;
  }
})();

