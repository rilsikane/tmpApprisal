app.controller('subform9500Controller', ['$scope', '$state', '$stateParams', 'radasoft', '$modal', '$translate', function ($scope, $state, $stateParams, common, $modal, $translate) {
    $scope.title = $stateParams.STATE_NAME;
    $scope.tabs = [];
    $scope.w4buttons = [];
    $scope.changableState = [];
    $scope.ldloading = {};
    $scope.btnDisabled = false;

    $scope.getW4history = function (DOC_ID) {
        common.getW4history({ DOC_ID: DOC_ID }).then(function (response) {
            if (response.data.success) {
                $scope.history = response.data.data;
            }
        });
    };

    $scope.init = function () {
        $scope.DOC_ID = $scope.tab.DOC_ID;
        $scope.getW4history($scope.DOC_ID);
    }

    $scope.$on('activateTab9500', function (event, parameters) {
        $scope.init();
    });
}]);