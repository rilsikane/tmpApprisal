﻿app.controller('mydocsController', ['$rootScope', '$scope', '$state', '$stateParams', 'radasoft', '$q', '$filter', '$translate', function ($rootScope, $scope, $state, $stateParams, radasoft, $q, $filter, $translate) {
    $scope.data = [];
    $scope.ou = [];

    $scope.myFilter = {
        OU: {},
        DEBT_TYPE: {},
        OBJECTIVE: {},
        STEP: {},
        STATE: {},
        NPA: '',
        STEP: {},
        STATE: {},
        totalRecords: 0,
        currentPage: 1
    };

    $scope.onStepChange = function () {
        $scope.myFilter.STATE = {};
    }
    $scope.stateFilter = function (value, index, array) {
        return value.STEP_ID == $scope.myFilter.STEP.STEP_ID || $scope.myFilter.STEP.STEP_ID == undefined;
    }
    $scope.getMyDocs = function () {
        radasoft.getMyDocs2({
            limit: $rootScope.app.itemsPerPage,
            page: $scope.myFilter.currentPage,
            filters: [
                { NAME: 'OU_ID', VALUE: $scope.myFilter.OU.OU_ID || 0 },
                { NAME: 'DEBT_TYPE', VALUE: $scope.myFilter.DEBT_TYPE.VALUE || '' },
                { NAME: 'OBJECTIVE', VALUE: $scope.myFilter.OBJECTIVE.VALUE || '' },
                { NAME: 'FROM_DATE', VALUE: $filter('date')($scope.myFilter.FROM_DATE, 'dd/MM/yyyy') || '' },
                { NAME: 'THRU_DATE', VALUE: $filter('date')($scope.myFilter.THRU_DATE, 'dd/MM/yyyy') || '' },
                { NAME: 'NPA', VALUE: $scope.myFilter.NPA || 'N' },
                { NAME: 'STEP', VALUE: $scope.myFilter.STEP.STEP_ID || 0 },
                { NAME: 'STATE', VALUE: $scope.myFilter.STATE.STATE_ID || 0 }
            ]
        }).then(function (response) {
            $scope.data = response.data.data;
            $scope.myFilter.totalRecords = response.data.total;
            $rootScope.mydocsFilter = $scope.myFilter;
            $rootScope.mydocsData = $scope.data;
            if ($scope.data.length == 0) {
                radasoft.alert($translate.instant('NO_DATA_FOUND'));
            }
        });
    };

    $scope.onSearchClick = function () {
        $scope.getMyDocs();
    }
    $scope.onResetSearch = function () {
        $scope.myFilter = {
            OU: {},
            DEBT_TYPE: {},
            OBJECTIVE: {},
            NPA: '',
            FROM_DATE: '',
            THRU_DATE: '',
            STEP: {},
            STATE: {}
        };
    }
    $scope.pageChanged = function () {
        $scope.getMyDocs();
    }

    $scope.ENQUIRY_GET_PARAM_OU = function () {
        var deferred = $q.defer();
        if ($rootScope.enquiryOU == undefined) {
            radasoft.ENQUIRY_GET_PARAM_OU().then(function (response) {
                $scope.ou = response.data;

                $rootScope.enquiryOU = $scope.ou;

                deferred.resolve();
            });
        } else {
            $scope.ou = $rootScope.enquiryOU;

            deferred.resolve();
        }
        return deferred.promise;
    }
    $scope.getObjective = function () {
        var deferred = $q.defer();
        if ($rootScope.enquiryObjective == undefined) {
            radasoft.getObjective().then(function (response) {
                $scope.objective = response.data;

                $rootScope.enquiryObjective = $scope.objective;

                deferred.resolve();
            });
        } else {
            $scope.objective = $rootScope.enquiryObjective;

            deferred.resolve();
        }
        return deferred.promise;
    }
    $scope.getDebtType = function () {
        var deferred = $q.defer();
        if ($rootScope.enquiryDebtType == undefined) {
            radasoft.getDebtType().then(function (response) {
                $scope.debtType = response.data;

                $rootScope.enquiryDebtType = $scope.debtType;

                deferred.resolve();
            });
        } else {
            $scope.debtType = $rootScope.enquiryDebtType;

            deferred.resolve();
        }
        return deferred.promise;
    }
    $scope.getBpmStep = function () {
        var deferred = $q.defer();
        if ($rootScope.enquiryBpmStep == undefined) {
            radasoft.getBpmStep().then(function (response) {
                $scope.bpmstep = response.data;

                $rootScope.enquiryBpmStep = $scope.bpmstep;

                deferred.resolve();
            });
        } else {
            $scope.bpmstep = $rootScope.enquiryBpmStep;

            deferred.resolve();
        }
        return deferred.promise;
    }
    $scope.getBpmState = function () {
        var deferred = $q.defer();
        if ($rootScope.enquiryBpmState == undefined) {
            radasoft.getBpmState({ STEP_ID: 0 }).then(function (response) {
                $scope.bpmstate = response.data;

                $rootScope.enquiryBpmState = $scope.bpmstate;

                deferred.resolve();
            });
        } else {
            $scope.bpmstate = $rootScope.enquiryBpmState;

            deferred.resolve();
        }
        return deferred.promise;
    }
    $scope.init = function () {
        $scope.ENQUIRY_GET_PARAM_OU().then(function () {
            $scope.getObjective({}).then(function () {
                $scope.getDebtType({}).then(function (response) {
                    $scope.getBpmStep().then(function (response) {
                        $scope.getBpmState({ STEP_ID: 0 }).then(function (response) {
                            if ($rootScope.enquiryFilter != undefined) {
                                $scope.myFilter = $rootScope.mydocsFilter;
                                $scope.data = $rootScope.mydocsData;
                            }
                        });
                    });
                });
            });
        });
    }

    $scope.init();

    //$scope.data = [];
    ////var params = {};
    //$scope.totalItems = 0;
    //$scope.currentPage = 1;
    ////$scope.itemsPerPage = 10;
    ////$scope.hideParent = false;

    //$scope.pageChanged = function () {
    //    radasoft.getMyDocs({
    //        limit: $rootScope.app.itemsPerPage,
    //        page: $scope.currentPage
    //    }).then(function (response) {
    //        $scope.data = response.data.data;
    //        $scope.totalItems = response.data.total;
    //    });
    //};


    //$scope.new = function () {
    //    $state.go('app.testform', { DOC_ID: 0 });
    //    //$state.go('app.form.form1', { DOC_ID: 0 });
    //}

    //$scope.pageChanged();
}]);