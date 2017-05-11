app.controller('wqsFactorListCtrl', ['$scope', '$modalInstance', 'radasoft', 'params', '$translate', function ($scope, $modalInstance, radasoft, params, $translate) {
    $scope.includeUrl = 'app/views/test/wqsFactorList.html';
    $scope.title = 'กรุณาเลือกรูปแบบข้อมูล';
    //$scope.showBtnOK = true;

    $scope.factorList = [];

    $scope.select = function (item) {
        $modalInstance.close(item);
    }

    $scope.cancel = function () {
        $modalInstance.dismiss();
    }

    $scope.getWqsFactorList = function () {
        radasoft.getWqsFactorList({ HEAD_COL_RUNNING_ID: params.HEAD_COL_RUNNING_ID }).then(function (response) {
            $scope.factorList = response.data;

            if ($scope.factorList.length == 1) {
                $modalInstance.close($scope.factorList[0]);
            }
        });
    }

    $scope.init = function () {
        $scope.getWqsFactorList();
    }

    $scope.init();
}]);