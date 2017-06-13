app.controller('orgRoleController', ['$scope', 'radasoft', '$state', '$stateParams', '$rootScope', function ($scope, radasoft, $state, $stateParams, $rootScope) {
    $scope.ou = [];
    $scope.selectedOU = {};
    $scope.paging1CurrentPage = 1;

    $scope.searchKeyword = '';

    $scope.getAllOU = function (FILTER) {
        radasoft.getAllOU2({
            limit: $rootScope.app.itemsPerPage,
            page: $scope.paging1CurrentPage,
            filters: [
                { NAME: 'FILTER', VALUE: $scope.searchKeyword }
            ]
        }).then(function (response) {
            $scope.ou = response.data.data;
            $scope.paging1Total = response.data.total;
        });
    }

    $scope.search = function ($event) {
        if ($event.keyCode == 13) {
            $scope.getAllOU($scope.searchKeyword);
        }
    }

    $scope.selectOU = function (item) {
        $scope.selectedOU = item;
    }

    $scope.openOrgRole = function (data) {
        radasoft.openDialog({
            controller: 'orgRoleEditor',
            resolve: {
                params: function () {
                    return {
                        formData: data
                    };
                }
            }
        }).result.then(function (response) {
            radasoft.success();
        });
    }

    $scope.add = function () {
        $scope.openOrgRole({ OU_ID: 0, OU_TYPE: 'E' });
    }

    $scope.edit = function (item) {
        $scope.openOrgRole(item);
    }

    $scope.init = function () {
        $scope.getAllOU($scope.searchKeyword);
    }

    $scope.init();
}]);

app.controller('orgRoleEditor', ['$scope', 'radasoft', '$state', '$stateParams', '$modalInstance', 'params', '$translate', function ($scope, radasoft, $state, $stateParams, $modalInstance, params, $translate) {
    $scope.includeUrl = '/app/views/setting/orgRoleEditor.html';
    $scope.title = $translate.instant('ORG_ROLE');
    $scope.formData = undefined;
    $scope.showBtnSave = true;
    $scope.orgRoles = [];

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.getMasterOrgRoles = function () {
        radasoft.getMasterOrgRoles({ OU_ID: params.formData.OU_ID }).then(function (response) {
            $scope.formData = response.data;
        });
    }

    $scope.setMasterOrgRoles = function () {
        radasoft.setMasterOrgRoles($scope.formData).then(function (response) {
            $scope.formData = response.data;

            radasoft.success();
        });
    }

    $scope.save = function (form) {
        if (form.$invalid) {
            var field = null, firstError = null;
            for (field in form) {
                if (field[0] != '$') {
                    if (firstError === null && !form[field].$valid) {
                        firstError = form[field].$name;
                    }

                    if (form[field].$pristine) {
                        form[field].$dirty = true;
                    }
                }
            }
        } else {
            radasoft.confirmAndSave($translate.instant('CONFIRM.SAVE'), '', function (isconfirmed) {
                if (isconfirmed) {
                    $scope.setMasterOrgRoles();
                }
            });
        }
    }

    $scope.init = function () {
        $scope.getMasterOrgRoles();
    }

    $scope.init();
}]);