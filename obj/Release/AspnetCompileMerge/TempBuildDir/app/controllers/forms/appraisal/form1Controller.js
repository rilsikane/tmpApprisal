app.controller('form1Controller', ['$scope', '$state', 'common', function ($scope, $state, common) {
    $scope.back = function () {
        console.log('transition');
        $state.transitionTo('app.inbox', {}, { notify: true, location: true });
    }    
}]);