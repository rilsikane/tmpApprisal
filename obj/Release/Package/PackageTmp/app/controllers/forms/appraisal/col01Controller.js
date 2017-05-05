app.controller('col01Controller', ['$scope', '$state', 'common', function ($scope, $state, common) {
    $scope.back = function () {
        console.log('transition');
        $state.transitionTo('app.inbox', {}, { notify: true, location: true });
    }
    console.log('col01Controller');
}]);

app.controller('col02Controller', ['$scope', '$state', 'common', function ($scope, $state, common) {
    $scope.back = function () {
        console.log('transition');
        $state.transitionTo('app.inbox', {}, { notify: true, location: true });
    }
    console.log('col02Controller');
}]);