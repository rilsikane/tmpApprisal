app.controller('subform0500Controller', ['$scope', '$state', '$translate', 'radasoft', function ($scope, $state, $translate, radasoft) {
    $scope.formData = {
        APPRAISER_TYPE: $scope.$parent.formData.APPRAISER_TYPE == '1' ? 'I' : 'E'
    };
    $scope.ldloading = {};

    $scope.btnDisabled = false;
    $scope.inputDisabled = false;

    if (!$scope.tab.create || !$scope.tab.update) {
        $scope.btnDisabled = true;
        $scope.inputDisabled = true;
    }

    $scope.getStepOwner = function (DOC_ID) {
        radasoft.getStepOwner({ DOC_ID: DOC_ID, STEP_ID: 3 }).then(function (response) {
            $scope.formData.APPRAISER = response.data.data;

            radasoft.getStepOwner({ DOC_ID: DOC_ID, STEP_ID: 4 }).then(function (response) {
                $scope.formData.APPROVER = response.data.data;
            });
        });
    }

    $scope.appraiserTypeChange = function (type) {
        $scope.formData.APPRAISER = {};
    }

    $scope.save = function (style) {
        radasoft.confirmAndSave($translate.instant('CONFIRM.SAVE'), '', function (isconfirmed) {
            if (isconfirmed) {
                radasoft.setAppraiserOUsetApproverOU({
                    DOC_ID: $scope.tab.DOC_ID,
                    APPRAISER_OU: $scope.formData.APPRAISER ? $scope.formData.APPRAISER.OU_ID : 0,
                    APPROVER_OU: $scope.formData.APPROVER ? $scope.formData.APPROVER.OU_ID : 0,
                    APPRAISER_TYPE: $scope.formData.APPRAISER_TYPE == 'I' ? '1' : '2'
                }).then(function (response) {
                    radasoft.success();
                });
            }
        });
    }

    $scope.getStepOwner($scope.tab.DOC_ID);
}]);