app.controller('subform0211Controller', ['$scope', '$state', '$stateParams', 'radasoft', '$modal', '$translate', 'FileUploader', 'params', '$modalInstance', function ($scope, $state, $stateParams, radasoft, $modal, $translate, FileUploader, params, $modalInstance) {
    $scope.title = $stateParams.STATE_NAME;
    $scope.ldloading = {};
    $scope.btnDisabled = false;
    $scope.headCol = params.headCol;
    $scope.colAct = params.colAct;
    $scope.includeUrl = params.includeUrl || '';
    $scope.showButtonSave = params.showButtonSave || false;

    $scope.tab = params.tab;

    $scope.upload = function ($index, attach) {
        $modal.open({
            backdrop: 'static',
            keyboard: false,
            templateUrl: '/app/views/tools/uploader.html',
            controller: 'uploaderController',
            size: 'lg',
            resolve: {
                params: function () {
                    return {
                        limit: 0
                    };
                }
            }
        }).result.then(function (data) {
            angular.forEach(data, function (item) {
                attach.ATTACH_DOC.push({
                    DOC_PATH: item.file,
                    DOC_NAME: item.name,
                    JOB_RUNNING_ID: $scope.headCol.JOB_RUNNING_ID
                });
            });
        });
    }

    $scope.genHeadCollReport = function (style) {
        var valid = true;
        angular.forEach($scope.BOT_COL_ACT_VALID, function (item) {
            if (item.VALID == false) {
                valid = false;
            }
        });

        if (valid) {
            radasoft.confirmAndSave($translate.instant('CONFIRM.GEN_REPORT'), '', function (isconfirmed) {
                if (isconfirmed) {
                    radasoft.genHeadCollReport($scope.headCol.APPRAISAL_REPORT).then(function (response) {
                        radasoft.success();
                        $scope.headCol.APPRAISAL_REPORT = response.data;
                    });
                }
            });
        }
        else {
            radasoft.confirmAndSave($translate.instant('CONFIRM.HEAD_COL_ACT_INVALID'), '', function (isconfirmed) {
                if (isconfirmed) {
                    radasoft.genHeadCollReport($scope.headCol.APPRAISAL_REPORT).then(function (response) {
                        radasoft.success();
                        $scope.headCol.APPRAISAL_REPORT = response.data;
                    });
                }
            });
        }
    }

    $scope.submit = function (style) {
        $scope.genHeadCollReport(style);
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.init = function () {
        radasoft.getBOT_COL_ACT_VALID({
            COL_TYPE_CODE: $scope.colAct.COL_TYPE_CODE,
            HEAD_COL_RUNNING_ID: $scope.headCol.HEAD_COL_RUNNING_ID
        }).then(function (response) {
            $scope.BOT_COL_ACT_VALID = response.data;
        });
    }

    $scope.init();
}]);