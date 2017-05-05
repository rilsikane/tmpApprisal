app.controller('qnrController', ['$scope', '$state', '$stateParams', 'radasoft', '$modal', '$translate', function ($scope, $state, $stateParams, radasoft, $modal, $translate) {

    $scope.qnrPackage = [];
    $scope.qnrMaster = [];
    $scope.questionnaire = [];
    $scope.formData = { QNR_PACKAGE: null };

    $scope.$on('setQuestionnaire', function (e) {
        $scope.submit();
    });

    $scope.getQnrPackage = function () {
        radasoft.getQnrPackage({}).then(function (response) {
            $scope.qnrPackage = response.data;
        });
    }

    radasoft.debug($scope.QNR_ID);
    radasoft.debug($scope.RESULT_ID);

    //$scope.getQnrMaster = function () {
    //    radasoft.getQnrMaster({
    //        QNR_ID: $scope.formData.QNR_PACKAGE.QNR_ID,
    //        RESULT_ID: $scope.formData.QNR_PACKAGE.RESULT_ID || 0
    //    }).then(function (response) {
    //        $scope.qnrMaster = response.data;
    //    });
    //}

    $scope.getQuestionnaire = function () {
        radasoft.getQuestionnaire({
            QNR_ID: $scope.formData.QNR_PACKAGE.QNR_ID || 0,
            RESULT_ID: 0
        }).then(function (response) {
            $scope.questionnaire = response.data;

            $scope.qnrResult = [];

            $scope.getQnrResult();
        });
    }
    $scope.getQuestionnaireResult = function () {
        radasoft.getQuestionnaire({
            QNR_ID: $scope.formData.QNR_PACKAGE.QNR_ID || 0,
            RESULT_ID: $scope.formData.RESULT.RESULT_ID || 0
        }).then(function (response) {
            $scope.questionnaire = response.data;
        });
    }
    $scope.getQnrResult = function () {
        radasoft.getQnrResult({ QNR_ID: $scope.formData.QNR_PACKAGE.QNR_ID }).then(function (response) {
            $scope.qnrResult = response.data;
        });
    }

    $scope.init = function () {
        if ($scope.QNR_ID != undefined && $scope.RESULT_ID != undefined) {
            $scope.formData.QNR_PACKAGE = { QNR_ID: $scope.QNR_ID };
            $scope.formData.RESULT = { RESULT_ID: $scope.RESULT_ID };

            $scope.getQuestionnaireResult();
        } else {
            $scope.getQnrPackage();
        }
    }

    $scope.submit = function () {
        radasoft.debug($scope.questionnaire);
        radasoft.confirmAndSave($translate.instant('CONFIRM.SAVE'), '', function (isconfirmed) {
            if (isconfirmed) {
                radasoft.setQuestionnaire($scope.questionnaire).then(function (response) {
                    radasoft.success();
                });
            }
        });
    }

    $scope.init();

}]);
