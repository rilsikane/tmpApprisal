app.controller('subform1000Controller', ['$scope', '$state', '$stateParams', 'radasoft', '$modal', '$translate', function ($scope, $state, $stateParams, radasoft, $modal, $translate) {
    $scope.headColAppraisalList = [];
    $scope.btnDisabled = true;

    $scope.$on('activateTab1000', function (event, parameters) {
        $scope.init();
    });

    $scope.getHeadColAppraisalList = function () {
        radasoft.getHeadColAppraisalList({ JOB_RUNNING_ID: $scope.$parent.formData.JOB_RUNNING_ID }).then(function (response) {
            var allOk = true;
            angular.forEach(response.data, function (item) {
                if (item.APPRAISAL_REPORT_OK == false) {
                    allOk = false;
                }
            });

            if ($scope.tab.update) {
                $scope.btnDisabled = !allOk;
            }

            $scope.headColAppraisalList = response.data;
        });
    }

    $scope.genAppraisalReport = function () {
        var msg = $translate.instant('CONFIRM.CONFIRM') + ' ' + $translate.instant('GEN_APP_REPORT');
        radasoft.confirmAndSave(msg, '', function (isconfirmed) {
            if (isconfirmed) {
                radasoft.genAppraisalReport($scope.$parent.formData.APPRAISAL_REPORT).then(function (response) {
                    angular.copy(response.data, $scope.$parent.formData.APPRAISAL_REPORT);
                    radasoft.success();
                });
            }
        });
    }

    $scope.reload = function () {
        $scope.init();
    }
    $scope.init = function () {
        $scope.getHeadColAppraisalList();
    }

    //$scope.init();
}]);