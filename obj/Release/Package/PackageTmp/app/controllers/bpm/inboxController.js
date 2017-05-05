app.controller('inboxController', ['$rootScope', '$scope', '$state', '$stateParams', 'radasoft', '$q', '$translate', function ($rootScope, $scope, $state, $stateParams, radasoft, $q, $translate) {
    $scope.data = [];
    $scope.totalItems = 0;
    $scope.currentPage = 1;
    $scope.requestType = [];

    $scope.getRequestType = function () {
        var deffered = $q.defer();
        radasoft.getRequestType({}).then(function (response) {
            $scope.requestType = response.data;
            deffered.resolve();
        });
        return deffered.promise;
    }

    $scope.pageChanged = function () {
        radasoft.getMyInbox({
            limit: $rootScope.app.itemsPerPage,
            page: $scope.currentPage
        }).then(function (response) {
            $scope.data = response.data.data;
            $scope.totalItems = response.data.total;
        });
    };

    $scope.new = function (requestType) {
        if (requestType.VALUE == '1') {
            $state.go('app.testform', { ACT_HIST_ID: 0, H: 0 });
        } else if (requestType.VALUE == '2') {
            $scope.openFindReviewJobDialog();
        } else {
            radasoft.alert($translate.instant('INVALID_REQUEST_TYPE'));
        }
    }

    $scope.openFindReviewJobDialog = function () {
        radasoft.openDialog({
            controller: 'findReviewJobCtrl',
            resolve: {
                params: function () {
                    return {
                    };
                }
            }
        }).result.then(function (data) {
            radasoft.success();
            $state.go('app.testform', { ACT_HIST_ID: data.ACT_HIST_ID, H: 0 });
        });
    }

    $scope.init = function () {
        $scope.getRequestType().then(function () {
            $scope.pageChanged();
        });
    }

    $scope.init();
}]);

app.controller('findReviewJobCtrl', ['$scope', '$modalInstance', 'radasoft', '$translate', function ($scope, $modalInstance, radasoft, $translate) {
    $scope.includeUrl = 'app/views/test/findReviewJob.html';
    $scope.title = $translate.instant('REVIEW_JOB');
    $scope.formData = { REQUEST_NO: undefined };
    $scope.foundFormData = undefined;
    $scope.showBtnOK = true;
    $scope.inputDisabled = true;
    $scope.searchHit = false;
    $scope.ldloading = {};

    $scope.msg = '';

    $scope.find = function ($event) {
        if ($event.keyCode === 13) {
            $scope.findRequest();
        }
    }

    $scope.findRequest = function () {
        var style = 'expand-left';
        $scope.ldloading[style.replace('-', '_')] = true;
        radasoft.getRequestFormByNo({ REQUEST_NO: $scope.formData.REQUEST_NO }).then(function (response) {
            $scope.searchHit = true;
            $scope.foundFormData = response.data;
        }).finally(function () {
            $scope.ldloading[style.replace('-', '_')] = false;
        });
    }

    $scope.save = function (form) {
        radasoft.confirmAndSave($translate.instant('CONFIRM.CREATE_REVIEW_JOB'), '', function (isconfirmed) {
            if (isconfirmed) {
                radasoft.createReviewJob({ REQUEST_RUNNING_ID: $scope.foundFormData.REQUEST_RUNNING_ID }).then(function (response) {
                    $modalInstance.close(response.data);
                });
            }
        });
    }

    $scope.cancel = function () {
        $modalInstance.dismiss();
    }
}]);