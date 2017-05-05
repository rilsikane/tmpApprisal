app.controller('mydocsController', ['$rootScope', '$scope', '$state', '$stateParams', 'radasoft', function ($rootScope, $scope, $state, $stateParams, radasoft) {
    $scope.data = [];
    //var params = {};
    $scope.totalItems = 0;
    $scope.currentPage = 1;
    //$scope.itemsPerPage = 10;
    //$scope.hideParent = false;

    $scope.pageChanged = function () {
        radasoft.getMyDocs({
            limit: $rootScope.app.itemsPerPage,
            page: $scope.currentPage
        }).then(function (response) {
            $scope.data = response.data.data;
            $scope.totalItems = response.data.total;
        });
    };


    $scope.new = function () {
        $state.go('app.testform', { DOC_ID: 0 });
        //$state.go('app.form.form1', { DOC_ID: 0 });
    }

    $scope.pageChanged();
}]);