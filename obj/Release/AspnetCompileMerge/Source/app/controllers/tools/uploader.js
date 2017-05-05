'use strict';
app.controller('uploaderController', ['$scope', '$state', '$stateParams', 'radasoft', '$modal', '$translate', 'FileUploader', 'params', '$modalInstance', function ($scope, $state, $stateParams, radasoft, $modal, $translate, FileUploader, params, $modalInstance) {
    $scope.errorMessage = '';
    $scope.hasError = false;
    $scope.uploadedFile = [];
    $scope.limit = params.limit || 0;
    $scope.queue = 0;

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

    // CALLBACKS

    //uploader.onWhenAddingFileFailed = function (item/*{File|FileLikeObject}*/, filter, options) {
    //    console.info('onWhenAddingFileFailed', item, filter, options);
    //};
    uploader.onAfterAddingFile = function (fileItem) {

    };
    //uploader.onAfterAddingAll = function (addedFileItems) {
    //    console.info('onAfterAddingAll', addedFileItems);
    //};
    uploader.onBeforeUploadItem = function (item) {
        $scope.hasError = false;
    };
    //uploader.onProgressItem = function (fileItem, progress) {
    //    console.info('onProgressItem', fileItem, progress);
    //};
    //uploader.onProgressAll = function (progress) {
    //    console.info('onProgressAll', progress);
    //};
    uploader.onSuccessItem = function (fileItem, response, status, headers) {
        $scope.uploadedFile.push(response);
    };
    uploader.onErrorItem = function (fileItem, response, status, headers) {
        //console.info('onErrorItem', fileItem, response, status, headers);
        //console.log(status);
        //console.log(response);
        //if (status == 500 || status == 404) {
        //    var title = $(response)[1].innerText;
        //    $scope.errorMessage = title;
        //} else {
        //    $scope.errorMessage = response;
        //}
        var title = $(response)[1].innerText;
        $scope.errorMessage = title;
        $scope.hasError = true;
    };
    //uploader.onCancelItem = function (fileItem, response, status, headers) {
    //    console.info('onCancelItem', fileItem, response, status, headers);
    //};
    //uploader.onCompleteItem = function (fileItem, response, status, headers) {
    //    console.log(response);
    //};
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