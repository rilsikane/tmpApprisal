app.controller('devProDialogCtrl', ['$scope', '$state', '$stateParams', 'radasoft', '$modal', '$translate', '$modalInstance', 'params', '$rootScope', function ($scope, $state, $stateParams, radasoft, $modal, $translate, $modalInstance, params, $rootScope) {
    $scope.title = params.title;
    $scope.params = params;

    $scope.showProject = $scope.params.showProject;
    $scope.showPhaseZone = $scope.params.showPhaseZone;

    $scope.developers = [];
    $scope.projects = [];
    $scope.projectUnit = [];
    $scope.projectPhase = [];
    $scope.projectZone = [];
    $scope.projectPrice = [];

    $scope.selectedDev = angular.copy(params.developer);
    $scope.selectedPro = angular.copy(params.project);

    $scope.selectDevPro = function () {
        if ($scope.selectedDev && $scope.selectedPro) {
            $modalInstance.close({
                developer: $scope.selectedDev,
                project: $scope.selectedPro
            });
        } else {
            radasoft.alert('กรุณาเลือกเจ้าของโครงการ และโครงการ');
        }
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

app.controller('devProCtrl', ['$scope', '$state', '$stateParams', 'radasoft', '$modal', '$translate', '$rootScope', function ($scope, $state, $stateParams, radasoft, $modal, $translate, $rootScope) {
    $scope.paging1Total = 0;
    $scope.paging2Total = 0;
    $scope.paging1CurrentPage = 1;
    $scope.paging2CurrentPage = 1;

    $scope.formData = {
        devSearchKeyword: '',
        proSearchKeyword: ''
    };

    $scope.panelStyle = { height: 500 };

    $scope.getDevelopers = function () {

        $scope.projects = [];
        $scope.formData.proSearchKeyword = '';

        radasoft.getDevelopers({
            limit: $rootScope.app.itemsPerPage,
            page: $scope.paging1CurrentPage,
            filters: [
                { NAME: 'FILTER', VALUE: $scope.formData.devSearchKeyword }
            ]
        }).then(function (response) {
            $scope.developers = response.data.data;
            $scope.paging1Total = response.data.total;

            if ($scope.$parent.selectedDev) {
                $scope.getProjects();
            }
        });
    }

    $scope.getProjects = function () {
        if ($scope.$parent.selectedDev && $scope.$parent.selectedDev.DEV_RUNNING_ID != undefined) {
            radasoft.getProjects({
                limit: $rootScope.app.itemsPerPage,
                page: $scope.paging2CurrentPage,
                filters: [
                    { NAME: 'DEV_RUNNING_ID', VALUE: $scope.$parent.selectedDev.DEV_RUNNING_ID },
                    { NAME: 'FILTER', VALUE: $scope.formData.proSearchKeyword }
                ]
            }).then(function (response) {
                $scope.projects = response.data.data;
                $scope.paging2Total = response.data.total;
            });
        }
    }

    $scope.searchDevEnter = function ($event) {
        if ($event.keyCode == 13) {
            $scope.getDevelopers();
        }
    }
    $scope.searchProjectEnter = function ($event) {
        if ($event.keyCode == 13) {
            $scope.getProjects();
        }
    }
    $scope.searchProject = function (developer) {
        $scope.$parent.selectedDev = developer;
        $scope.$parent.projectUnit = [];
        $scope.$parent.projectPhase = [];
        $scope.$parent.projectZone = [];
        $scope.$parent.projectPrice = [];
        $scope.$parent.selectedPro = undefined;
        $scope.getProjects();
    }

    $scope.onProjectSelected = function (project) {
        $scope.$parent.selectedPro = project;
    }

    $scope.openDev = function (data) {
        $modal.open({
            templateUrl: 'app/views/setting/dev.html',
            controller: 'devController',
            backdrop: 'static',
            keyboard: false,
            //windowClass: 'app-modal-window-80',
            size: 'lg',
            resolve: {
                params: function () {
                    return {
                        formData: data
                    };
                }
            }
        }).result.then(function (action) {
            if (action == 'delete') {
                $scope.selectedDev = undefined;
            }
            $scope.init();
            radasoft.success();
        });
    }

    $scope.openPro = function (data) {
        $modal.open({
            templateUrl: 'app/views/setting/pro.html',
            controller: 'proController',
            backdrop: 'static',
            keyboard: false,
            //windowClass: 'app-modal-window-80',
            size: 'lg',
            resolve: {
                params: function () {
                    return {
                        formData: data
                    };
                }
            }
        }).result.then(function (action) {
            if (action == 'delete') {
                $scope.selectedPro = undefined;
            }
            $scope.getProjects();
            radasoft.success();
        });
    }

    $scope.addDev = function () {
        $scope.openDev({
            DEV_RUNNING_ID: 0,
            DEV_CODE: undefined,
            DEV_NAME: undefined
        });
    }

    $scope.editDev = function (dev) {
        $scope.openDev(angular.copy(dev));
    }

    $scope.addPro = function () {
        $scope.openPro({
            PROJECT_RUNNING_ID: 0,
            PROJECT_CODE: '',
            PROJECT_NAME: '',
            DEV_RUNNING_ID: $scope.$parent.selectedDev.DEV_RUNNING_ID,
            ADD_COUNTRY: {
                CODE: 'TH',
                NAME_THAI: 'ไทย'
            }
        });
    }

    $scope.editProject = function (project) {
        $scope.openPro(project);
    }

    $scope.submit = function (form, style) {
        if (form.$invalid) {
            var field = null, firstError = null;
            for (field in form) {
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
            $scope.saveProjectData();
        }
    };

    $scope.init = function () {
        $scope.getDevelopers();
    }

    $scope.init();
}]);

app.controller('phaseZoneDialogCtrl', ['$scope', '$state', '$stateParams', 'radasoft', '$modal', '$translate', '$modalInstance', 'params', '$rootScope', function ($scope, $state, $stateParams, radasoft, $modal, $translate, $modalInstance, params, $rootScope) {
    $scope.title = params.title;
    $scope.params = params;

    $scope.showProject = $scope.params.showProject;
    $scope.showPhaseZone = $scope.params.showPhaseZone;

    $scope.developers = [];
    $scope.projects = [];
    $scope.projectUnit = [];
    $scope.projectPhase = [];
    $scope.projectZone = [];
    $scope.projectPrice = [];

    $scope.selectedDev = undefined;
    $scope.selectedPro = undefined;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.getProjectPhase = function () {
        if ($scope.selectedPro && $scope.selectedPro.PROJECT_RUNNING_ID != undefined) {
            radasoft.getProjectPhase({
                PROJECT_RUNNING_ID: $scope.selectedPro.PROJECT_RUNNING_ID
            }).then(function (response) {
                $scope.projectPhase = response.data;
            });
        }
    }

    $scope.getProjectZone = function () {
        if ($scope.selectedPhase.PROJECT_PHASE_RUNNING_ID != undefined) {
            radasoft.getZoneByPhase({
                PROJECT_PHASE_RUNNING_ID: $scope.selectedPhase.PROJECT_PHASE_RUNNING_ID
            }).then(function (response) {
                $scope.projectZone = response.data;
            });
        }
    }

    $scope.addZone = function () {
        if ($scope.selectedPhase == undefined) {
            radasoft.alert($translate.instant('PLEASE_SELECT') + ' ' + $translate.instant('PHASE'));
        } else {
            $scope.openZone({
                PROJECT_ZONE_RUNNING_ID: 0,
                PROJECT_PHASE_RUNNING_ID: $scope.selectedPhase.PROJECT_PHASE_RUNNING_ID
            });
        }
    }
    $scope.editZone = function (zone) {
        $scope.openZone(angular.copy(zone));
    }
    $scope.addPhase = function () {
        $scope.openPhase({
            PROJECT_PHASE_RUNNING_ID: 0,
            PROJECT_RUNNING_ID: $scope.selectedPro.PROJECT_RUNNING_ID
        });
    }
    $scope.editPhase = function (phase) {
        $scope.openPhase(angular.copy(phase));
    }
    $scope.selectPhase = function (phase) {
        $scope.selectedPhase = phase;
        $scope.getProjectZone();
    }

    $scope.openPhase = function (data) {
        $modal.open({
            templateUrl: 'app/views/setting/phase.html',
            controller: 'phaseController',
            backdrop: 'static',
            keyboard: false,
            //windowClass: 'app-modal-window-80',
            size: 'lg',
            resolve: {
                params: function () {
                    return {
                        formData: data
                    };
                }
            }
        }).result.then(function (data) {
            $scope.getProjectPhase();
            radasoft.success();
        });
    }

    $scope.openZone = function (data) {
        $modal.open({
            templateUrl: 'app/views/setting/zone.html',
            controller: 'zoneController',
            backdrop: 'static',
            keyboard: false,
            //windowClass: 'app-modal-window-80',
            size: 'lg',
            resolve: {
                params: function () {
                    return {
                        formData: data,
                        projectPhase: $scope.projectPhase
                    };
                }
            }
        }).result.then(function (data) {
            $scope.getProjectZone();
            radasoft.success();
        });
    }

    $scope.init = function () {
        if ($scope.params.developer && $scope.params.project) {
            $scope.selectedDev = $scope.params.developer;
            $scope.selectedPro = $scope.params.project;

            $scope.getProjectPhase();
        }
    }

    $scope.init();
}]);

app.controller('devController', ['$scope', '$state', 'toaster', '$modal', '$translate', 'SweetAlert', '$modalInstance', 'radasoft', 'params', function ($scope, $state, toaster, $modal, $translate, SweetAlert, $modalInstance, radasoft, params) {
    $scope.ldloading1 = {};
    $scope.ldloading2 = {};

    $scope.btnDisabled = false;
    $scope.btnSubmitDisabled = false;

    $scope.formData = params.formData;

    $scope.title1 = $translate.instant('DEVELOPER');
    $scope.title2 = $scope.formData.DEV_NAME;

    $scope.save = function (form) {
        if (form.$invalid) {
            var field = null, firstError = null;
            for (field in form) {
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
            radasoft.confirmAndSave($translate.instant('CONFIRM.SAVE'), '', function (isconfirmed) {
                if (isconfirmed) {
                    radasoft.setDeveloper($scope.formData).then(function (response) {
                        $modalInstance.close('update');
                    });
                }
            });
        }
    };

    $scope.delete = function (style) {
        radasoft.confirmAndSave($translate.instant('CONFIRM.DELETE'), '', function (isconfirmed) {
            if (isconfirmed) {
                radasoft.deleteDeveloper($scope.formData).then(function (response) {
                    $modalInstance.close('delete');
                });
            }
        });
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.init = function () {

    }

    $scope.init();
}]);

app.controller('proController', ['$scope', '$state', 'toaster', '$modal', '$translate', 'SweetAlert', '$modalInstance', 'radasoft', 'params', '$filter', '$q', function ($scope, $state, toaster, $modal, $translate, SweetAlert, $modalInstance, radasoft, params, $filter, $q) {
    $scope.ldloading1 = {};
    $scope.ldloading2 = {};

    $scope.btnDisabled = false;
    $scope.btnSubmitDisabled = false;

    $scope.formData = undefined;

    $scope.title1 = $translate.instant('PROJECT');
    $scope.title2 = '';

    $scope.selectCountry = [];
    $scope.selectProvince = [];
    $scope.selectDistrict = [];
    $scope.selectSubDistrict = [];

    $scope.onAddDistrictChange = function (item) {
        $scope.formData.ADD_POSTCODE = item.ZIPCODE;
        $scope.formData.ADD_DEED_CODE = item.CODE;
    }

    $scope.getCountry = function () {
        radasoft.getCountry({}).then(function (response) {
            $scope.selectCountry = response.data;

            $scope.getProvince();
        });
    }
    $scope.getProvince = function () {
        radasoft.getProvince({}).then(function (response) {
            $scope.selectProvince = response.data;
        });
    }
    $scope.getDistrict = function (item, model) {
        $scope.formData.LOC_PROVINCE = item;
        $scope.selectDistrict = [];
        $scope.selectSubDistrict = [];
        $scope.formData.ADD_CITY = {};
        $scope.formData.ADD_DISTRICT = {};
        radasoft.getDistrict({ PROVINCE_ID: item.PROV_ID }).then(function (response) {
            $scope.selectDistrict = response.data;
        });
    }
    $scope.getSubDistrict = function ($item, $model) {
        $scope.formData.LOC_CITY = $item;
        $scope.selectSubDistrict = [];
        $scope.formData.ADD_DISTRICT = {};
        radasoft.getSubDistrict({ PROVINCE_ID: $item.PROVINCE_ID, DISTRICT_ID: $item.CITY_ID }).then(function (response) {
            $scope.selectSubDistrict = response.data;
        });
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.openMap = function () {
        var PROJECT_RUNNING_ID = '';

        if ($scope.formData.LOCATION_LAT != null
            && $scope.formData.LOCATION_LAT != undefined
            && $scope.formData.LOCATION_LAT != ''
            && $scope.formData.LOCATION_LONG != null
            && $scope.formData.LOCATION_LONG != undefined
            && $scope.formData.LOCATION_LONG != '') {
            PROJECT_RUNNING_ID = $scope.formData.PROJECT_RUNNING_ID;
        }

        var DEED_PROVINCE = $scope.formData.ADD_PROVINCE || {};
        var DEED_CITY = $scope.formData.ADD_CITY || {};
        var DEED_DISTRICT = $scope.formData.ADD_DISTRICT || {};

        radasoft.openMapDefineProjectLocation({
            page: 'DefineProjectLocation',
            PROJECT_RUNNING_ID: PROJECT_RUNNING_ID,
            DEED_PROVINCE: DEED_PROVINCE,// PROJECT_RUNNING_ID == '' ? {} : DEED_PROVINCE,
            DEED_CITY: DEED_CITY,// PROJECT_RUNNING_ID == '' ? {} : DEED_CITY,
            DEED_DISTRICT: DEED_DISTRICT// PROJECT_RUNNING_ID == '' ? {} : DEED_DISTRICT,
        }, function (args) {
            $scope.mapReturnArgs = args;
            $scope.formData.LOCATION_LAT = args.location.lat;
            $scope.formData.LOCATION_LONG = args.location.lon;
            $scope.$apply();
        });
    }

    $scope.save = function (form) {
        if (form.$invalid) {
            var field = null, firstError = null;
            for (field in form) {
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
            radasoft.confirmAndSave($translate.instant('CONFIRM.SAVE'), '', function (isconfirmed) {
                if (isconfirmed) {
                    radasoft.setProject($scope.formData).then(function (response) {

                        if ($scope.mapReturnArgs == undefined) {
                            $modalInstance.close('update');
                        } else {
                            //$scope.mapReturnArgs.response.graphic[0].attributes.PROJECT_RUNNING_ID = response.data[0].PROJECT_RUNNING_ID;
                            var attributes = angular.fromJson($scope.mapReturnArgs.response.graphic[0].attributes);
                            var geometry = angular.fromJson($scope.mapReturnArgs.response.graphic[0].geometry);
                            var graphic = [{ attributes: attributes, geometry: geometry }];

                            graphic[0].attributes.PROJECT_RUNNING_ID = response.data[0].PROJECT_RUNNING_ID;

                            radasoft.gisPostFeatureUrl({
                                featureUrl: $scope.mapReturnArgs.response.featureUrl,
                                token: $scope.mapReturnArgs.response.token,
                                adds: graphic[0].attributes.OBJECTID == undefined ? graphic : [],
                                updates: graphic[0].attributes.OBJECTID != undefined ? graphic : []
                            }).then(function () {
                                $modalInstance.close('update');
                            });
                        }
                    });
                }
            });
        }
    };

    $scope.delete = function (style) {
        radasoft.confirmAndSave($translate.instant('CONFIRM.DELETE'), '', function (isconfirmed) {
            if (isconfirmed) {
                radasoft.deleteProject($scope.formData).then(function (response) {
                    $modalInstance.close('delete');
                });
            }
        });
    }

    $scope.getProjectDetail = function () {
        var deffered = $q.defer();
        radasoft.getProjectDetail({ PROJECT_RUNNING_ID: params.formData.PROJECT_RUNNING_ID }).then(function (response) {
            $scope.formData = response.data;

            if (response.data == null) {
                $scope.formData = params.formData;
            } else {
                $scope.title2 = $scope.formData.PROJECT_NAME;
            }

            deffered.resolve();
        });
        return deffered.promise;
    }

    $scope.init = function () {
        $scope.getProjectDetail().then(function () {
            $scope.getCountry();
        });
    }

    $scope.init();
}]);

app.controller('unitTypeController', ['$scope', '$state', 'toaster', '$modal', '$translate', 'SweetAlert', '$modalInstance', 'radasoft', 'params', '$filter', function ($scope, $state, toaster, $modal, $translate, SweetAlert, $modalInstance, radasoft, params, $filter) {
    $scope.ldloading1 = {};
    $scope.ldloading2 = {};

    $scope.btnDisabled = false;
    $scope.btnSubmitDisabled = false;

    $scope.formData = params.formData;

    $scope.title1 = $translate.instant('UNIT_TYPE');
    $scope.title2 = $scope.formData.UNIT_NAME;

    $scope.selectUnitType = [];

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.save = function (form) {
        if (form.$invalid) {
            var field = null, firstError = null;
            for (field in form) {
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
            radasoft.confirmAndSave($translate.instant('CONFIRM.SAVE'), '', function (isconfirmed) {
                if (isconfirmed) {
                    radasoft.setProjectUnit($scope.formData).then(function (response) {
                        $modalInstance.close(response.data);
                    });
                }
            });
        }
    };

    $scope.delete = function (style) {
        radasoft.confirmAndSave($translate.instant('CONFIRM.DELETE'), '', function (isconfirmed) {
            if (isconfirmed) {
                radasoft.deleteProjectUnit($scope.formData).then(function (response) {
                    $modalInstance.close(response.data);
                });
            }
        });
    }

    $scope.init = function () {
        radasoft.getUnitType({}).then(function (response) {
            $scope.selectUnitType = response.data;
        });
    }

    $scope.init();
}]);

app.controller('zoneController', ['$scope', '$state', 'toaster', '$modal', '$translate', 'SweetAlert', '$modalInstance', 'radasoft', 'params', function ($scope, $state, toaster, $modal, $translate, SweetAlert, $modalInstance, radasoft, params) {
    $scope.ldloading1 = {};
    $scope.ldloading2 = {};

    $scope.btnDisabled = false;
    $scope.btnSubmitDisabled = false;

    $scope.formData = params.formData;
    $scope.selectProjectPhase = params.projectPhase;

    $scope.title1 = $translate.instant('ZONE');
    $scope.title2 = $scope.formData.ZONE_NAME;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.save = function (form) {
        if (form.$invalid) {
            var field = null, firstError = null;
            for (field in form) {
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
            radasoft.confirmAndSave($translate.instant('CONFIRM.SAVE'), '', function (isconfirmed) {
                if (isconfirmed) {
                    radasoft.setProjectZone($scope.formData).then(function (response) {
                        $modalInstance.close(response.data);
                    });
                }
            });
        }
    };

    $scope.delete = function (style) {
        radasoft.confirmAndSave($translate.instant('CONFIRM.DELETE'), '', function (isconfirmed) {
            if (isconfirmed) {
                radasoft.deleteProjectZone($scope.formData).then(function (response) {
                    $modalInstance.close(response.data);
                });
            }
        });
    }

    $scope.init = function () {

    }

    $scope.init();
}]);

app.controller('phaseController', ['$scope', '$state', 'toaster', '$modal', '$translate', 'SweetAlert', '$modalInstance', 'radasoft', 'params', function ($scope, $state, toaster, $modal, $translate, SweetAlert, $modalInstance, radasoft, params) {
    $scope.ldloading1 = {};
    $scope.ldloading2 = {};

    $scope.btnDisabled = false;
    $scope.btnSubmitDisabled = false;

    $scope.formData = params.formData;

    $scope.title1 = $translate.instant('PHASE');
    $scope.title2 = $scope.formData.PHASE_NAME;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.save = function (form) {
        if (form.$invalid) {
            var field = null, firstError = null;
            for (field in form) {
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
            radasoft.confirmAndSave($translate.instant('CONFIRM.SAVE'), '', function (isconfirmed) {
                if (isconfirmed) {
                    radasoft.setProjectPhase($scope.formData).then(function (response) {
                        $modalInstance.close(response.data);
                    });
                }
            });
        }
    };

    $scope.delete = function (style) {
        radasoft.confirmAndSave($translate.instant('CONFIRM.DELETE'), '', function (isconfirmed) {
            if (isconfirmed) {
                radasoft.deleteProjectPhase($scope.formData).then(function (response) {
                    $modalInstance.close(response.data);
                });
            }
        });
    }

    $scope.init = function () {

    }

    $scope.init();
}]);

app.controller('priceController', ['$scope', '$state', 'toaster', '$modal', '$translate', 'SweetAlert', '$modalInstance', 'radasoft', 'params', function ($scope, $state, toaster, $modal, $translate, SweetAlert, $modalInstance, radasoft, params) {
    $scope.ldloading1 = {};
    $scope.ldloading2 = {};

    $scope.btnDisabled = false;
    $scope.btnSubmitDisabled = false;

    $scope.formData = params.formData;
    $scope.selectProjectZone = params.projectZone;
    $scope.selectProjectUnit = params.projectUnit;

    $scope.title1 = $translate.instant('PRICE');
    $scope.title2 = $scope.formData.PHASE_NAME;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.save = function (form) {
        if (form.$invalid) {
            var field = null, firstError = null;
            for (field in form) {
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
            radasoft.confirmAndSave($translate.instant('CONFIRM.SAVE'), '', function (isconfirmed) {
                if (isconfirmed) {
                    radasoft.setProjectPrice($scope.formData).then(function (response) {
                        $modalInstance.close(response.data);
                    });
                }
            });
        }
    };

    $scope.delete = function (style) {
        radasoft.confirmAndSave($translate.instant('CONFIRM.DELETE'), '', function (isconfirmed) {
            if (isconfirmed) {
                radasoft.deleteProjectPrice($scope.formData).then(function (response) {
                    $modalInstance.close(response.data);
                });
            }
        });
    }

    $scope.zoneChange = function (item, index) {
        //console.log(item);
        //console.log(index);
        $scope.formData.PHASE_NAME = item.PHASE_NAME;
        $scope.formData.ZONE_NAME = item.ZONE_NAME;
    }

    $scope.init = function () {

    }

    $scope.init();
}]);