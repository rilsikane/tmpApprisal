app.controller('enquiryRequestCtrl', ['$rootScope', '$scope', '$state', '$stateParams', 'radasoft', '$q', '$translate', function ($rootScope, $scope, $state, $stateParams, radasoft, $q, $translate) {
    $scope.data = [];
    $scope.totalRecords = 0;
    $scope.currentPage = 1;
    $scope.ou = [];
    $scope.myFilter = {
        OU: {},
        DEBT_TYPE: {},
        OBJECTIVE: {},
        STEP: {},
        STATE: {}
    };

    $scope.onStepChange = function () {
        $scope.myFilter.STATE = {};
    }
    $scope.stateFilter = function (value, index, array) {
        return value.STEP_ID == $scope.myFilter.STEP.STEP_ID || $scope.myFilter.STEP.STEP_ID == undefined;
    }
    $scope.ENQUIRY_GET_DATA_REQUEST = function () {
        radasoft.ENQUIRY_GET_DATA_REQUEST({
            limit: $rootScope.app.itemsPerPage,
            page: $scope.currentPage,
            filters: [
                { NAME: 'OU_ID', VALUE: $scope.myFilter.OU.OU_ID || '' },
                { NAME: 'DEBT_TYPE', VALUE: $scope.myFilter.DEBT_TYPE.VALUE || '' },
                { NAME: 'OBJECTIVE', VALUE: $scope.myFilter.OBJECTIVE.VALUE || '' },
                { NAME: 'FROM_DATE', VALUE: $scope.myFilter.FROM_DATE },
                { NAME: 'THRU_DATE', VALUE: $scope.myFilter.THRU_DATE },
                { NAME: 'NPA', VALUE: $scope.myFilter.NPA || 'N' },
                { NAME: 'STEP', VALUE: $scope.myFilter.STEP.STEP_ID || 0 },
                { NAME: 'STATE', VALUE: $scope.myFilter.STATE.STATE_ID || 0 }
            ]
        }).then(function (response) {
            $scope.data = response.data.data;
            $scope.totalRecords = response.data.total;

            if ($scope.data.length == 0) {
                radasoft.alert($translate.instant('NO_DATA_FOUND'));
            }
        });
    };

    $scope.onSearchClick = function () {
        $scope.ENQUIRY_GET_DATA_REQUEST();
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
        $scope.ENQUIRY_GET_DATA_REQUEST();
    }

    $scope.init = function () {
        radasoft.ENQUIRY_GET_PARAM_OU().then(function (response) {
            $scope.ou = response.data;

            radasoft.getObjective({}).then(function (response) {
                $scope.objective = response.data;

                radasoft.getDebtType({}).then(function (response) {
                    $scope.debtType = response.data;

                    radasoft.getBpmStep().then(function (response) {
                        $scope.bpmstep = response.data;

                        radasoft.getBpmState({ STEP_ID: 0 }).then(function (response) {
                            $scope.bpmstate = response.data;
                        });
                    });
                });
            });

        });
    }

    $scope.init();
}]);