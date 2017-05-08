app.controller('subform0300Controller', ['$scope', '$state', 'radasoft', '$modal', '$translate', function ($scope, $state, radasoft, $modal, $translate) {
    $scope.ldloading = {};
    $scope.btnDisabled = false;
    $scope.inputDisabled = false;

    $scope.province = [];
    $scope.district = [[], []];
    $scope.requestAttach = [];
    $scope.DOC_ID = $scope.tab.DOC_ID;

    if (!$scope.tab.create || !$scope.tab.update) {
        $scope.btnDisabled = true;
        $scope.inputDisabled = true;
    }

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
                        limit: 0,
                        config: 'upload/document',
                        id1: $scope.$parent.formData.JOB_RUNNING_ID
                    };
                }
            }
        }).result.then(function (data) {
            angular.forEach(data, function (item) {
                attach.ATTACH_DOC.push({
                    JOB_RUNNING_ID: $scope.DOC_ID,
                    ATTACHDOC_RUNNING_ID: item.ATTACHDOC_RUNNING_ID,
                    DOC_NAME: item.DOC_NAME
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

    $scope.getRequestAttach = function () {
        radasoft.getRequestAttach({ DOC_ID: $scope.DOC_ID }).then(function (response) {
            $scope.requestAttach = response.data;
        });
    }

    $scope.setRequestAttach = function () {

    }

    $scope.save = function (style) {
        radasoft.confirmAndSave($translate.instant('CONFIRM.SAVE'), '', function (isconfirmed) {
            if (isconfirmed) {
                $scope.ldloading[style.replace('-', '_')] = true;
                radasoft.setRequestAttach($scope.requestAttach).then(function (response) {
                    $scope.ldloading[style.replace('-', '_')] = false;
                    radasoft.success();
                });
            }
        });
    }

    $scope.submit = function (form, style) {
        $scope.save(style);
    };

    $scope.init = function () {
        $scope.getRequestAttach();
    }

    $scope.init();

}]);