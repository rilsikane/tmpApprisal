app.controller('subform0209Controller', ['$scope', '$state', '$stateParams', 'radasoft', '$modal', '$translate', 'FileUploader', 'params', '$modalInstance', '$filter', function ($scope, $state, $stateParams, radasoft, $modal, $translate, FileUploader, params, $modalInstance, $filter) {
    $scope.title = $stateParams.STATE_NAME;
    $scope.ldloading = {};
    $scope.btnDisabled = false;
    $scope.headCol = params.headCol;
    //$scope.colAct = params.colAct;
    $scope.params = params;
    $scope.showBtnDelete = false;
    $scope.includeUrl = '/app/views/test/subform0209.html';
    $scope.showButtonSave = params.showButtonSave || false;
    $scope.tab = params.tab;

    $scope.jobMarketPrice = [];

    $scope.showDataSet1 = true;
    $scope.showDataSet2 = true;
    $scope.showDataSet3 = true;
    $scope.showDataSet4 = true;
    $scope.showDataSet5 = true;

    $scope.dataSetCol = "col-md-2";

    $scope.colAct = {
        COL_ACT_NAME: $translate.instant('MARKETPRICE') + '(' + params.TEMPLATE_TYPE.CODE_MINOR_NAME + ')'
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.init = function () {

    }

    $scope.init();
}]);