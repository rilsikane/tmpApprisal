app.controller('diagCrystalReport', ['$scope', '$state', 'toaster', '$modal', '$translate', 'SweetAlert', 'radasoft', function ($scope, $state, toaster, $modal, $translate, SweetAlert, radasoft) {
    $scope.formData = {
        calendarUrl: 'http://carlenarurl',
        jobReportUrl: 'http://jobReportUrl',
        adfsLoginUrl: 'http://adfsLoginUrl'
    };

    $scope.requestMethod = ['GET', 'POST'];

    $scope.rptfiles = [];

    $scope.getRptFiles = function () {
        radasoft.getRptFiles().then(function (response) {
            $scope.rptfiles = response.data;
        });
    }

    $scope.diag = function (file) {
        radasoft.confirmAndSave('TEST CRYSTAL REPORT', '', function (isconfirmed) {
            if (isconfirmed) {
                radasoft.testCrystalReport({ file: file }).then(function (response) {
                    radasoft.success();

                    radasoft.tempDownload(response.data.file);
                });
            }
        });
    }

    $scope.goCalendar = function () {
        $scope.httpRequest($scope.formData.calendarUrl);
    }

    $scope.goJobReport = function () {
        $scope.httpRequest($scope.formData.jobReportUrl);
    }

    $scope.goHeadColReport = function () {
        $scope.httpRequest($scope.formData.jobReportUrl);
    }

    $scope.goAdFsLogin = function () {
        $scope.httpRequest($scope.formData.adfsLoginUrl);
    }

    $scope.httpRequest = function (url) {
        radasoft.confirmAndSave('CONFIRM REQUEST', '', function (isconfirmed) {
            if (isconfirmed) {
                radasoft.httpRequest({ url: url }).then(function (response) {
                    radasoft.success();
                });
            }
        });

    }

    $scope.init = function () {
        $scope.getRptFiles();
    }

    $scope.init();
}]);