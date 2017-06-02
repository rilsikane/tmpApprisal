'use strict';

var app = angular.module('appraisalCalendar', ['ngRoute', 'ngAnimate', 'ngCookies', 'ngStorage', 'ngSanitize', 'ngTouch', 'ui.bootstrap', 'oc.lazyLoad', 'cfp.loadingBar', 'duScroll', 'pascalprecht.translate', 'angular-loading-bar', 'mwl.calendar']);

//var app = angular.module('appraisalCalendar', ['Application']);
app.config(['$translateProvider', '$httpProvider', '$routeProvider', function ($translateProvider, $httpProvider, $routeProvider) {
    $routeProvider.when('/a/:OU_ID/:AP_CODE', {
        templateUrl: '/app/views/test/subform0552.html',
        controller: 'cc'
    });
}]);

app.controller('calendarCtrl', ['$scope', '$route', function ($scope, $route) {

}]);

app.controller('cc', ['$scope', '$routeParams', function ($scope, $routeParams) {
    //console.log($routeParams);

    //$scope.includeUrl = '/app/views/test/subform0552.html';
    //$scope.JOB_RUNNING_ID = params.JOB_RUNNING_ID || $stateParams.JOB_RUNNING_ID;

    $scope.events = [];

    $scope.getCalendar = function () {
        radasoft.getCalendar({ JOB_RUNNING_ID: $scope.JOB_RUNNING_ID }).then(function (response) {
            $scope.events = response.data;
        });
    }

    $scope.calendarView = 'month';
    $scope.calendarDay = new Date();

    $scope.openEventEditor = function (data) {
        //radasoft.debug(action);
        radasoft.debug(data);

        radasoft.openDialog({
            controller: 'subform0551Controller',
            resolve: {
                params: function () {
                    return {
                        formData: data
                    };
                }
            }
        }).result.then(function (data) {
            radasoft.success();
            $scope.getCalendar();

            //var existing = $filter('filter')($scope.events, data.CALENDAR_RUNNING_ID, null, 'CALENDAR_RUNNING_ID')[0];

            //if (existing == undefined) {
            //    $scope.events.push(data);
            //} else {
            //    existing = data;
            //}
        });
    }


    $scope.eventClicked = function (event) {
        $scope.openEventEditor(event);
    };

    $scope.addEvent = function () {
        $scope.openEventEditor({
            CALENDAR_RUNNING_ID: 0,
            JOB_RUNNING_ID: $scope.$parent.formData.JOB_RUNNING_ID,
            EVALUATE_DATE_TIME: new Date()
        });
    };

    $scope.eventEdited = function (data) {
        $scope.openEventEditor(data);
    };

    $scope.eventDeleted = function (data) {
        radasoft.confirmAndSave($translate.instant('CONFIRM.DELETE'), '', function (isconfirmed) {
            if (isconfirmed) {
                radasoft.deleteCalendar(data).then(function (response) {
                    radasoft.success();
                    $scope.getCalendar();
                });
            }
        });
    };

    $scope.setCalendarToToday = function () {
        $scope.calendarDay = new Date();
    };

    $scope.toggle = function ($event, field, event) {
        $event.preventDefault();
        $event.stopPropagation();

        event[field] = !event[field];
    };
}]);