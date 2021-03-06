// Generated by CoffeeScript 1.9.3
(function() {
  var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  angular.module('localytics.directives', []);

  angular.module('localytics.directives').directive('chosen', [
    '$timeout', function($timeout) {
      var CHOSEN_OPTION_WHITELIST, NG_OPTIONS_REGEXP, isEmpty, snakeCase;
      NG_OPTIONS_REGEXP = /^\s*(.*?)(?:\s+as\s+(.*?))?(?:\s+group\s+by\s+(.*))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+(.*?)(?:\s+track\s+by\s+(.*?))?$/;
      CHOSEN_OPTION_WHITELIST = ['noResultsText', 'allowSingleDeselect', 'disableSearchThreshold', 'disableSearch', 'enableSplitWordSearch', 'inheritSelectClasses', 'maxSelectedOptions', 'placeholderTextMultiple', 'placeholderTextSingle', 'searchContains', 'singleBackstrokeDelete', 'displayDisabledOptions', 'displaySelectedOptions', 'width', 'displayTruncatedOptions', 'maxDisplayLength'];
      snakeCase = function(input) {
        return input.replace(/[A-Z]/g, function($1) {
          return "_" + ($1.toLowerCase());
        });
      };
      isEmpty = function(value) {
        var key;
        if (angular.isArray(value)) {
          return value.length === 0;
        } else if (angular.isObject(value)) {
          for (key in value) {
            if (value.hasOwnProperty(key)) {
              return false;
            }
          }
        }
        return true;
      };
      return {
        restrict: 'A',
        require: '?ngModel',
        priority: 1,
        link: function(scope, element, attr, ngModel) {
          var chosen, defaultText, disableWithMessage, empty, initOrUpdate, match, options, origRender, removeEmptyMessage, startLoading, stopLoading, valuesExpr, viewWatch, addOptionTitle;
          element.addClass('localytics-chosen');
          options = scope.$eval(attr.chosen) || {};
          angular.forEach(attr, function(value, key) {
            if (indexOf.call(CHOSEN_OPTION_WHITELIST, key) >= 0) {
              return options[snakeCase(key)] = scope.$eval(value);
            }
          });
          startLoading = function() {
            return element.addClass('loading').attr('disabled', true).trigger('chosen:updated');
          };
          stopLoading = function() {
            return element.removeClass('loading').attr('disabled', false).trigger('chosen:updated');
          };
          addOptionTitle = function() {
            if (attr.ngOptions && ngModel) {
              var dataSource = scope.$eval(valuesExpr);
              // Adding title in case of array of options and object data source
              if (dataSource && typeof dataSource === 'object') {
                  var dataSourceList;
                  // Convert object into array first and then assign titles to all options according to values of object
                  if(!(dataSource instanceof Array)) {
                      dataSourceList = Object.keys(dataSource).map(function(key) {
                          return dataSource[key]
                      })
                  }
                  else {
                      dataSourceList = dataSource;
                  }
                  var optionElements = $(element).find("option");
                  // As need to assign title only to dynamic option element created by ng-options, so traverse the option elements from last
                  for (var index=dataSourceList.length - 1,lastOptionIndex =  optionElements.length - 1;index>= 0;index--,lastOptionIndex--){
                      var elem = optionElements[lastOptionIndex];
                      if(dataSourceList[index].tooltip_text) {
                          $(elem).attr("title", dataSourceList[index].tooltip_text);
                      }
                  }
              }
            }
          };
          chosen = null;
          defaultText = null;
          empty = false;
          initOrUpdate = function() {
            if (chosen) {
              return element.trigger('chosen:updated');
            } else {
              chosen = element.chosen(options).data('chosen');
              defaultText = chosen ? chosen.default_text : '';
              return defaultText;
            }
          };
          removeEmptyMessage = function() {
            empty = false;
            return element.attr('data-placeholder', defaultText);
          };
          disableWithMessage = function() {
            if (!chosen) {
              return;
            }
            empty = true;
            return element.attr('data-placeholder', chosen.results_none_found).attr('disabled', true).trigger('chosen:updated');
          };
          if (ngModel) {
            origRender = ngModel.$render;
            ngModel.$render = function() {
              origRender();
              return initOrUpdate();
            };
            if (attr.multiple) {
              viewWatch = function() {
                return ngModel.$viewValue;
              };
              scope.$watch(viewWatch, ngModel.$render, true);
            }
          } else {
            initOrUpdate();
          }
          attr.$observe('disabled', function() {
            return element.trigger('chosen:updated');
          });
          if (attr.ngOptions && ngModel) {
            match = attr.ngOptions.match(NG_OPTIONS_REGEXP);
            valuesExpr = match[7];
            scope.$watchCollection(valuesExpr, function(newVal, oldVal) {
              var timer;
              return timer = $timeout(function() {
                if (angular.isUndefined(newVal)) {
                  return startLoading();
                } else {
                  if (empty) {
                    removeEmptyMessage();
                  }
                  addOptionTitle();
                  stopLoading();
                  if (isEmpty(newVal)) {
                    return disableWithMessage();
                  }
                }
              });
            });
            return scope.$on('$destroy', function(event) {
              if (typeof timer !== "undefined" && timer !== null) {
                return $timeout.cancel(timer);
              }
            });
          }
        }
      };
    }
  ]);

}).call(this);
