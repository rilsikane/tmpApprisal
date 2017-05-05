app.controller('subform0400Controller', ['$scope', '$state', '$translate', 'radasoft', function ($scope, $state, $translate, common) {
    $scope.ldloading = {};
    //$scope.dispathcer = [];
    $scope.formData = {};
    $scope.inputDisabled = false;
    $scope.btnDisabled = false;

    if (!$scope.tab.create || !$scope.tab.update) {
        $scope.btnDisabled = true;
        $scope.inputDisabled = true;
    }

    //$scope.getDispatcherOU = function () {
    //    common.getDispatcherOU({ REQUEST_RUNNING_ID: $scope.tab.DOC_ID }).then(function (response) {
    //        //$scope.dispathcer = response.data;
    //    });
    //};

    $scope.getStepOwner = function (DOC_ID, STEP_ID) {
        common.getStepOwner({ DOC_ID: DOC_ID, STEP_ID: STEP_ID }).then(function (response) {
            $scope.formData.OWNER_OU = response.data.data;
        });
    }

    $scope.save = function (style) {
        common.confirmAndSave($translate.instant('CONFIRM.SAVE'), '', function (isconfirmed) {
            if (isconfirmed) {
                common.setDispatcherOU({
                    REQUEST_RUNNING_ID: $scope.tab.DOC_ID,
                    OU_ID: $scope.formData.OWNER_OU ? $scope.formData.OWNER_OU.OU_ID : 0
                }).then(function (response) {
                    if (response.data.success) {
                        common.success();
                    } else {
                        common.error(null, null, error.data.ex);
                    }
                });
            }
        });
    }

    $scope.getStepOwner($scope.tab.DOC_ID, 2);
}]);