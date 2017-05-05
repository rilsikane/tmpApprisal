app.controller('completedProjectController', ['$scope', '$state', '$stateParams', 'radasoft', '$modal', '$translate', 'params', '$modalInstance', function ($scope, $state, $stateParams, radasoft, $modal, $translate, params, $modalInstance) {
    $scope.projects = [];
    $scope.selectedProject = {};
    $scope.projectSearchKeyword = '';
    $scope.unitSearchKeyword = '';

    $scope.includeUrl = params.includeUrl;
    $scope.formData = params.formData;

    $scope.getCompletedProject = function () {
        radasoft.getCompletedProject({ FILTER: $scope.projectSearchKeyword }).then(function (response) {
            $scope.projects = response.data;
        });
    }

    $scope.getCompletedProjectUnit = function () {
        radasoft.getCompletedProjectUnit({
            PROJECT_RUNNING_ID: $scope.selectedProject.PROJECT_RUNNING_ID,
            FILTER: $scope.unitSearchKeyword
        }).then(function (response) {
            $scope.units = response.data;
        });
    }

    $scope.searchProject = function ($event) {
        if ($event != undefined && $event.keyCode == 13) {
            $scope.getCompletedProject();
        } else if ($event == undefined) {
            $scope.getCompletedProject();
        }
    }

    $scope.selectProject = function (project) {
        $scope.selectedProject = project;

        $scope.getCompletedProjectUnit();
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.selectProjectUnit = function (item) {
        //console.log(item);
        radasoft.confirmAndSave($translate.instant('CONFIRM.SAVE'), '', function (isconfirmed) {
            if (isconfirmed) {

                item.JOB_RUNNING_ID = $scope.formData.JOB_RUNNING_ID;

                radasoft.createColleteralFromProject(item).then(function (response) {
                    $modalInstance.close({});
                });
            }
        });
    }

    $scope.init = function () {
        $scope.getCompletedProject();
    }

    $scope.init();

}]);

//app.controller('provinceController', ['$scope', '$state', 'toaster', '$modal', '$translate', 'SweetAlert', '$modalInstance', 'radasoft', 'params', function ($scope, $state, toaster, $modal, $translate, SweetAlert, $modalInstance, radasoft, params) {
//    $scope.ldloading1 = {};
//    $scope.ldloading2 = {};

//    $scope.btnDisabled = false;
//    $scope.btnSubmitDisabled = false;

//    $scope.formData = params.formData;

//    $scope.title1 = $translate.instant('DEVELOPER');
//    $scope.title2 = $scope.formData.DEV_NAME;

//    $scope.save = function (form) {
//        if (form.$invalid) {
//            var field = null, firstError = null;
//            for (field in form) {
//                if (field[0] != '$') {
//                    if (firstError === null && !form[field].$valid) {
//                        firstError = form[field].$name;
//                    }

//                    if (form[field].$pristine) {
//                        form[field].$dirty = true;
//                    }
//                }
//            }
//        } else {
//            radasoft.confirmAndSave($translate.instant('CONFIRM.SAVE'), '', function (isconfirmed) {
//                if (isconfirmed) {
//                    radasoft.setDeveloper($scope.formData).then(function (response) {
//                        $modalInstance.close(response.data);
//                    });
//                }
//            });
//        }
//    };

//    $scope.delete = function (style) {
//        radasoft.confirmAndSave($translate.instant('CONFIRM.DELETE'), '', function (isconfirmed) {
//            if (isconfirmed) {
//                radasoft.deleteDeveloper($scope.formData).then(function (response) {
//                    $modalInstance.close(response.data);
//                });
//            }
//        });
//    }

//    $scope.cancel = function () {
//        $modalInstance.dismiss('cancel');
//    };

//    $scope.init = function () {

//    }

//    $scope.init();
//}]);