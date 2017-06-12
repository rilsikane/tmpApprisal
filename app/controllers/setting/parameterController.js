app.controller('parameterController', ['$scope', 'radasoft', '$state', '$stateParams', '$translate', '$rootScope', function ($scope, radasoft, $state, $stateParams, $translate, $rootScope) {
    $scope.parameters = [];
    $scope.paging1CurrentPage = 1;
    $scope.paging1Total = 0;
    $scope.searchKeyword = '';

    $scope.getParameter = function (FILTER) {
        radasoft.getParameter2({
            limit: $rootScope.app.itemsPerPage,
            page: $scope.paging1CurrentPage,
            filters: [
                { NAME: 'CODE_MAJOR', VALUE: $scope.MAJOR_CODE },
                { NAME: 'FILTER', VALUE: FILTER }
            ]
        }).then(function (response) {
            $scope.parameters = response.data.data;
            $scope.paging1Total = response.data.total;
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
    $scope.includeUrl = '/app/views/setting/parameters/parameterEditor.html';
    $scope.title = params.title;
    $scope.formData = {};//params.formData;
    $scope.showBtnSave = true;
    $scope.showBtnDelete = false;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.getParameter = function (data) {
        var deferred = $q.defer();

        radasoft.getParameterDetail({ P_RUNNING_ID: data.P_RUNNING_ID }).then(function (response) {
            if (response.data != null) {
                $scope.formData = response.data;
            } else {
                $scope.formData = params.formData;
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

app.controller('lookMstCtrl', ['$scope', 'radasoft', '$state', '$stateParams', '$translate', '$rootScope', function ($scope, radasoft, $state, $stateParams, $translate, $rootScope) {
    $scope.parameters = [];
    $scope.paging1CurrentPage = 1;
    $scope.paging1Total = 0;
    $scope.searchKeyword = '';

    $scope.getLookMst = function (FILTER) {
        radasoft.getLookMst({
            limit: $rootScope.app.itemsPerPage,
            page: $scope.paging1CurrentPage,
            filters: [
                { NAME: 'L_TYPE', VALUE: $scope.L_TYPE },
                { NAME: 'FILTER', VALUE: FILTER }
            ]
        }).then(function (response) {
            $scope.parameters = response.data.data;
            $scope.paging1Total = response.data.total;
        });
    }

    $scope.searchEnter = function ($event) {
        if ($event && $event.keyCode == 13) {
            $scope.getLookMst($scope.searchKeyword);
        }
    }

    $scope.searchClick = function () {
        $scope.getLookMst($scope.searchKeyword);
    }

    $scope.openParameterEditor = function (data) {
        radasoft.openDialog({
            controller: 'lookMstEditorCtrl',
            resolve: {
                params: function () {
                    return {
                        title: $translate.instant($scope.L_TYPE),
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
        $scope.openParameterEditor({ L_TYPE: $scope.L_TYPE, L_ID: '' });
    }

    $scope.edit = function (item) {
        $scope.openParameterEditor(item);
    }

    $scope.init = function () {
        $scope.getLookMst($scope.searchKeyword);
    }

    $scope.init();
}]);

app.controller('lookMstEditorCtrl', ['$scope', 'radasoft', '$state', '$stateParams', '$modalInstance', 'params', '$translate', '$q', function ($scope, radasoft, $state, $stateParams, $modalInstance, params, $translate, $q) {
    $scope.includeUrl = '/app/views/setting/lookmst/parameterEditor.html';
    $scope.title = params.title;
    $scope.formData = {};// params.formData;
    $scope.showBtnSave = true;
    $scope.showBtnDelete = false;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.getLookMstDetail = function (data) {
        var deferred = $q.defer();

        radasoft.getLookMstDetail({
            L_TYPE: params.formData.L_TYPE,
            L_ID: params.formData.L_ID
        }).then(function (response) {
            if (response.data != null) {
                $scope.formData = response.data;
            }
            else {
                $scope.formData = params.formData;
            }

            if ($scope.formData.L_ID != '') {

            }
        }).finally(function () {
            deferred.resolve();
        });

        return deferred.promise;
    }

    $scope.setLookMst = function (data) {
        radasoft.setLookMst(data).then(function (response) {
            $modalInstance.close(response.data);
        });
    }

    $scope.delete = function () {
        radasoft.confirmAndSave($translate.instant('CONFIRM.DELETE'), '', function (isconfirmed) {
            if (isconfirmed) {
                radasoft.delLookMst($scope.formData).then(function (response) {
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
                    $scope.setLookMst($scope.formData);
                }
            });
        }
    }

    $scope.init = function () {
        $scope.getLookMstDetail(params.formData);
    }

    $scope.init();
}]);

app.controller('debtTypeCtrl', ['$scope', 'radasoft', '$state', '$stateParams', '$translate', '$rootScope', function ($scope, radasoft, $state, $stateParams, $translate, $rootScope) {
    $scope.parameters = [];
    $scope.paging1CurrentPage = 1;
    $scope.paging1Total = 0;
    $scope.searchKeyword = '';

    $scope.getMasterDebtType = function (FILTER) {
        radasoft.getMasterDebtType({
            limit: $rootScope.app.itemsPerPage,
            page: $scope.paging1CurrentPage,
            filters: [
                { NAME: 'FILTER', VALUE: $scope.searchKeyword }
            ]
        }).then(function (response) {
            $scope.parameters = response.data.data;
            $scope.paging1Total = response.data.total;
        });
    }

    $scope.searchEnter = function ($event) {
        if ($event && $event.keyCode == 13) {
            $scope.getMasterDebtType($scope.searchKeyword);
        }
    }

    $scope.searchClick = function () {
        $scope.getMasterDebtType($scope.searchKeyword);
    }

    $scope.openParameterEditor = function (data) {
        radasoft.openDialog({
            controller: 'debtTypeEditorCtrl',
            resolve: {
                params: function () {
                    return {
                        title: $translate.instant('DEBT_TYPE'),
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
        $scope.openParameterEditor({ TYPE_ID: '' });
    }

    $scope.edit = function (item) {
        $scope.openParameterEditor(item);
    }

    $scope.init = function () {
        $scope.getMasterDebtType($scope.searchKeyword);
    }

    $scope.init();
}]);

app.controller('debtTypeEditorCtrl', ['$scope', 'radasoft', '$state', '$stateParams', '$modalInstance', 'params', '$translate', '$q', function ($scope, radasoft, $state, $stateParams, $modalInstance, params, $translate, $q) {
    $scope.includeUrl = '/app/views/setting/debttype/parameterEditor.html';
    $scope.title = params.title;
    $scope.formData = {};// params.formData;
    $scope.showBtnSave = true;
    $scope.showBtnDelete = false;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.getMasterDebtTypeById = function (data) {
        var deferred = $q.defer();

        radasoft.getMasterDebtTypeById({
            TYPE_ID: params.formData.TYPE_ID
        }).then(function (response) {
            if (response.data != null) {
                $scope.formData = response.data;
            }
            else {
                $scope.formData = params.formData;
            }

            if ($scope.formData.TYPE_ID != '') {
                $scope.showBtnDelete = true;
            }
        }).finally(function () {
            deferred.resolve();
        });

        return deferred.promise;
    }

    $scope.setMasterDebtType = function (data) {
        radasoft.setMasterDebtType(data).then(function (response) {
            $modalInstance.close(response.data);
        });
    }

    $scope.delete = function () {
        radasoft.confirmAndSave($translate.instant('CONFIRM.DELETE'), '', function (isconfirmed) {
            if (isconfirmed) {
                radasoft.delMasterDebtType($scope.formData).then(function (response) {
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
                    $scope.setMasterDebtType($scope.formData);
                }
            });
        }
    }

    $scope.init = function () {
        $scope.getMasterDebtTypeById(params.formData);
    }

    $scope.init();
}]);