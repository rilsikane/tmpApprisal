app.controller('subform0100Controller', ['$scope', '$state', 'toaster', '$modal', '$translate', 'SweetAlert', 'radasoft', '$q', function ($scope, $state, toaster, $modal, $translate, SweetAlert, radasoft, $q) {
    $scope.ldloading = {};
    $scope.requireNotificationPrefix = $translate.instant('FORM.REQUIRE_PREFIX');
    $scope.requestType = [];
    $scope.segment = [];
    $scope.debtType = [];
    $scope.custType = [];
    $scope.dept = [];

    $scope.btnDisabled = true;
    $scope.inputDisabled = true;
    $scope.inputReadOnly = true;

    if ($scope.tab.create || $scope.tab.update) {
        $scope.btnDisabled = false;
        $scope.inputDisabled = false;
    }

    $scope.BUTTON = {
        SAVE: $translate.instant('BUTTON.SAVE')
    };

    $scope.onNPAChange = function () {
        $scope.$parent.formData.DEBT_TYPE = undefined;
        $scope.$parent.formData.CUST_TYPE = undefined;
    }

    $scope.init = function () {
        radasoft.getRequestType({}).then(function (response) {
            $scope.requestType = response.data;

            radasoft.getSegment({}).then(function (response) {
                $scope.segment = response.data;

                radasoft.getObjective({}).then(function (response) {
                    $scope.objective = response.data;

                    radasoft.getDebtType({}).then(function (response) {
                        $scope.debtType = response.data;

                        radasoft.getCustType({}).then(function (response) {
                            $scope.custType = response.data;

                            //radasoft.getDept({}).then(function (response) {
                            //    $scope.dept = response.data;
                            //});
                        });
                    });
                });
            });
        });
    }

    $scope.loadFormData = function () {
        radasoft.getFormData({ DOC_ID: $scope.tab.DOC_ID }).then(function (response) {
            //$scope.formData = response.data;

            $scope.$parent.formData = response.data;

            //$scope.formData = $scope.$parent.formData;
        });
    }

    $scope.calDebt = function () {
        $scope.$parent.formData.CREDIT_LIMIT = $scope.$parent.formData.CREDIT_REQUEST + $scope.$parent.formData.CREDIT_BALANCE;
    }

    $scope.save = function (style) {
        radasoft.confirmAndSave($translate.instant('CONFIRM.SAVE'), '', function (isconfirmed) {
            if (isconfirmed) {
                radasoft.setFormData($scope.$parent.formData).then(function (response) {
                    radasoft.success();
                    if ($scope.tab.DOC_ID == 0) {
                        $state.go('app.testform', { ACT_HIST_ID: response.data.ACT_HIST_ID });
                    } else {
                        $scope.$parent.updateOU($scope.tab.DOC_ID);
                    }
                });
            }
        });
    }

    $scope.submit = function (form, style) {
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

            //toaster.pop('warning', $translate.instant('NOTIFY.DATA_INVALID'));
        } else {
            $scope.save(style);
        }
    };

    //$scope.getLenders = function (LENDER_TYPE) {
    //    radasoft.getLenders({
    //        REQUEST_RUNNING_ID: $scope.$parent.formData.REQUEST_RUNNING_ID,
    //        LENDER_TYPE: LENDER_TYPE
    //    }).then(function (response) {
    //        if (LENDER_TYPE == 'L') {
    //            $parent.formData.CUSTOMERS = response.data;
    //        } else if (LENDER_TYPE == 'C') {
    //            $parent.formData.CONTACTS = response.data;
    //        }
    //    });
    //}

    $scope.delLenderContact = function (item) {
        var deffered = $q.defer();
        radasoft.confirmAndSave($translate.instant('CONFIRM.DELETE'), '', function (isconfirmed) {
            if (isconfirmed) {
                radasoft.delLender(item).then(function () {
                    radasoft.success();
                    deffered.resolve();
                });
            }
        });
        return deffered.promise;
    }

    $scope.addLender = function () {
        $scope.openLenderContactEditor({
            LENDER_RUNNING_ID: -(Math.random() * 100000),
            LENDER_TYPE: 'L'
        }).then(function (data) {
            $scope.$parent.formData.CUSTOMERS.push(angular.copy(data));
        });
    }
    $scope.delLender = function (item) {
        $scope.delLenderContact(item).then(function () {
            $scope.$parent.formData.CUSTOMERS = $.grep($scope.$parent.formData.CUSTOMERS, function (i) { return i.LENDER_RUNNING_ID != item.LENDER_RUNNING_ID; })
        });
    }

    $scope.addContact = function () {
        $scope.openLenderContactEditor({
            LENDER_RUNNING_ID: -(Math.random() * 100000),
            LENDER_TYPE: 'C'
        }).then(function (data) {
            $scope.$parent.formData.CONTACTS.push(angular.copy(data));
        });
    }
    $scope.delContact = function (item) {
        $scope.delLenderContact(item).then(function () {
            $scope.$parent.formData.CONTACTS = $.grep($scope.$parent.formData.CONTACTS, function (i) { return i.LENDER_RUNNING_ID != item.LENDER_RUNNING_ID; })
        });
    }

    $scope.editLenderContact = function (item) {
        $scope.openLenderContactEditor(item).then(function (response) {
            angular.copy(response, item);
        });
    }

    $scope.openLenderContactEditor = function (item) {
        var deffered = $q.defer();

        var title = item.LENDER_TYPE == 'L' ? $translate.instant('LENDER_NAME') : $translate.instant('LENDER_CONTACT');

        radasoft.openDialog({
            //templateUrl: 'app/views/test/headColActionDialogTemplate.html',
            controller: 'subform0101Controller',
            resolve: {
                params: function () {
                    return {
                        title: title,
                        formData: item
                    };
                }
            }
        }).result.then(function (data) {
            deffered.resolve(data);
        });

        return deffered.promise;
    }

    //$scope.addCustomer = function (item) {
    //    var title = item.LENDER_TYPE == 'L' ? $translate.instant('FORM.LENDER_NAME') : $translate.instant('FORM.LENDER_CONTACT');
    //    $modal.open({
    //        templateUrl: 'app/views/test/subform0101.html',
    //        controller: 'subform0101Controller',
    //        backdrop: 'static',
    //        keyboard: false,
    //        size: 'lg',
    //        resolve: {
    //            params: function () {
    //                return {
    //                    title: title,
    //                    formData: item
    //                };
    //            }
    //        }
    //    }).result.then(function (data) {
    //        var existing;
    //        if (data.LENDER_TYPE == 'L') {
    //            $.each($scope.$parent.formData.CUSTOMERS, function (idx, item) {
    //                if (item.LENDER_RUNNING_ID == data.LENDER_RUNNING_ID) {
    //                    existing = item;
    //                }
    //            });
    //        } else if (data.LENDER_TYPE == 'C') {
    //            $.each($scope.$parent.formData.CONTACTS, function (idx, item) {
    //                if (item.LENDER_RUNNING_ID == data.LENDER_RUNNING_ID) {
    //                    existing = item;
    //                }
    //            });
    //        }
    //        if (existing) {
    //            existing.LENDER_NAME = data.LENDER_NAME;
    //            existing.LENDER_PHONE = data.LENDER_PHONE;
    //            existing.REGISTER_ID = data.REGISTER_ID;
    //        } else {
    //            if (data.LENDER_TYPE == 'L') {
    //                $scope.$parent.formData.CUSTOMERS.push({
    //                    LENDER_RUNNING_ID: data.LENDER_RUNNING_ID,
    //                    LENDER_NAME: data.LENDER_NAME,
    //                    LENDER_PHONE: data.LENDER_PHONE,
    //                    REGISTER_ID: data.REGISTER_ID,
    //                    LENDER_TYPE: data.LENDER_TYPE
    //                });
    //            } else if (data.LENDER_TYPE == 'C') {
    //                $scope.$parent.formData.CONTACTS.push({
    //                    LENDER_RUNNING_ID: data.LENDER_RUNNING_ID,
    //                    LENDER_NAME: data.LENDER_NAME,
    //                    LENDER_PHONE: data.LENDER_PHONE,
    //                    REGISTER_ID: data.REGISTER_ID,
    //                    LENDER_TYPE: data.LENDER_TYPE
    //                });
    //            }
    //        }
    //    });
    //}

    $scope.init();

    //$scope.loadFormData();
}]);

app.controller('subform0101Controller', ['$scope', '$state', 'radasoft', '$modalInstance', '$timeout', 'params', function ($scope, $state, radasoft, $modalInstance, $timeout, params) {

    $scope.title = params.title;
    $scope.includeUrl = 'app/views/test/subform0101.html';
    $scope.formData = angular.copy(params.formData);
    $scope.showBtnOK = true;

    //$scope.getLender = function () {
    //    radasoft.getLender({ LENDER_RUNNING_ID: params.LENDER_RUNNING_ID }).then(function (response) {
    //        $scope.formData = response.data;
    //    });
    //}

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
            $modalInstance.close($scope.formData);
        }
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.init = function () {
        //$scope.getLender();
    }

    $scope.init();
}]);