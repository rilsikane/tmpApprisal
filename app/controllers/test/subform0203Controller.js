app.controller('subform0204Controller', ['$scope', '$state', '$stateParams', 'radasoft', '$modal', '$translate', 'FileUploader', 'params', '$modalInstance', '$filter', '$q', function ($scope, $state, $stateParams, radasoft, $modal, $translate, FileUploader, params, $modalInstance, $filter, $q) {
    $scope.title = $stateParams.STATE_NAME;
    $scope.ldloading = {};
    $scope.btnDisabled = false;
    $scope.headCol = params.headCol;
    $scope.colAct = params.colAct;
    $scope.templates = [];
    $scope.includeUrl = params.includeUrl || '';
    $scope.showButtonSave = params.showButtonSave || false;
    $scope.photoPages = [];
    $scope.photoTakenPoints = [];

    $scope.getHeadColPhoto = function () {
        radasoft.getHeadColPhoto({ HEAD_COL_RUNNING_ID: $scope.headCol.HEAD_COL_RUNNING_ID }).then(function (response) {
            $scope.photoPages = response.data;

            $scope.initTemplate();
        });
    }

    $scope.getPhotoTakenPoint = function () {
        var deffered = $q.defer();

        radasoft.getPhotoTakenPoint({}).then(function (response) {
            $scope.photoTakenPoints = response.data;

            deffered.resolve();
        });

        return deffered.promise;
    }

    $scope.addNewPage = function (style) {
        $scope.ldloading[style.replace('-', '_')] = true;
        radasoft.setColPhoto([{
            HEAD_COL_RUNNING_ID: $scope.headCol.HEAD_COL_RUNNING_ID,
            TEMPLATE_TYPE: 'T1',
            PAGE_LIST: $scope.photoPages.length + 1
        }]).then(function (response) {
            $scope.photoPages.push(response.data[0]);
        }).finally(function () {
            $scope.ldloading[style.replace('-', '_')] = false;
        });
    }

    $scope.editPhoto = function ($index, photo) {
        radasoft.openDialog({
            controller: 'headColPhotoEditorController',
            resolve: {
                params: function () {
                    return {
                        formData: photo,
                        photoTakenPoints: $scope.photoTakenPoints
                    };
                }
            }
        }).result.then(function (data) {
            angular.copy(data, photo);
        });
    }

    $scope.deleteColPhotoPage = function ($index, page) {
        radasoft.confirmAndSave($translate.instant('CONFIRM.DELETE'), '', function (isconfirmed) {
            if (isconfirmed) {
                radasoft.deleteColPhotoPage([page]).then(function (response) {
                    radasoft.success();
                    $scope.init();
                });
            }
        });
    }

    $scope.openUploadDialog = function ($index, limit) {
        return $modal.open({
            backdrop: 'static',
            keyboard: false,
            templateUrl: 'app/views/tools/uploader.html',
            controller: 'uploaderController',
            size: 'lg',
            resolve: {
                params: function () {
                    return {
                        limit: limit
                    };
                }
            }
        });
    }

    $scope.addPhoto = function ($index, page) {
        var limit = page.PHOTO_LIMIT - page.PHOTO.length;
        $scope.openUploadDialog($index, limit).result.then(function (data) {
            angular.forEach(data, function (item) {
                page.PHOTO.push({
                    BASE64: item.base64string,
                    ATTACHDOC_RUNNING_ID: item.ATTACHDOC_RUNNING_ID
                });
            });

            $scope.updateLayout(page, $scope.getTemplate(page));
        });
    }

    $scope.changePhoto = function ($index, photo) {
        $scope.openUploadDialog($index, 1).result.then(function (data) {
            if (data.length > 0) {
                photo.BASE64 = data[0].base64string;
                photo.ATTACHDOC_RUNNING_ID = data[0].ATTACHDOC_RUNNING_ID;
            }
        });
    }
    $scope.deletePhoto = function ($index, photos) {
        photos.splice($index, 1);
    }
    $scope.layout = function (template, page) {

        $scope.updateLayout(page, template);
    }

    $scope.updateLayout = function (page, template) {

        page.TEMPLATE_TYPE = template.layout;
        page.PHOTO_LIMIT = template.limit;

        angular.forEach(page.PHOTO, function (photo, $index) {
            if ($index < template.limit) {
                photo.CSS_COL_STYLE = template.imageSlot[$index].CSS_COL_STYLE;
                photo.CSS_IMG_STYLE = template.imageSlot[$index].CSS_IMG_STYLE;
            }
        });
    }

    $scope.submit = function () {
        radasoft.confirmAndSave($translate.instant('CONFIRM.SAVE'), '', function (isconfirmed) {
            if (isconfirmed) {
                angular.forEach($scope.photoPages, function (page) {
                    angular.forEach(page.PHOTO, function (item, $index) {
                        if ($index > page.PHOTO_LIMIT - 1)
                            page.PHOTO.splice($index, 1);
                    });
                });
                radasoft.setColPhoto($scope.photoPages).then(function (response) {
                    radasoft.success();
                });
            }
        });
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.initTemplate = function () {

        var landscape = { width: '300px', height: '200px' };
        var portrait = { width: '200px', height: '300px' };
        var landscape_portrait = { width: '450px', height: '300px' };
        var landscape_portrait4 = { width: '300px', height: '200px' };
        var panorama = { width: '100%', height: '150px' };
        var full = { width: '600px', height: '900px' };
        var square = { width: '300px', height: '300px' };
        var col_1 = 'col-md-12';
        var col_2 = 'col-md-6';
        var col_3 = 'col-md-4';

        $scope.templates = [
            {
                id: 1,
                layout: 'T1',
                css: 'imgLayout1',
                limit: 1,
                imageSlot: [
                    { CSS_IMG_STYLE: full, CSS_COL_STYLE: col_1 }
                ]
            },
            {
                id: 2,
                layout: 'T2',
                css: 'imgLayout2',
                limit: 1,
                imageSlot: [
                    { CSS_IMG_STYLE: panorama, CSS_COL_STYLE: col_1 }
                ]
            },
            {
                id: 3,
                layout: 'T3',
                css: 'imgLayout3',
                limit: 2,
                imageSlot: [
                    { CSS_IMG_STYLE: portrait, CSS_COL_STYLE: col_1 },
                    { CSS_IMG_STYLE: portrait, CSS_COL_STYLE: col_1 }
                ]
            },
            {
                id: 4,
                layout: 'T4',
                css: 'imgLayout4',
                limit: 2,
                imageSlot: [
                    { CSS_IMG_STYLE: portrait, CSS_COL_STYLE: col_1 },
                    { CSS_IMG_STYLE: landscape, CSS_COL_STYLE: col_1 }
                ]
            },
            {
                id: 5,
                layout: 'T5',
                css: 'imgLayout5',
                limit: 2,
                imageSlot: [
                    { CSS_IMG_STYLE: landscape, CSS_COL_STYLE: col_1 },
                    { CSS_IMG_STYLE: portrait, CSS_COL_STYLE: col_1 }
                ]
            },
            {
                id: 6,
                layout: 'T6',
                css: 'imgLayout6',
                limit: 2,
                imageSlot: [
                    { CSS_IMG_STYLE: panorama, CSS_COL_STYLE: col_1 },
                    { CSS_IMG_STYLE: panorama, CSS_COL_STYLE: col_1 }
                ]
            },
            {
                id: 7,
                layout: 'T7',
                css: 'imgLayout7',
                limit: 3,
                imageSlot: [
                    { CSS_IMG_STYLE: portrait, CSS_COL_STYLE: col_2 },
                    { CSS_IMG_STYLE: portrait, CSS_COL_STYLE: col_2 },
                    { CSS_IMG_STYLE: landscape, CSS_COL_STYLE: col_1 }
                ]
            },
            {
                id: 8,
                layout: 'T8',
                css: 'imgLayout8',
                limit: 3,
                imageSlot: [
                    { CSS_IMG_STYLE: landscape, CSS_COL_STYLE: col_1 },
                    { CSS_IMG_STYLE: portrait, CSS_COL_STYLE: col_2 },
                    { CSS_IMG_STYLE: portrait, CSS_COL_STYLE: col_2 }
                ]
            },
            {
                id: 9,
                layout: 'T9',
                css: 'imgLayout9',
                limit: 3,
                imageSlot: [
                    { CSS_IMG_STYLE: panorama, CSS_COL_STYLE: col_1 },
                    { CSS_IMG_STYLE: panorama, CSS_COL_STYLE: col_1 },
                    { CSS_IMG_STYLE: panorama, CSS_COL_STYLE: col_1 }
                ]
            },
            {
                id: 10,
                layout: 'T10',
                css: 'imgLayout10',
                limit: 4,
                imageSlot: [
                    { CSS_IMG_STYLE: square, CSS_COL_STYLE: col_2 },
                    { CSS_IMG_STYLE: square, CSS_COL_STYLE: col_2 },
                    { CSS_IMG_STYLE: square, CSS_COL_STYLE: col_2 },
                    { CSS_IMG_STYLE: square, CSS_COL_STYLE: col_2 }
                ]
            },
            {
                id: 11,
                layout: 'T11',
                css: 'imgLayout11',
                limit: 4,
                imageSlot: [
                    { CSS_IMG_STYLE: portrait, CSS_COL_STYLE: col_2 },
                    { CSS_IMG_STYLE: portrait, CSS_COL_STYLE: col_2 },
                    { CSS_IMG_STYLE: portrait, CSS_COL_STYLE: col_2 },
                    { CSS_IMG_STYLE: portrait, CSS_COL_STYLE: col_2 }
                ]
            },
            {
                id: 12,
                layout: 'T12',
                css: 'imgLayout12',
                limit: 4,
                imageSlot: [
                    { CSS_IMG_STYLE: portrait, CSS_COL_STYLE: col_2 },
                    { CSS_IMG_STYLE: portrait, CSS_COL_STYLE: col_2 },
                    { CSS_IMG_STYLE: landscape, CSS_COL_STYLE: col_2 },
                    { CSS_IMG_STYLE: landscape, CSS_COL_STYLE: col_2 }
                ]
            },
            {
                id: 13,
                layout: 'T13',
                css: 'imgLayout13',
                limit: 4,
                imageSlot: [
                    { CSS_IMG_STYLE: landscape, CSS_COL_STYLE: col_2 },
                    { CSS_IMG_STYLE: landscape, CSS_COL_STYLE: col_2 },
                    { CSS_IMG_STYLE: portrait, CSS_COL_STYLE: col_2 },
                    { CSS_IMG_STYLE: portrait, CSS_COL_STYLE: col_2 }
                ]
            },
            {
                id: 14,
                layout: 'T14',
                css: 'imgLayout14',
                limit: 4,
                imageSlot: [
                    { CSS_IMG_STYLE: panorama, CSS_COL_STYLE: col_1 },
                    { CSS_IMG_STYLE: panorama, CSS_COL_STYLE: col_1 },
                    { CSS_IMG_STYLE: panorama, CSS_COL_STYLE: col_1 },
                    { CSS_IMG_STYLE: panorama, CSS_COL_STYLE: col_1 }
                ]
            },
            {
                id: 15,
                layout: 'T15',
                css: 'imgLayout15',
                limit: 6,
                imageSlot: [
                    { CSS_IMG_STYLE: portrait, CSS_COL_STYLE: col_3 },
                    { CSS_IMG_STYLE: portrait, CSS_COL_STYLE: col_3 },
                    { CSS_IMG_STYLE: portrait, CSS_COL_STYLE: col_3 },
                    { CSS_IMG_STYLE: portrait, CSS_COL_STYLE: col_3 },
                    { CSS_IMG_STYLE: portrait, CSS_COL_STYLE: col_3 },
                    { CSS_IMG_STYLE: portrait, CSS_COL_STYLE: col_3 }
                ]
            },
            {
                id: 16,
                layout: 'T16',
                css: 'imgLayout16',
                limit: 6,
                imageSlot: [
                    { CSS_IMG_STYLE: landscape, CSS_COL_STYLE: col_2 },
                    { CSS_IMG_STYLE: landscape, CSS_COL_STYLE: col_2 },
                    { CSS_IMG_STYLE: landscape, CSS_COL_STYLE: col_2 },
                    { CSS_IMG_STYLE: landscape, CSS_COL_STYLE: col_2 },
                    { CSS_IMG_STYLE: landscape, CSS_COL_STYLE: col_2 },
                    { CSS_IMG_STYLE: landscape, CSS_COL_STYLE: col_2 }
                ]
            }
        ];

        angular.forEach($scope.photoPages, function (page) {
            $scope.updateLayout(page, $scope.getTemplate(page));
        });
    }

    $scope.getTemplate = function (page) {
        var template = $filter('filter')($scope.templates, page.TEMPLATE_TYPE, true, 'layout')[0];

        return template;
    }

    $scope.init = function () {
        $scope.getPhotoTakenPoint().then(function () {
            $scope.getHeadColPhoto();
        });
    }

    $scope.init();
}]);

app.controller('headColPhotoEditorController', ['$scope', '$modalInstance', '$translate', 'params', function ($scope, $modalInstance, $translate, params) {
    $scope.title = $translate.instant('HEAD_COL_PHOTO');
    $scope.showBtnOK = true;
    $scope.includeUrl = 'app/views/test/headColPhotoEditor.html';
    $scope.photoTakenPoints = params.photoTakenPoints;

    $scope.formData = angular.copy(params.formData);

    $scope.save = function (form) {
        if (form.$invalid) {
            var field = null, firstError = null;
            for (field in form) {
                radasoft.debug(field);
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
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);