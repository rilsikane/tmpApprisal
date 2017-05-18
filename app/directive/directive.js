angular.module("Application")
    .directive('format', ['$filter', function ($filter) {
        return {
            require: '?ngModel',
            link: function ($scope, $element, $attrs, ngModelCtrl) {
                var decimal = $attrs.decimal || 2;

                // console.log(limit);
                // console.log(">>float_length<<", floatLength, defaultDecimal);

                if (!ngModelCtrl) {
                    return;
                }


                var listener = function () {
                    var value = $element.val().replace(/,/g, '');
                    if (value && !isNaN(value)) {
                        $element.val($filter('number')(value, decimal));
                    } else {
                        $element.val('');
                        $element.val(undefined);
                    }

                }

                // This runs when we update the text field
                ngModelCtrl.$parsers.push(function (viewValue) {

                    return parseFloat(viewValue.replace(/,/g, ''));
                })

                // This runs when the model gets updated on the scope directly and keeps our view in sync
                ngModelCtrl.$render = function () {
                    $element.val($filter('number')(ngModelCtrl.$viewValue, decimal));
                };

                $element.bind('change', listener)
                $element.bind('blur', listener)

                $element.bind('focus', function () {
                    var value = $element.val().replace(/,/g, '');

                    $element.val(value);
                });

                $element.bind('keyup', function (event) {
                    var max = $attrs.ngMax;
                    var regNum = /[^^\d*\.?\d*$]/;
                    var value = $element.val().replace(regNum, '');
                    if (max) {
                        if (parseFloat(value) > parseFloat(max)) {
                            $element.val(0);
                        } else {
                            $element.val(value);
                        }
                    } else {
                        $element.val(value);
                    }
                });

            }
        };
    }])
    .directive('price', ['$filter', function ($filter) {
        return {
            require: '?ngModel',
            link: function ($scope, $element, $attrs, ngModelCtrl) {


                // console.log(limit);
                // console.log(">>float_length<<", floatLength, defaultDecimal);

                if (!ngModelCtrl) {
                    return;
                }


                var listener = function () {
                    var value = $element.val().replace(/,/g, '');
                    if (value && !isNaN(value)) {
                        $element.val($filter('number')(value, 2));
                    } else {
                        $element.val('');
                        $element.val(undefined);
                    }

                }

                // This runs when we update the text field
                ngModelCtrl.$parsers.push(function (viewValue) {

                    return parseFloat(viewValue.replace(/,/g, ''));
                })

                // This runs when the model gets updated on the scope directly and keeps our view in sync
                ngModelCtrl.$render = function () {
                    $element.val($filter('number')(ngModelCtrl.$viewValue, 2));
                };

                $element.bind('change', listener)
                $element.bind('blur', listener)

                $element.bind('focus', function () {
                    var value = $element.val().replace(/,/g, '');

                    $element.val(value);
                });

                $element.bind('keydown', function (event) {
                    var charCode = event.keyCode;
                    if (event.keyCode == 0 || charCode > 31 && (charCode < 48 || (charCode > 57 && charCode != 190 && charCode != 110))) {
                        if (!(charCode > 34 && charCode < 41)) {
                            event.preventDefault();
                        }
                    }
                });

            }
        };
    }])
    .directive('distance', ['$filter', function ($filter) {
        return {
            require: '?ngModel',
            link: function ($scope, $element, $attrs, ngModelCtrl) {


                // console.log(limit);
                // console.log(">>float_length<<", floatLength, defaultDecimal);

                if (!ngModelCtrl) {
                    return;
                }


                var listener = function () {
                    var value = $element.val().replace(/,/g, '');
                    if (value && !isNaN(value)) {
                        $element.val($filter('number')(value, 0));
                    } else {
                        $element.val('');
                        $element.val(undefined);
                    }

                }

                // This runs when we update the text field
                ngModelCtrl.$parsers.push(function (viewValue) {

                    return parseFloat(viewValue.replace(/,/g, ''));
                })

                // This runs when the model gets updated on the scope directly and keeps our view in sync
                ngModelCtrl.$render = function () {
                    $element.val($filter('number')(ngModelCtrl.$viewValue, 2));
                };

                $element.bind('change', listener)
                $element.bind('blur', listener)

                $element.bind('focus', function () {
                    var value = $element.val().replace(/,/g, '');

                    $element.val(value);
                });

                $element.bind('keydown', function (event) {
                    var charCode = event.keyCode;
                    if (event.keyCode == 0 || charCode > 31 && (charCode < 48 || (charCode > 57 && charCode != 190 && charCode != 110))) {
                        if (!(charCode > 34 && charCode < 41)) {
                            event.preventDefault();
                        }
                    }
                });

            }
        };
    }])
    .directive('count', ['$filter', function ($filter) {
        return {
            require: '?ngModel',
            link: function ($scope, $element, $attrs, ngModelCtrl) {


                // console.log(limit);
                // console.log(">>float_length<<", floatLength, defaultDecimal);

                if (!ngModelCtrl) {
                    return;
                }


                var listener = function () {
                    var value = $element.val().replace(/,/g, '');
                    if (value && !isNaN(value)) {
                        $element.val($filter('number')(value, 0));
                    } else {
                        $element.val('');
                        $element.val(undefined);
                    }

                }

                // This runs when we update the text field
                ngModelCtrl.$parsers.push(function (viewValue) {

                    return parseInt(viewValue.replace(/,/g, ''));
                })

                // This runs when the model gets updated on the scope directly and keeps our view in sync
                ngModelCtrl.$render = function () {
                    $element.val($filter('number')(ngModelCtrl.$viewValue, 0));
                };

                $element.bind('change', listener)
                $element.bind('blur', listener)

                $element.bind('focus', function () {
                    var value = $element.val().replace(/,/g, '');

                    $element.val(value);
                });

                $element.bind('keyup', function (event) {

                    var max = $attrs.ngMax;
                    var regNum = /[^^\d+$]/;
                    var value = $element.val().replace(regNum, '');
                    if (max) {
                        if (parseInt(value) > parseInt(max)) {
                            $element.val(0);
                        } else {
                            $element.val(value);
                        }
                    } else {
                        $element.val(value);
                    }
                });

            }
        };
    }])
    .directive('landarea', ['$filter', function ($filter) {
        return {
            require: '?ngModel',
            link: function ($scope, $element, $attrs, ngModelCtrl) {


                // console.log(limit);
                // console.log(">>float_length<<", floatLength, defaultDecimal);

                if (!ngModelCtrl) {
                    return;
                }


                var listener = function () {
                    var value = $element.val().replace(/,/g, '');
                    if (value && !isNaN(value)) {
                        $element.val($filter('number')(value, 0));
                    } else {
                        $element.val('');
                        $element.val(undefined);
                    }

                }

                // This runs when we update the text field
                ngModelCtrl.$parsers.push(function (viewValue) {

                    return parseFloat(viewValue.replace(/,/g, ''));
                })

                // This runs when the model gets updated on the scope directly and keeps our view in sync
                ngModelCtrl.$render = function () {
                    $element.val($filter('number')(ngModelCtrl.$viewValue, 2));
                };

                $element.bind('change', listener)
                $element.bind('blur', listener)

                $element.bind('focus', function () {
                    var value = $element.val().replace(/,/g, '');

                    $element.val(value);
                });

                $element.bind('keydown', function (event) {
                    var charCode = event.keyCode;
                    if (event.keyCode == 0 || charCode > 31 && (charCode < 48 || (charCode > 57 && charCode != 190 && charCode != 110))) {
                        if (!(charCode > 34 && charCode < 41)) {
                            event.preventDefault();
                        }
                    }
                });

            }
        };
    }])
    .directive('usespace', ['$filter', function ($filter) {
        return {
            require: '?ngModel',
            link: function ($scope, $element, $attrs, ngModelCtrl) {


                // console.log(limit);
                // console.log(">>float_length<<", floatLength, defaultDecimal);

                if (!ngModelCtrl) {
                    return;
                }


                var listener = function () {
                    var value = $element.val().replace(/,/g, '');
                    if (value && !isNaN(value)) {
                        $element.val($filter('number')(value, 2));
                    } else {
                        $element.val('');
                        $element.val(undefined);
                    }

                }

                // This runs when we update the text field
                ngModelCtrl.$parsers.push(function (viewValue) {

                    return parseFloat(viewValue.replace(/,/g, ''));
                })

                // This runs when the model gets updated on the scope directly and keeps our view in sync
                ngModelCtrl.$render = function () {
                    $element.val($filter('number')(ngModelCtrl.$viewValue, 2));
                };

                $element.bind('change', listener)
                $element.bind('blur', listener)

                $element.bind('focus', function () {
                    var value = $element.val().replace(/,/g, '');

                    $element.val(value);
                });

                $element.bind('keyup', function (event) {
                    var max = $attrs.ngMax;
                    var regNum = /[^^\d*\.?\d*$]/;
                    var value = $element.val().replace(regNum, '');
                    if (max) {
                        if (parseFloat(value) > parseFloat(max)) {
                            $element.val(0);
                        } else {
                            $element.val(value);
                        }
                    } else {
                        $element.val(value);
                    }
                });

            }
        };
    }]).directive('zipcode', ['$filter', function ($filter) {
        return {
            require: '?ngModel',
            link: function ($scope, $element, $attrs, ngModelCtrl) {
                if (!ngModelCtrl) {
                    return;
                }
                var listener = function () {
                    var value = $element.val().replace(/,/g, '');
                    if (value && !isNaN(value)) {
                        //$element.val($filter('number')(value));
                        $element.val(value);
                    } else {
                        $element.val('');
                        $element.val(undefined);
                    }
                }

                // This runs when we update the text field
                ngModelCtrl.$parsers.push(function (viewValue) {
                    //return viewValue;
                    return parseInt(viewValue);
                })

                // This runs when the model gets updated on the scope directly and keeps our view in sync
                ngModelCtrl.$render = function () {
                    $element.val(ngModelCtrl.$viewValue);
                };

                $element.bind('change', listener)
                $element.bind('blur', listener)

                $element.bind('focus', function () {
                    var value = $element.val();//.replace(/,/g, '');

                    $element.val(value);
                });

                $element.bind('keyup', function (event) {

                    var max = $attrs.ngMax;
                    var regNum = /[^^\d+$]/;
                    var value = $element.val().replace(regNum, '');

                    $element.val(value);
                });

            }
        };
    }]).directive('numberonly', ['$filter', function ($filter) {
        return {
            require: '?ngModel',
            link: function ($scope, $element, $attrs, ngModelCtrl) {
                if (!ngModelCtrl) {
                    return;
                }
                var listener = function () {
                    var value = $element.val();
                    if (value && !isNaN(value)) {
                        $element.val(value);
                    } else {
                        $element.val('');
                        $element.val(undefined);
                    }
                }

                $element.bind('change', listener)
                $element.bind('blur', listener)
                $element.bind('focus', function () {
                    var value = $element.val();//.replace(/,/g, '');

                    $element.val(value);
                });

                $element.bind('keyup', function (event) {

                    var max = $attrs.ngMax;
                    var regNum = /[^^\d+$]/;
                    var value = $element.val().replace(regNum, '');
                    if (max) {
                        if (parseInt(value) > parseInt(max)) {
                            $element.val(0);
                        } else {
                            $element.val(value);
                        }
                    } else {
                        $element.val(value);
                    }
                });
            }
        };
    }]).directive('year', ['$filter', function ($filter) {
        return {
            require: '?ngModel',
            link: function ($scope, $element, $attrs, ngModelCtrl) {
                if (!ngModelCtrl) {
                    return;
                }
                var listener = function () {
                    var value = $element.val();
                    if (value && !isNaN(value)) {
                        $element.val(value);
                    } else {
                        $element.val('');
                        $element.val(undefined);
                    }
                }

                $element.bind('change', listener)
                $element.bind('blur', listener)
                $element.bind('focus', function () {
                    var value = $element.val();//.replace(/,/g, '');

                    $element.val(value);
                });

                $element.bind('keyup', function (event) {
                    var max = $attrs.ngMax;
                    var regNum = /[^^\d+$]/;
                    var value = $element.val().replace(regNum, '');
                    if (max) {
                        if (parseFloat(value) > parseFloat(max)) {
                            $element.val(0);
                        } else {
                            $element.val(value);
                        }
                    } else {
                        $element.val(value);
                    }
                });

            }
        };
    }])
    .directive('numeric', ['$filter', function ($filter) {
        return {
            require: '?ngModel',
            link: function ($scope, $element, $attrs, ngModelCtrl) {
                if (!ngModelCtrl) {
                    return;
                }

                $element.bind('blur', function () {
                    var value = $element.val().replace(/,/g, '');
                    if (!isNaN(value)) {
                        var decimal = $attrs.decimal || 0;
                        $element.val($filter('number')(value, decimal));
                    }
                });

                $element.bind('focus', function () {
                    var value = $element.val().replace(/,/g, '');
                    $element.val(value);
                    $element.select();
                });

                ngModelCtrl.$formatters.push(function (value) {
                    var decimal = $attrs.decimal || 0;
                    return $filter('number')(value, decimal);
                });

                ngModelCtrl.$parsers.push(function (viewValue) {
                    var decimal = $attrs.decimal || 0;
                    return parseInt(viewValue.replace(/,/g, ''));
                })

                ngModelCtrl.$validators.isNumeric = function (modelValue, viewValue) {
                    var value = viewValue == undefined ? '' : viewValue.replace(/,/g, '');//viewValue;//modelValue || viewValue;

                    var minMax = $attrs.numeric.split('-');
                    var min = parseInt(minMax[0]);
                    var max = parseInt(minMax[1]);

                    var isValid = !isNaN(value) || /^(0|[1-9][0-9]*)$/.test(value);

                    if (!isNaN(min) && !isNaN(max) && isValid) {
                        isValid = parseInt(value) >= min && parseInt(value) <= max;
                    }

                    if (!isValid) {
                        if (!$element.hasClass('input-validate-error'))
                            $element.addClass('input-validate-error');
                    } else {
                        if ($element.hasClass('input-validate-error'))
                            $element.removeClass('input-validate-error');
                    }

                    return isValid;
                };
            }
        };
    }]).directive('validNumber', [function () {
        return {
            require: '?ngModel',
            link: function (scope, element, attrs, ngModelCtrl) {
                if (!ngModelCtrl) {
                    return;
                }

                ngModelCtrl.$parsers.push(function (val) {
                    if (angular.isUndefined(val)) {
                        var val = '';
                    }
                    var clean = val.replace(/[^0-9]+/g, '');
                    if (val !== clean) {
                        ngModelCtrl.$setViewValue(clean);
                        ngModelCtrl.$render();
                    }
                    return clean;
                });

                element.bind('keypress', function (event) {
                    if (event.keyCode === 32) {
                        event.preventDefault();
                    }
                });
            }
        };
    }])



