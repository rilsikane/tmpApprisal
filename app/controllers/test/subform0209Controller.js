app.controller('subform0209Controller', ['$scope', '$state', '$stateParams', 'radasoft', '$modal', '$translate', 'FileUploader', 'params', '$modalInstance', '$filter', function ($scope, $state, $stateParams, radasoft, $modal, $translate, FileUploader, params, $modalInstance, $filter) {
    $scope.title = $stateParams.STATE_NAME;
    $scope.ldloading = {};
    $scope.btnDisabled = false;
    $scope.headCol = params.headCol;
    $scope.colAct = params.colAct;

    $scope.showBtnDelete = false;
    $scope.includeUrl = params.includeUrl || '';
    $scope.showButtonSave = params.showButtonSave || false;

    $scope.jobMarketPrice = [];

    $scope.showDataSet1 = true;
    $scope.showDataSet2 = true;
    $scope.showDataSet3 = true;
    $scope.showDataSet4 = true;
    $scope.showDataSet5 = true;

    $scope.dataSetCol = "col-md-2";

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

    $scope.getJobMarketPrice = function () {
        radasoft.getJobMarketPrice({ HEAD_COL_RUNNING_ID: $scope.headCol.HEAD_COL_RUNNING_ID }).then(function (response) {
            $scope.jobMarketPrice = response.data;

            angular.forEach($scope.jobMarketPrice, function (item) {
                item.DISPLAY = true;
            });

            $scope.displayChange();
        });
    }

    $scope.displayChange = function () {
        var count = 0;
        angular.forEach($scope.jobMarketPrice, function (item) {
            if (item.DISPLAY) {
                count++;
            }
        });

        $scope.dataSetCol = "col-md-" + Math.ceil(10 / count);
    }

    $scope.selectMarketPrice = function ($index, $item) {
        radasoft.openDialog({
            controller: 'marketPriceSelectionController',

            resolve: {
                params: function () {
                    return {
                        includeUrl: 'app/views/setting/marketprice/marketPriceSelectionList.html',
                        headCol: $scope.headCol,
                        data: $item
                    };
                }
            }
        }).result.then(function (data) {
            $scope.getJobMarketPrice();
        });
    }

    $scope.deleteJobMarketPrice = function ($index, market) {
        radasoft.confirmAndSave($translate.instant('CONFIRM.DELETE'), '', function (isconfirmed) {
            if (isconfirmed) {
                radasoft.deleteJobMarketPrice(market).then(function () {
                    radasoft.success();
                    $scope.getJobMarketPrice();
                });
            }
        });
    }

    $scope.editJobMarketPrice = function ($index, data) {
        data.MARKETSTOCK_RUNNING_ID = 0;
        $scope.openMarketPriceDialog(data);
    }

    $scope.openMarketPriceDialog = function (data) {
        radasoft.openDialog({
            controller: 'marketPriceDetailController',
            resolve: {
                params: function () {
                    return {
                        includeUrl: 'app/views/setting/marketprice/marketPriceDetail.html',
                        formData: data,
                        dataMode: 1// 0 : AAG_M_PRICEMARKETSTOCK,1 : AAG_JOBMARKETPRICE
                    };
                }
            }
        }).result.then(function (reload) {
            $scope.getJobMarketPrice();
        });
    }

    $scope.submit = function () {
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.init = function () {
        $scope.getJobMarketPrice();
    }

    $scope.init();
}]);