app.controller('wqsFactorListCtrl', ['$scope', '$modalInstance', 'radasoft', 'params', '$translate', function ($scope, $modalInstance, radasoft, params, $translate) {
    $scope.includeUrl = '/app/views/test/wqsFactorList.html';
    $scope.title = 'กรุณาเลือกรูปแบบข้อมูล';
    //$scope.showBtnOK = true;

    $scope.factorList = [];

    $scope.select = function (item) {
        $modalInstance.close(item);
    }

    $scope.cancel = function () {
        $modalInstance.dismiss();
    }

    $scope.getMarketTemplateType = function () {
        radasoft.getMarketTemplateType({ HEAD_COL_RUNNING_ID: params.HEAD_COL_RUNNING_ID }).then(function (response) {
            $scope.templateType = response.data;

            if ($scope.templateType.length == 1) {
                $modalInstance.close($scope.templateType[0]);
            }
        });
    }

    $scope.init = function () {
        $scope.getMarketTemplateType();
    }

    $scope.init();
}]);