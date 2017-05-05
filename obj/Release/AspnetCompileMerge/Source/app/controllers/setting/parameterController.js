app.controller('parameterController', ['$scope', 'radasoft', '$state', '$stateParams', '$translate', function ($scope, radasoft, $state, $stateParams, $translate) {
    $scope.parameters = [];

    $scope.searchKeyword = '';

    $scope.getParameter = function (FILTER) {
        radasoft.getParameter({ P_RUNNING_ID: 0, CODE_MAJOR: $scope.MAJOR_CODE, FILTER: FILTER }).then(function (response) {
            $scope.parameters = response.data;
        });
    }

    $scope.searchEnter = function ($event) {
        if ($event && $event.keyCode == 13) {
            $scope.getParameter($scope.searchKeyword);
        }
    }

    $scope.searchClick = function () {
        $scope.getParameter($scope.searchKeyword);
    }

    $scope.openParameterEditor = function (data) {
        radasoft.openDialog({
            controller: 'parameterEditor',
            resolve: {
                params: function () {
                    return {
                        title: $translate.instant($scope.MAJOR_CODE),
                        formData: data
                    };
                }
            }
        }).result.then(function (response) {
            radasoft.success();
            $scope.init();
        }, function () {
            $scope.init();
        });
    }

    $scope.add = function () {
        $scope.openParameterEditor({ P_RUNNING_ID: -1, CODE_MAJOR: $scope.MAJOR_CODE });
    }

    $scope.edit = function (item) {
        $scope.openParameterEditor(item);
    }

    $scope.init = function () {
        $scope.getParameter($scope.searchKeyword);
    }

    $scope.init();
}]);

app.controller('parameterEditor', ['$scope', 'radasoft', '$state', '$stateParams', '$modalInstance', 'params', '$translate', '$q', function ($scope, radasoft, $state, $stateParams, $modalInstance, params, $translate, $q) {
    $scope.includeUrl = 'app/views/setting/parameters/parameterEditor.html';
    $scope.title = params.title;
    $scope.formData = params.formData;
    $scope.showBtnSave = true;
    $scope.showBtnDelete = true;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.getParameter = function (data) {
        var deferred = $q.defer();

        radasoft.getParameter({ P_RUNNING_ID: data.P_RUNNING_ID, CODE_MAJOR: data.CODE_MAJOR, FILTER: '' }).then(function (response) {
            if (response.data.length > 0) {
                $scope.formData = response.data[0];
            }

        }).finally(function () {
            deferred.resolve();
        });

        return deferred.promise;
    }

    $scope.setParameter = function (data) {
        radasoft.setParameter(data).then(function (response) {
            $modalInstance.close(response.data);
        });
    }

    $scope.delete = function () {
        radasoft.confirmAndSave($translate.instant('CONFIRM.DELETE'), '', function (isconfirmed) {
            if (isconfirmed) {
                radasoft.delParameter($scope.formData).then(function (response) {
                    $modalInstance.close(response.data);
                });
            }
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
                    $scope.setParameter($scope.formData);
                }
            });
        }
    }

    $scope.init = function () {
        $scope.getParameter(params.formData);
    }

    $scope.init();
}]);