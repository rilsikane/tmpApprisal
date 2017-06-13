app.controller('loanMstCtrl', ['$scope', 'radasoft', '$state', '$stateParams', '$translate', '$rootScope', '$q', function ($scope, radasoft, $state, $stateParams, $translate, $rootScope, $q) {
    $scope.loanGroup = [];
    $scope.paging1CurrentPage = 1;
    $scope.paging2CurrentPage = 1;
    $scope.paging1Total = 0;
    $scope.searchKeyword1 = '';
    $scope.searchKeyword2 = '';
    $scope.LOAN_GROUP_ID = 0;

    $scope.onLoadGroupSelect = function (item) {
        $scope.LOAN_GROUP_ID = item.LOAN_GROUP_ID;
        $scope.getLoanType();
    }
    $scope.getLoanGroup = function () {
        var deferred = $q.defer();
        radasoft.getMasterLoanGroup({
            limit: $rootScope.app.itemsPerPage,
            page: $scope.paging1CurrentPage,
            filters: [
                { NAME: 'FILTER', VALUE: $scope.searchKeyword1 }
            ]
        }).then(function (response) {
            $scope.loanGroup = response.data.data;
            $scope.paging1Total = response.data.total;

            deferred.resolve();
        });
        return deferred.promise;
    }
    $scope.searchEnter1 = function ($event) {
        if ($event && $event.keyCode == 13) {
            $scope.getLoanGroup();
        }
    }
    $scope.searchClick1 = function () {
        $scope.getLoanGroup();
    }

    $scope.getLoanType = function (FILTER) {
        radasoft.getMasterLoanType({
            limit: $rootScope.app.itemsPerPage,
            page: $scope.paging2CurrentPage,
            filters: [
                { NAME: 'LOAN_GROUP_ID', VALUE: $scope.LOAN_GROUP_ID },
                { NAME: 'FILTER', VALUE: $scope.searchKeyword2 }
            ]
        }).then(function (response) {
            $scope.loanType = response.data.data;
            $scope.paging2Total = response.data.total;
        });
    }
    $scope.searchEnter2 = function ($event) {
        if ($event && $event.keyCode == 13) {
            $scope.getLoanType();
        }
    }
    $scope.searchClick2 = function () {
        $scope.getLoanType();
    }

    $scope.openLoanGroupEditor = function (data, title) {
        radasoft.openDialog({
            controller: 'loanGroupEditorCtrl',
            resolve: {
                params: function () {
                    return {
                        title: title,
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

    $scope.openLoanTypeEditor = function (data, title) {
        radasoft.openDialog({
            controller: 'loanTypeEditorCtrl',
            resolve: {
                params: function () {
                    return {
                        title: title,
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

    $scope.addLoanGroup = function () {
        $scope.openLoanGroupEditor({
            LOAN_GROUP_ID: '',
            RECORD_STATUS: 'A',
            IS_NEW: true
        }, $translate.instant('LOAN_GROUP_ID'));
    }

    $scope.editLoanGroup = function (item) {
        $scope.openLoanGroupEditor(item, item.LOAN_GROUP_NAME);
    }

    $scope.addLoanType = function () {
        if ($scope.LOAN_GROUP_ID == '') {
            radasoft.alert('กรุณาเลือก ' + $translate.instant('LOAN_GROUP'));
        } else {
            $scope.openLoanTypeEditor({
                LOAN_GROUP_ID: $scope.LOAN_GROUP_ID,
                LOAN_TYPE_ID: '',
                RECORD_STATUS: 'A',
                IS_NEW: true
            }, $translate.instant('LOAN_TYPE_ID'));
        }
    }
    $scope.editLoanType = function (item) {
        $scope.openLoanTypeEditor(item, item.LOAN_TYPE_NAME);
    }
    $scope.init = function () {
        $scope.getLoanGroup($scope.searchKeyword).then(function () {
            $scope.getLoanType();
        });
    }

    $scope.init();
}]);

app.controller('loanGroupEditorCtrl', ['$scope', 'radasoft', '$state', '$stateParams', '$modalInstance', 'params', '$translate', '$q', function ($scope, radasoft, $state, $stateParams, $modalInstance, params, $translate, $q) {
    $scope.includeUrl = '/app/views/setting/loan/loanGroupEditor.html';
    $scope.title = params.title;
    $scope.formData = {};
    $scope.showBtnSave = true;
    $scope.showBtnDelete = false;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.getLoanGroupDetail = function (data) {
        var deferred = $q.defer();

        radasoft.getLoanGroupDetail({ LOAN_GROUP_ID: data.LOAN_GROUP_ID }).then(function (response) {
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

    $scope.setMasterLoanGroup = function (data) {
        radasoft.setMasterLoanGroup(data).then(function (response) {
            $modalInstance.close(response.data);
        });
    }

    $scope.delete = function () {
        radasoft.confirmAndSave($translate.instant('CONFIRM.DELETE'), '', function (isconfirmed) {
            if (isconfirmed) {
                radasoft.delLoanGroupDetail($scope.formData).then(function (response) {
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
                    $scope.setMasterLoanGroup($scope.formData);
                }
            });
        }
    }

    $scope.init = function () {
        $scope.getLoanGroupDetail(params.formData);
    }

    $scope.init();
}]);

app.controller('loanTypeEditorCtrl', ['$scope', 'radasoft', '$state', '$stateParams', '$modalInstance', 'params', '$translate', '$q', function ($scope, radasoft, $state, $stateParams, $modalInstance, params, $translate, $q) {
    $scope.includeUrl = '/app/views/setting/loan/loanTypeEditor.html';
    $scope.title = params.title;
    $scope.formData = {};
    $scope.showBtnSave = true;
    $scope.showBtnDelete = false;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.getLoanTypeDetail = function (data) {
        var deferred = $q.defer();

        radasoft.getLoanTypeDetail({ LOAN_GROUP_ID: data.LOAN_GROUP_ID, LOAN_TYPE_ID: data.LOAN_TYPE_ID }).then(function (response) {
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

    $scope.setMasterLoanType = function (data) {
        radasoft.setMasterLoanType(data).then(function (response) {
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
            radasoft.confirmAndSave($translate.instant('CONFIRM.SAVE'), '', function (isconfirmed) {
                if (isconfirmed) {
                    $scope.setMasterLoanType($scope.formData);
                }
            });
        }
    }

    $scope.init = function () {
        $scope.getLoanTypeDetail(params.formData);
    }

    $scope.init();
}]);