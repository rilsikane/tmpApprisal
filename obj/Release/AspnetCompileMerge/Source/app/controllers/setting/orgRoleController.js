app.controller('orgRoleController', ['$scope', 'radasoft', '$state', '$stateParams', function ($scope, radasoft, $state, $stateParams) {
    $scope.ou = [];
    $scope.selectedOU = {};

    $scope.searchKeyword = '';

    $scope.getAllOU = function (FILTER) {
        radasoft.getAllOU({ FILTER: FILTER }).then(function (response) {
            $scope.ou = response.data;
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
    $scope.includeUrl = 'app/views/setting/orgRoleEditor.html';
    $scope.title = $translate.instant('ORG_ROLE');
    $scope.formData = params.formData;
    $scope.showBtnSave = true;
    $scope.orgRoles = [];

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.getMasterOrgRoles = function () {
        radasoft.getMasterOrgRoles({ OU_ID: $scope.formData.OU_ID }).then(function (response) {
            $scope.orgRoles = response.data;
        });
    }
    $scope.setMasterOrgRoles = function () {
        radasoft.setMasterOrgRoles($scope.orgRoles).then(function (response) {
            $scope.orgRoles = response.data;

            radasoft.success();
        });
    }

    $scope.save = function () {
        radasoft.confirmAndSave($translate.instant('CONFIRM.SAVE'), '', function (isconfirmed) {
            if (isconfirmed) {
                $scope.setMasterOrgRoles();
            }
        });
    }

    $scope.init = function () {
        $scope.getMasterOrgRoles();
    }

    $scope.init();
}]);