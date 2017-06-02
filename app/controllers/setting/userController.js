app.controller('userController', ['$scope', 'radasoft', '$state', '$stateParams', '$rootScope', function ($scope, radasoft, $state, $stateParams, $rootScope) {
    $scope.users = [];
    $scope.paging1CurrentPage = 1;
    $scope.searchKeyword = '';

    $scope.getMasterUser = function (FILTER) {
        radasoft.getMasterUser({
            limit: $rootScope.app.itemsPerPage,
            page: $scope.paging1CurrentPage,
            filters: [
                { NAME: 'FILTER', VALUE: $scope.searchKeyword }
            ]
        }).then(function (response) {
            $scope.users = response.data.data;
            $scope.paging1Total = response.data.total;
        });
    }

    $scope.searchEnter = function ($event) {
        if ($event && $event.keyCode == 13) {
            $scope.getMasterUser($scope.searchKeyword);
        }
    }

    $scope.searchClick = function () {
        $scope.getMasterUser($scope.searchKeyword);
    }

    $scope.openUserEditor = function (data) {
        radasoft.openDialog({
            controller: 'masterUserEditor',
            resolve: {
                params: function () {
                    return {
                        formData: data
                    };
                }
            }
        }).result.then(function (response) {
            radasoft.success();
            $scope.init();
        });
    }

    $scope.add = function () {
        $scope.openUserEditor({ USER_RUNNING_ID: -1 });
    }

    $scope.edit = function (item) {
        $scope.openUserEditor(item);
    }

    $scope.init = function () {
        $scope.getMasterUser($scope.searchKeyword);
    }

    $scope.init();
}]);

app.controller('masterUserEditor', ['$scope', 'radasoft', '$state', '$stateParams', '$modalInstance', 'params', '$translate', '$q', function ($scope, radasoft, $state, $stateParams, $modalInstance, params, $translate, $q) {
    $scope.includeUrl = '/app/views/setting/userEditor.html';
    $scope.title = $translate.instant('USER');
    $scope.formData = {};//params.formData;
    $scope.showBtnSave = true;
    $scope.selectPrefix = [];
    $scope.selectOU = [];

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.getPrefix = function () {
        var deferred = $q.defer();

        radasoft.getPrefix({ FILTER: '' }).then(function (response) {
            $scope.selectPrefix = response.data;
        }).finally(function () {
            deferred.resolve();
        });

        return deferred.promise;
    }
    $scope.getOU = function () {
        var deferred = $q.defer();

        radasoft.getOU({}).then(function (response) {
            $scope.selectOU = response.data;
        }).finally(function () {
            deferred.resolve();
        });

        return deferred.promise;
    }
    $scope.getMasterUser = function (USER_RUNNING_ID) {
        var deferred = $q.defer();

        radasoft.getMasterUserDetail({ USER_RUNNING_ID: USER_RUNNING_ID }).then(function (response) {
            if (response.data != null) {
                $scope.formData = response.data;
            } else {
                $scope.formData = params.formData;
                $scope.formData.RECORD_STATUS = 'A';
            }

        }).finally(function () {
            deferred.resolve();
        });

        return deferred.promise;
    }
    $scope.setMasterUser = function (data) {
        radasoft.setMasterUser(data).then(function (response) {
            //$scope.formData = response.data;
            radasoft.success();
            $modalInstance.close(response.data);
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
            if ($scope.formData.VALUE1 === $scope.formData.VALUE2) {
                $scope.formData.PASS_WORD = $scope.formData.VALUE1;
                radasoft.confirmAndSave($translate.instant('CONFIRM.SAVE'), '', function (isconfirmed) {
                    if (isconfirmed) {
                        $scope.setMasterUser($scope.formData);
                    }
                });
            } else {
                radasoft.alert($translate.instant('PASSWORD_MISMATCH'));
            }
        }
    }

    $scope.changePwd = function () {
        radasoft.openDialog({
            controller: 'changePasswordController',
            resolve: {
                params: function () {
                    return {
                        formData: $scope.formData
                    };
                }
            }
        }).result.then(function (response) {
            radasoft.success();
            $scope.init();
        });
    }

    $scope.init = function () {
        $scope.getPrefix().then(function () {
            $scope.getOU().then(function () {
                $scope.getMasterUser(params.formData.USER_RUNNING_ID);
            });
        });
    }

    $scope.init();
}]);

app.controller('changePasswordController', ['$scope', 'radasoft', '$state', '$stateParams', '$modalInstance', 'params', '$translate', '$q', function ($scope, radasoft, $state, $stateParams, $modalInstance, params, $translate, $q) {
    $scope.includeUrl = '/app/views/setting/userChangePwd.html';
    $scope.title = $translate.instant('CHANGE_PASSWORD');
    $scope.formData = params.formData;
    $scope.showBtnSave = true;
    $scope.value12Match = false;

    $scope.formData.VALUE1 = '';
    $scope.formData.VALUE2 = '';

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    //$scope.value12Change = function () {
    //    $scope.value12Match = $scope.formData.VALUE1 === $scope.formData.VALUE2;

    //    return true;
    //}

    $scope.save = function (form) {
        if (($scope.formData.VALUE1 === $scope.formData.VALUE2) && ($scope.formData.VALUE1 != '' && $scope.formData.VALUE2 != '')) {
            radasoft.confirmAndSave($translate.instant('CONFIRM.SAVE'), '', function (isconfirmed) {
                if (isconfirmed) {
                    $scope.changeUserValue({
                        USER_RUNNING_ID: $scope.formData.USER_RUNNING_ID,
                        PASS_WORD: $scope.formData.VALUE1
                    });
                }
            });
        } else {
            radasoft.alert($translate.instant('PASSWORD_MISMATCH'));
        }
    }

    $scope.init = function () {

    }

    $scope.init();
}]);