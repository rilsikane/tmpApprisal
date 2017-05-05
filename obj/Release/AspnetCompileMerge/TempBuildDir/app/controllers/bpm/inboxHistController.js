app.controller('inboxHistController', ['$rootScope', '$scope', 'radasoft', '$state', '$stateParams', function ($rootScope, $scope, radasoft, $state, $stateParams) {
    $scope.data = [];
    $scope.totalItems = 0;
    $scope.currentPage = 1;

    $scope.pageChanged = function () {
        radasoft.getMyHist({
            limit: $rootScope.app.itemsPerPage,
            page: $scope.currentPage
        }).then(function (response) {
            $scope.data = response.data.data;
            $scope.totalItems = response.data.total;
        });
    };

    $scope.pageChanged();
}]);