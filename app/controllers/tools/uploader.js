'use strict';
app.controller('uploaderController', ['$scope', '$state', '$stateParams', 'radasoft', '$modal', '$translate', 'FileUploader', 'params', '$modalInstance', '$rootScope', function ($scope, $state, $stateParams, radasoft, $modal, $translate, FileUploader, params, $modalInstance, $rootScope) {
    $scope.errorMessage = '';
    $scope.hasError = false;
    $scope.uploadedFile = [];
    $scope.limit = params.limit || 0;
    $scope.config = params.config || '';
    $scope.id1 = params.id1 || '';
    $scope.queue = 0;
    $scope.imageFilter = params.imageFilter || false;
    $scope.imageFilterError = false;
    $scope.pdfImageFilter = params.pdfImageFilter || false;
    $scope.pdfImageFilterError = false;
    $scope.sizeFilterError = false;
    $scope.addingFailedMsg = [];

    var uploader = $scope.uploader = new FileUploader({
        url: 'Home/Upload'
    });

    // FILTERS

    uploader.filters.push({
        name: 'customFilter',
        fn: function (item/*{File|FileLikeObject}*/, options) {
            return this.queue.length < 10;
        }
    });

    if ($scope.imageFilter) {
        uploader.filters.push({
            name: 'imageFilter',
            fn: function (item/*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|jpeg|'.indexOf(type) !== -1;
            }
        });
    }

    if ($scope.pdfImageFilter) {
        uploader.filters.push({
            name: 'pdfImageFilter',
            fn: function (item/*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|jpeg|pdf|'.indexOf(type) !== -1;
            }
        });
    }

    uploader.filters.push({
        name: 'sizeFilter',
        fn: function (item/*{File|FileLikeObject}*/, options) {
            return (item.size / 1024 / 1024) <= 5;
        }
    });

    // CALLBACKS

    uploader.onWhenAddingFileFailed = function (item/*{File|FileLikeObject}*/, filter, options) {

        if (filter.name == 'imageFilter') {
            if ($scope.imageFilterError == false) {
                $scope.imageFilterError = true;
                $scope.addingFailedMsg.push($translate.instant('UPLOAD_JPG'));
            }
        }

        if (filter.name == 'pdfImageFilter') {
            if ($scope.pdfImageFilterError == false) {
                $scope.pdfImageFilterError = true;
                $scope.addingFailedMsg.push($translate.instant('UPLOAD_JPG_PDF'));
            }
        }

        if (filter.name == 'sizeFilter') {
            if ($scope.sizeFilterError == false) {
                $scope.sizeFilterError = true;
                $scope.addingFailedMsg.push($translate.instant('MAX_UPLOAD_FILE_SIZE'));
            }
        }

        if ($scope.addingFailedMsg.length > 0) {
            radasoft.alert($scope.addingFailedMsg.join('<br />'));
        }
    };
    uploader.onAfterAddingFile = function (fileItem) {
        fileItem.formData.push({ "CONFIG": $scope.config });
        fileItem.formData.push({ "ID1": $scope.id1 });
    };
    uploader.onAfterAddingAll = function (addedFileItems) {
        //if ($scope.sizeFilterError) {
        //    $scope.addingFailedMsg.push($translate.instant('MAX_UPLOAD_FILE_SIZE'));
        //}

        //if ($scope.imageFilterError) {
        //    $scope.addingFailedMsg.push($translate.instant('UPLOAD_JPG'));
        //}

        //if ($scope.pdfImageFilterError) {
        //    $scope.addingFailedMsg.push($translate.instant('UPLOAD_JPG_PDF'));
        //}

        //if ($scope.addingFailedMsg.length > 0) {
        //    radasoft.alert($scope.addingFailedMsg.join('<br />'));
        //}
    };
    uploader.onBeforeUploadItem = function (item) {
        $scope.hasError = false;
    };

    uploader.onSuccessItem = function (fileItem, response, status, headers) {
        $scope.uploadedFile.push(response);
    };
    uploader.onErrorItem = function (fileItem, response, status, headers) {
        var title = $(response)[1].innerText;
        $scope.errorMessage = title;
        $scope.hasError = true;
    };

    uploader.onCompleteAll = function () {
        if ($scope.hasError) {
            //radasoft.error($translate.instant('ERROR'));
        } else {
            $scope.close();
        }
    };

    $scope.close = function () {
        $modalInstance.close($scope.uploadedFile);
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);