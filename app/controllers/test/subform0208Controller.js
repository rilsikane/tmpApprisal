app.controller('subform0208Controller', ['$scope', '$state', '$stateParams', 'radasoft', '$modal', '$translate', 'FileUploader', 'params', '$modalInstance', function ($scope, $state, $stateParams, radasoft, $modal, $translate, FileUploader, params, $modalInstance) {
    $scope.title = $stateParams.STATE_NAME;
    $scope.ldloading = {};
    $scope.btnDisabled = false;
    $scope.btnSubmitDisabled = true;
    $scope.headCol = params.headCol;
    $scope.colAct = params.colAct;
    $scope.includeUrl = params.includeUrl || '';
    $scope.showButtonSave = params.showButtonSave || false;
    $scope.tab = params.tab;

    $scope.submit = function () {
        $scope.$broadcast('setQuestionnaire');
    }

    if ($scope.tab.update) {
        $scope.btnSubmitDisabled = false;
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.init = function () {
        //$scope.getQnrMaster();
    }

    $scope.init();
}]);