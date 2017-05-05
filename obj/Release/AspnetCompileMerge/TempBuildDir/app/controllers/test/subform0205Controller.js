app.controller('subform0205Controller', ['$scope', '$state', '$stateParams', 'radasoft', '$modal', '$translate', 'FileUploader', 'params', '$modalInstance', function ($scope, $state, $stateParams, radasoft, $modal, $translate, FileUploader, params, $modalInstance) {
    $scope.title = $stateParams.STATE_NAME;
    $scope.ldloading = {};
    $scope.btnDisabled = false;
    $scope.headCol = params.headCol;
    $scope.colAct = params.colAct;
    $scope.includeUrl = params.includeUrl || '';
    $scope.showButtonSave = params.showButtonSave || false;

    $scope.upload = function ($index, attach) {
        $modal.open({
            backdrop: 'static',
            keyboard: false,
            templateUrl: 'app/views/tools/uploader.html',
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
                    ATTACHDOC_RUNNING_ID: item.ATTACHDOC_RUNNING_ID,
                    DOC_NAME: item.DOC_NAME,
                    JOB_RUNNING_ID: $scope.headCol.JOB_RUNNING_ID
                });
            });
        });
    }

    $scope.deleteAttach = function ($index, attach, file) {
        radasoft.confirmAndSave($translate.instant('CONFIRM.DELETE'), '', function (isconfirmed) {
            if (isconfirmed) {
                radasoft.deleteAttachDoc(file).then(function (response) {
                    radasoft.success();
                    attach.ATTACH_DOC.splice($index, 1);
                });
            }
        });
    }

    $scope.submit = function () {
        radasoft.confirmAndSave($translate.instant('CONFIRM.SAVE'), '', function (isconfirmed) {
            if (isconfirmed) {
                radasoft.setColAttach($scope.headCol.ATTACH_DOC).then(function (response) {
                    radasoft.success();
                });
            }
        });
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.init = function () {
    }

    $scope.init();
}]);