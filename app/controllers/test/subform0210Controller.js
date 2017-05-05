// ราคาประเมิน
app.controller('subform0210Controller', ['$scope', '$state', '$stateParams', 'radasoft', '$modal', '$translate', 'FileUploader', 'params', '$modalInstance', '$q', function ($scope, $state, $stateParams, radasoft, $modal, $translate, FileUploader, params, $modalInstance, $q) {
    $scope.btnDisabled = false;
    $scope.headCol = params.headCol;
    $scope.colAct = params.colAct;
    $scope.includeUrl = 'app/views/test/subform0210.html';
    $scope.showButtonSave = true;

    $scope.methodChange = function (item) {
        $scope.formData.ASSPA_METH = item.NAME;
        $scope.formData.APPR_CUR_NET_TOTAL = item.AMOUNT;
    }

    $scope.methodAmountChange = function ($event, item) {
        if ($scope.formData.ASSPA_METH_ID == '3') {
            $scope.formData.APPR_CUR_NET_TOTAL = item.AMOUNT;
        }
    }

    $scope.submit = function (form) {
        if (form.$invalid) {
            var field = null, firstError = null;
            for (field in form) {
                if (field[0] != '$') {
                    if (firstError === null && !form[field].$valid) {
                        firstError = form[field].$name;
                    }

                    if (form[field].$pristine) {
                        form[field].$dirty = true;
                    }
                }
            }

        } else {
            $scope.setHeadColAppraisalModel();
        }
    }

    //$scope.getAppraisalMethod = function () {
    //    var deferred = $q.defer();

    //    radasoft.getAppraisalMethod({
    //        JOB_RUNNING_ID: $scope.headCol.JOB_RUNNING_ID,
    //        HEAD_COL_RUNNING_ID: $scope.headCol.HEAD_COL_RUNNING_ID
    //    }).then(function (response) {
    //        $scope.appraisalMethods = response.data;

    //        deferred.resolve(response);
    //    });

    //    return deferred.promise;
    //}

    $scope.getHeadColAppraisalModel = function () {
        var deferred = $q.defer();

        radasoft.getHeadColAppraisalModel({
            JOB_RUNNING_ID: $scope.headCol.JOB_RUNNING_ID,
            HEAD_COL_RUNNING_ID: $scope.headCol.HEAD_COL_RUNNING_ID
        }).then(function (response) {
            $scope.formData = response.data;

            deferred.resolve(response);
        });

        return deferred.promise;
    }

    $scope.setHeadColAppraisalModel = function () {
        radasoft.confirmAndSave($translate.instant('CONFIRM.SAVE'), '', function (isconfirmed) {
            if (isconfirmed) {
                radasoft.setHeadColAppraisalModel($scope.formData).then(function (response) {
                    radasoft.success();
                });
            }
        });
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.init = function () {
        $scope.getHeadColAppraisalModel();
    }

    $scope.init();
}]);