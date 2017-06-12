'use strict';

var app = angular.module('appraisalCalendar', ['ngRoute', 'ngAnimate', 'ngCookies', 'ngStorage', 'ngSanitize', 'ngTouch', 'ui.bootstrap', 'oc.lazyLoad', 'cfp.loadingBar', 'duScroll', 'pascalprecht.translate', 'angular-loading-bar', 'mwl.calendar']);

app.config(['$translateProvider', '$httpProvider', '$routeProvider', function ($translateProvider, $httpProvider, $routeProvider) {
    $routeProvider.when('/a/:OU_ID/:AP_CODE', {
        templateUrl: '/app/views/test/subform0552.html',
        controller: 'cc'
    });
}]);

app.controller('calendarCtrl', ['$scope', '$route', function ($scope, $route) {

}]);

app.filter('sla2', function () {
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
});

app.controller('cc', ['$scope', '$routeParams', '$http', function ($scope, $routeParams, $http) {

    $scope.events = [];

    $scope.getCalendarForMobile = function () {
        var config = {
            method: 'GET',
            url: 'api/values/getCalendarForMobile?OU_ID=' + $routeParams.OU_ID + '&APPRAISER_CODE=' + $routeParams.AP_CODE,
            responseType: 'json'
        };
        $http(config).then(function (response) {
            $scope.events = response.data;
        }, function (response) {
            if (typeof (response.data) == 'object' && response.data != null) {
                alert(response.data.Message || response.data.ExceptionMessage);
            } else {
                alert(response.status + ' : ' + response.statusText, url);
            }
        });
    }

    $scope.calendarView = 'month';
    $scope.calendarDay = new Date();

    $scope.setCalendarToToday = function () {
        $scope.calendarDay = new Date();
    };

    $scope.toggle = function ($event, field, event) {
        $event.preventDefault();
        $event.stopPropagation();

        event[field] = !event[field];
    };

    $scope.getCalendarForMobile();
}]);