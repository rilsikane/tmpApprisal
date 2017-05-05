app.controller('subform0207Controller', ['$scope', '$state', '$stateParams', 'radasoft', '$modal', '$translate', 'FileUploader', 'params', '$modalInstance', '$sce', '$log', function ($scope, $state, $stateParams, radasoft, $modal, $translate, FileUploader, params, $modalInstance, $sce, $log) {
    $scope.title = $stateParams.STATE_NAME;
    $scope.ldloading = {};
    $scope.btnDisabled = false;
    $scope.headCol = params.headCol;
    $scope.colAct = params.colAct;
    $scope.includeUrl = params.includeUrl || '';
    $scope.showButtonSave = params.showButtonSave || false;
    $scope.HEAD_COL_RUNNING_ID = 823371;
    //$scope.mapUrl = 'https://10.254.30.85/GSBAppraisal/MainPage.aspx?page=MapEdit&HEAD_COL_RUNNING_ID=&HEAD_COL_CODE=';

    //$sce.RESOURCE_URL = 'https://10.254.30.85';

    //$scope.xurl = $sce.trustAsUrl($scope.mapUrl);

    //$log.info($sce);
    //$log.info($sce.trustAsUrl($scope.mapUrl));

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
                    DOC_PATH: item.file,
                    DOC_NAME: item.name,
                    JOB_RUNNING_ID: $scope.headCol.JOB_RUNNING_ID
                });
            });
        });
    }

    //$scope.deleteAttach = function ($index, attach, file) {
    //    radasoft.confirmAndSave($translate.instant('CONFIRM.DELETE'), '', function (isconfirmed) {
    //        if (isconfirmed) {
    //            radasoft.deleteAttachDoc(file).then(function (response) {
    //                radasoft.success();
    //                attach.ATTACH_DOC.splice($index, 1);
    //            });
    //        }
    //    });
    //}

    $scope.submit = function () {
        //radasoft.confirmAndSave($translate.instant('CONFIRM.SAVE'), '', function (isconfirmed) {
        //    if (isconfirmed) {
        //        radasoft.setColAttach($scope.headCol.ATTACH_DOC).then(function (response) {
        //            radasoft.success();
        //        });
        //    }
        //});
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.init = function () {
    }

    $scope.init();
}]);