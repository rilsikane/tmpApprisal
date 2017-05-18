app.controller('qnrController', ['$scope', '$state', '$stateParams', 'radasoft', '$modal', '$translate', '$filter', function ($scope, $state, $stateParams, radasoft, $modal, $translate, $filter) {

    $scope.qnrPackage = [];
    $scope.qnrMaster = [];
    $scope.questionnaire = [];
    $scope.formData = { QNR_PACKAGE: null };
    $scope.grade = undefined;

    $scope.$on('setQuestionnaire', function (e) {
        $scope.submit();
    });

    $scope.calScore = function (item) {
        var list = $filter('filter')($scope.questionnaire.QNR_ITEM, 'Q', true, 'TYPE');

        var totalQ = 0;
        var totalScore = 0;
        var totalWeight = 0;
        var score = 0;

        angular.forEach(list, function (q) {
            if (q.TYPE == 'Q' && q.CHILD.length > 0 && q.FLAG != 'H') {
                var parent = $filter('filter')($scope.questionnaire.QNR_ITEM, q.PID, true, 'QNR_ID')[0];

                var weight = q.WEIGHT || (parent == undefined ? 0 : parent.WEIGHT);

                totalQ++;
                totalWeight += weight;

                var answer = $filter('filter')(q.CHILD, function (value, index, array) { return q.CHOICE_QNR_ID == value.QNR_ID; })[0];

                if (answer != undefined) {
                    totalScore += (answer.SCORE1 * weight);
                }
            }
        });

        score = (totalScore);

        var grading = $filter('filter')($scope.questionnaire.QNR_ITEM, 'G', true, 'TYPE')[0];

        if (grading != undefined) {
            var grade = $filter('filter')(grading.CHILD, function (value, index, array) {
                return score >= value.SCORE1 && score <= value.SCORE2;
            })[0];

            $scope.questionnaire.SCORE = Math.round(score);

            if (grade != undefined) {
                $scope.questionnaire.GRADE = grade.ITEM;
            }
        }
    }

    $scope.getQnrPackage = function () {
        radasoft.getQnrPackage({}).then(function (response) {
            $scope.qnrPackage = response.data;
        });
    }

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