.filter('thaiDate', function ($filter) {
    return function (input) {
        if (!input) { return ""; }
        // console.log(input);

        var _date = $filter('date')(new Date(input), "dd/MM/yyyy");
        try {

            // console.log(_date);
            if (_date === undefined) {
                return "";
            }
            var tmp = _date.split("/");
            var thaiYear = parseInt(tmp[2]) + 543;
            return tmp[0] + "/" + tmp[1] + "/" + thaiYear;
        } catch (e) {
            return input;
        }
        // console.log(_date);
    }
}).filter('idNumber', function () {
    return function (idNumber) {
        if (!idNumber) { return ''; }

        var value = idNumber.toString().trim().replace(/^\+/, '');

        if (value.match(/[^0-9]/)) {
            return idNumber;
        }

        if (value.length == 13) {
            var group1 = value.substring(0, 1);
            var group2 = value.substring(1, 5);
            var group3 = value.substring(5, 10);
            var group4 = value.substring(10, 12);
            var group5 = value.substring(12, 13);
            value = group1 + "-" + group2 + "-" + group3 + "-" + group4 + "-" + group5
        } else {
            return idNumber;
        }

        return value;
    };
})
.filter('sla', function () {
    return function (sla) {
        if (sla === undefined) { return; }
        var value = '';
        if (sla > 0) {
            value = 'greenBG'
        } else if (sla == 0) {
            value = 'yellowBG'
        } else {
            value = 'redBG'
        }
        return value;
    };
})
.filter('sla2', function () {
    return function (sla) {
        if (sla === undefined) {
            return;
        }
        var value = '';
        if (sla > 0) {
            value = 'SLA_GREEN'
        } else if (sla == 0) {
            value = 'SLA_YELLOW'
        } else {
            value = 'SLA_RED'
        }
        return value;
    };
})
