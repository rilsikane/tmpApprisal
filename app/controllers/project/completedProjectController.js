app.controller('completedProjectDialogCtrl', ['$scope', '$state', '$stateParams', 'radasoft', '$modal', '$translate', 'params', '$modalInstance', '$rootScope', function ($scope, $state, $stateParams, radasoft, $modal, $translate, params, $modalInstance, $rootScope) {

    $scope.formData = params.formData;
    $scope.includeUrl = '/app/views/project/completedproject2.html';


    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.selectProjectUnit = function (item) {
        radasoft.confirmAndSave($translate.instant('CONFIRM.SAVE'), '', function (isconfirmed) {
            if (isconfirmed) {

                item.JOB_RUNNING_ID = $scope.formData.JOB_RUNNING_ID;

                radasoft.createColleteralFromProject(item).then(function (response) {
                    $modalInstance.close({});
                });
            }
        });
    }
}]);


app.controller('completedProjectCtrl', ['$scope', '$state', '$stateParams', 'radasoft', '$modal', '$translate', '$rootScope', function ($scope, $state, $stateParams, radasoft, $modal, $translate, $rootScope) {
    $scope.projects = [];
    $scope.selectedProject = {};
    $scope.projectSearchKeyword = '';
    $scope.unitSearchKeyword = '';
    $scope.paging1CurrentPage = 1;
    $scope.paging2CurrentPage = 1;

    $scope.searchProjectEnter = function ($event) {
        if ($event.keyCode == 13) {
            $scope.getCompletedProject();
        }
    }

    $scope.searchUnitTypeEnter = function ($event) {
        if ($event.keyCode == 13) {
            $scope.getCompletedProjectUnit();
        }
    }

    $scope.getCompletedProject = function () {
        radasoft.getCompletedProject({
            limit: $rootScope.app.itemsPerPage,
            page: $scope.paging1CurrentPage,
            filters: [
                { NAME: 'FILTER', VALUE: $scope.projectSearchKeyword }
            ]
        }).then(function (response) {
            $scope.projects = response.data.data;
            $scope.paging1Total = response.data.total;
        });
    }

    $scope.getCompletedProjectUnit = function () {
        radasoft.getCompletedProjectUnit({
            limit: $rootScope.app.itemsPerPage,
            page: $scope.paging2CurrentPage,
            filters: [
                { NAME: 'PROJECT_RUNNING_ID', VALUE: $scope.selectedProject.PROJECT_RUNNING_ID || 0 },
                { NAME: 'FILTER', VALUE: $scope.unitSearchKeyword }
            ]
        }).then(function (response) {
            $scope.units = response.data.data;
            $scope.paging2Total = response.data.total;
        });
    }

    $scope.selectProject = function (project) {
        $scope.selectedProject = project;

        $scope.getCompletedProjectUnit();
    }

    $scope.init = function () {
        $scope.getCompletedProject();
    }

    $scope.init();

}]);