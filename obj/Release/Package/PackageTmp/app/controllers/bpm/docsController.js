app.controller('docsController', ['$scope', 'radasoft', '$state', '$stateParams', '$translate', function ($scope, common, $state, $stateParams, $translate) {
    $scope.data = [];
    //var params = {};
    $scope.totalItems = 0;
    $scope.currentPage = 1;
    $scope.itemsPerPage = 20;

    $scope.pageChanged = function () {
        common.getAllDocs({
            start: (($scope.currentPage - 1) * $scope.itemsPerPage),
            limit: $scope.itemsPerPage,
            page: $scope.currentPage
        }).then(function (response) {
            $scope.data = response.data.data;
            $scope.totalItems = response.data.total;
        }, function (error) {
            common.alert(error.data.ExceptionType, error.data.Message);
        });
    };

    $scope.pageChanged();
}]);