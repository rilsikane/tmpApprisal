app.controller('projectController', ['$scope', '$state', '$stateParams', 'radasoft', '$modal', '$translate', '$modalInstance', 'params', function ($scope, $state, $stateParams, radasoft, $modal, $translate, $modalInstance, params) {
    $scope.showProject = params.showProject;
    $scope.showPhaseZone = params.showPhaseZone;
    $scope.title = params.title;
    $scope.developers = [];
    $scope.projects = [];
    $scope.projectUnit = [];
    $scope.projectPhase = [];
    $scope.projectZone = [];
    $scope.projectPrice = [];

    $scope.selectedDev = undefined;
    $scope.selectedPro = undefined;

    //$scope.devSearchKeyword = '';
    //$scope.proSearchKeyword = '';

    $scope.formData = {
        devSearchKeyword: '',
        proSearchKeyword: ''
    };

    $scope.panelStyle = { height: 500 };

    $scope.getDeveloper = function () {
        radasoft.debug($scope.devSearchKeyword);
        radasoft.getDeveloper({ FILTER: $scope.formData.devSearchKeyword }).then(function (response) {
            $scope.developers = response.data;

            $scope.getProject();
        });
    }

    $scope.getProject = function () {
        if ($scope.selectedDev && $scope.selectedDev.DEV_RUNNING_ID != undefined) {
            radasoft.getProject({
                DEV_RUNNING_ID: $scope.selectedDev.DEV_RUNNING_ID,
                FILTER: $scope.formData.proSearchKeyword
            }).then(function (response) {
                $scope.projects = response.data;

                $scope.getProjectPhase();
            });
        }
    }

    $scope.getProjectUnit = function () {
        radasoft.getProjectUnit({ PROJECT_RUNNING_ID: $scope.selectedPro.PROJECT_RUNNING_ID }).then(function (response) {
            $scope.projectUnit = response.data;
        });
    }

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
    $scope.getProjectPrice = function () {
        radasoft.getProjectPrice({
            PROJECT_RUNNING_ID: $scope.selectedPro.PROJECT_RUNNING_ID
        }).then(function (response) {
            $scope.projectPrice = response.data;
        });
    }
    $scope.searchDevEnter = function ($event) {
        if ($event.keyCode == 13) {
            $scope.getDeveloper();
        }
    }
    $scope.searchProjectEnter = function ($event) {
        if ($event.keyCode == 13) {
            $scope.getProject();
        }
    }
    $scope.searchProject = function (developer) {
        $scope.selectedDev = developer;
        $scope.projectUnit = [];
        $scope.projectPhase = [];
        $scope.projectZone = [];
        $scope.projectPrice = [];
        $scope.selectedPro = undefined;
        $scope.getProject();
    }
    $scope.searchProjectUnit = function (project) {
        $scope.selectedPro = project;
        //$scope.getProjectUnit();
    }
    $scope.getProjectDetail = function (project) {
        $scope.selectedPro = project;
        //$scope.getProjectUnit();
        //$scope.getProjectPhase();
        //$scope.getProjectZone();
        //$scope.getProjectPrice();
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
            $scope.getProject();
            radasoft.success();
        });
    }
    $scope.openUnitType = function (data) {
        $modal.open({
            templateUrl: 'app/views/setting/unit.html',
            controller: 'unitTypeController',
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
            $scope.getProjectUnit();
            radasoft.success();
        });
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
    $scope.openPrice = function (data) {
        $modal.open({
            templateUrl: 'app/views/setting/price.html',
            controller: 'priceController',
            backdrop: 'static',
            keyboard: false,
            //windowClass: 'app-modal-window-80',
            size: 'lg',
            resolve: {
                params: function () {
                    return {
                        formData: data,
                        projectZone: $scope.projectZone,
                        projectUnit: $scope.projectUnit
                    };
                }
            }
        }).result.then(function (data) {
            $scope.getProjectPrice();
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
        $scope.openDev(dev);
    }
    $scope.addPro = function () {
        $scope.openPro({
            PROJECT_RUNNING_ID: 0,
            PROJECT_CODE: '',
            PROJECT_NAME: '',
            DEV_RUNNING_ID: $scope.selectedDev.DEV_RUNNING_ID,
            ADD_COUNTRY: {
                CODE: 'TH',
                NAME_THAI: 'ไทย'
            }
        });
    }
    $scope.editProject = function (project) {
        $scope.openPro(project);
    }

    $scope.addUnitType = function () {
        $scope.openUnitType({
            PROJECT_UT_RUNNING_ID: 0,
            PROJECT_RUNNING_ID: $scope.selectedPro.PROJECT_RUNNING_ID
        });
    }
    $scope.editProjectUnit = function (unit) {
        $scope.openUnitType(unit);
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
        $scope.openZone(zone);
    }
    $scope.addPhase = function () {
        $scope.openPhase({
            PROJECT_PHASE_RUNNING_ID: 0,
            PROJECT_RUNNING_ID: $scope.selectedPro.PROJECT_RUNNING_ID
        });
    }
    $scope.editPhase = function (phase) {
        $scope.openPhase(phase);
    }
    $scope.selectPhase = function (phase) {
        $scope.selectedPhase = phase;
        //console.log(phase);
        $scope.getProjectZone();
    }
    $scope.addPrice = function () {
        $scope.openPrice({
            PROJECT_PRICE_RUNNING_ID: 0,
            FLOOR: 0
        });
    }
    $scope.editPrice = function (price) {
        $scope.openPrice(price);
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

            //toaster.pop('warning', $translate.instant('NOTIFY.DATA_INVALID'));
        } else {
            $scope.saveProjectData();
        }
    };

    $scope.selectDevPro = function () {
        $modalInstance.close({
            developer: $scope.selectedDev,
            project: $scope.selectedPro
        });
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.init = function () {

        if (params.developer && params.project) {
            $scope.selectedDev = params.developer;
            $scope.selectedPro = params.project;
        }

        $scope.getDeveloper();
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

app.controller('proController', ['$scope', '$state', 'toaster', '$modal', '$translate', 'SweetAlert', '$modalInstance', 'radasoft', 'params', '$filter', function ($scope, $state, toaster, $modal, $translate, SweetAlert, $modalInstance, radasoft, params, $filter) {
    $scope.ldloading1 = {};
    $scope.ldloading2 = {};

    $scope.btnDisabled = false;
    $scope.btnSubmitDisabled = false;

    $scope.formData = params.formData;

    $scope.title1 = $translate.instant('PROJECT');
    $scope.title2 = $scope.formData.PROJECT_NAME;

    $scope.selectCountry = [];
    $scope.selectProvince = [];
    $scope.selectDistrict = [];
    $scope.selectSubDistrict = [];

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

    $scope.init = function () {
        $scope.getCountry();
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