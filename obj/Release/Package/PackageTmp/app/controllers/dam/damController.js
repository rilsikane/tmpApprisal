'use strict';
app.controller('damController', function ($scope, $state, radasoft) {
    $scope.tables = [];
    $scope.edit = {};

    $scope.getTables = function () {
        radasoft.getTables().then(function (response) {
            $scope.tables = response.data;
        });
    }

    $scope.openTable = function (item) {
        $scope.edit = item;
        $state.go('app.dam.table', { t: item.VALUE });
    }

    $scope.getTables();
});

app.controller('tableController', function ($scope, $state, radasoft) {
    $scope.columns = [];
    $scope.data = [];

    $scope.getColumns = function () {
        radasoft.getTableColumns({ t: $scope.$parent.edit.VALUE }).then(function (response) {
            $scope.columns = (response.data);

            $scope.getData();
        });
    }

    $scope.getData = function () {
        radasoft.getTableData({ t: $scope.$parent.edit.VALUE }).then(function (response) {
            $scope.data = response.data;
        });
    }

    $scope.getColumns();
});