'use strict';
app.controller('logoutCtrl', ['$scope', '$state', '$stateParams', 'radasoft', '$translate', function ($scope, $state, $stateParams, radasoft, $translate) {
    $scope.formData = {
        USER_NAME: ''
    };

    $scope.logout = function () {
        if ($scope.formData.USER_NAME == '') {
            radasoft.alert('กรุณาระบุ User Name');
        } else {
            radasoft.confirmAndSave($translate.instant('USER_LOGOUT'), '', function (isconfirmed) {
                if (isconfirmed) {
                    radasoft.userLogout($scope.formData).then(function () {
                        radasoft.success();
                    });
                }
            });
        }
    }
}]);