app.controller('headColEditorCtrl', ['$scope', '$state', 'toaster', '$modal', '$translate', 'SweetAlert', '$modalInstance', 'radasoft', 'params', '$q', function ($scope, $state, toaster, $modal, $translate, SweetAlert, $modalInstance, radasoft, params, $q) {
    $scope.keyId = params.formData.HEAD_COL_RUNNING_ID;
    $scope.ldloading = {};
    $scope.btnDisabled = false;
    $scope.btnSubmitDisabled = false;

    $scope.labelControlCss = 'col-sm-4 control-label';
    $scope.formControlCss = 'col-sm-8';

    $scope.includeTemplateUrl = 'app/views/test/boundary.html';

    $scope.formData = {};
    $scope.IS_PROJECT = params.IS_PROJECT;

    $scope.selectCountry = [];
    $scope.selectProvince = [];
    $scope.selectDistrict = [];
    $scope.selectSubDistrict = [];

    $scope.selectLocCountry = [];
    $scope.selectLocProvince = [];
    $scope.selectLocDistrict = [];
    $scope.selectLocSubDistrict = [];

    $scope.radioMachineOperation = [{ VALUE: 'S', NAME: 'Stand alone' }, { VALUE: 'L', NAME: 'Line ผลิต' }, { VALUE: 'X', NAME: 'ไม่ใช่เครื่องจักร' }];
    $scope.radioRegisYN = [{ VALUE: 'N', NAME: 'จดทะเบียน' }, { VALUE: 'Y', NAME: 'ไม่จดทะเบียน' }];

    $scope.selectProjectUnitType = [];

    $scope.getCountry = function () {
        var deffered = $q.defer();

        radasoft.getCountry({}).then(function (response) {
            $scope.selectCountry = response.data;
            deffered.resolve();
        });

        return deffered.promise;
    }

    $scope.getProjectUnitType = function () {
        var deffered = $q.defer();
        if ($scope.IS_PROJECT) {
            radasoft.getUnitType({}).then(function (response) {
                $scope.selectProjectUnitType = response.data;
                deffered.resolve();
            });
        }
        return deffered.promise;
    }

    $scope.getProvince = function () {
        var deffered = $q.defer();
        radasoft.getProvince({}).then(function (response) {
            $scope.selectProvince = response.data;
            if ($scope.IS_PROJECT) {
                $scope.getProjectUnitType().then(function () {
                    deffered.resolve();
                });
            } else {
                deffered.resolve();
            }
        });
        return deffered.promise;
    }
    $scope.onDeedProvinceChange = function (item, model) {

        $scope.selectDistrict = [];
        $scope.selectSubDistrict = [];

        $scope.formData.DEED_CITY = undefined;
        $scope.formData.DEED_DISTRICT = undefined;

        if ($scope.formData.HEAD_COL_RUNNING_ID == 0) {
            $scope.formData.LOC_CITY = undefined;
            $scope.formData.LOC_DISTRICT = undefined;
        }

        radasoft.getDistrict({ PROVINCE_ID: item.PROV_ID }).then(function (response) {
            $scope.selectDistrict = response.data;

            if ($scope.formData.HEAD_COL_RUNNING_ID == 0) {
                $scope.getLocDistrict(item, model);
            }
        });
    }
    $scope.onDeedCityChange = function ($item, $model) {
        if ($scope.formData.HEAD_COL_RUNNING_ID == 0) {
            $scope.formData.LOC_CITY = $item;
            $scope.formData.LOC_DISTRICT = undefined;
        }

        $scope.selectSubDistrict = [];
        $scope.formData.DEED_DISTRICT = undefined;

        radasoft.getSubDistrict({ PROVINCE_ID: $item.PROVINCE_ID, DISTRICT_ID: $item.CITY_ID }).then(function (response) {
            $scope.selectSubDistrict = response.data;

            if ($scope.formData.HEAD_COL_RUNNING_ID == 0) {
                $scope.getLocSubDistrict($item, $model);
            }
        });
    }

    $scope.getLocProvince = function () {
        radasoft.getProvince({}).then(function (response) {
            $scope.selectLocProvince = response.data;
        });
    }
    $scope.getLocDistrict = function (item, model) {
        $scope.formData.LOC_PROVINCE = item;
        $scope.selectLocDistrict = [];
        $scope.selectLocSubDistrict = [];

        $scope.formData.LOC_CITY = undefined;
        $scope.formData.LOC_DISTRICT = undefined;
        radasoft.getDistrict({ PROVINCE_ID: item.PROV_ID }).then(function (response) {
            $scope.selectLocDistrict = response.data;
        });
    }
    $scope.getLocSubDistrict = function ($item, $model) {
        $scope.formData.LOC_CITY = $item;
        $scope.selectLocSubDistrict = [];
        $scope.formData.LOC_DISTRICT = undefined;
        radasoft.getSubDistrict({ PROVINCE_ID: $item.PROVINCE_ID, DISTRICT_ID: $item.CITY_ID }).then(function (response) {
            $scope.selectLocSubDistrict = response.data;
        });
    }

    $scope.openMap = function () {

        var HEAD_COL_RUNNING_ID = ($scope.formData.LOCATION_LAT == '' || $scope.formData.LOCATION_LAT == null) && ($scope.formData.LOCATION_LONG == '' || $scope.formData.LOCATION_LONG == null) ? '' : $scope.formData.HEAD_COL_RUNNING_ID;
        var DEED_PROVINCE = $scope.formData.DEED_PROVINCE || {};
        var DEED_CITY = $scope.formData.DEED_CITY || {};
        var DEED_DISTRICT = $scope.formData.DEED_DISTRICT || {};
        var DEED_NO = $scope.formData.DEED_NO;

        radasoft.openMapDefineHeadColLocation({
            page: 'DefineHeadColLocation',
            HEAD_COL_RUNNING_ID: HEAD_COL_RUNNING_ID,
            DEED_PROVINCE: HEAD_COL_RUNNING_ID == '' ? {} : DEED_PROVINCE,
            DEED_CITY: HEAD_COL_RUNNING_ID == '' ? {} : DEED_CITY,
            DEED_DISTRICT: HEAD_COL_RUNNING_ID == '' ? {} : DEED_DISTRICT,
            DEED_NO: HEAD_COL_RUNNING_ID == '' ? '' : DEED_NO
        }, function (args) {
            $scope.mapReturnArgs = args;
            $scope.formData.LOCATION_LAT = args.location.lat;
            $scope.formData.LOCATION_LONG = args.location.lon;
            $scope.$apply();
        });
    }

    $scope.onDeedDistrictChange = function ($item, $model) {
        if ($scope.formData.HEAD_COL_RUNNING_ID == 0) {
            $scope.formData.LOC_DISTRICT = $item;
        }
    }

    $scope.save = function (item, style) {
        radasoft.confirmAndSave($translate.instant('CONFIRM.SAVE'), '', function (isconfirmed) {
            if (isconfirmed) {
                radasoft.setHeadColl($scope.formData).then(function (response) {
                    if ($scope.mapReturnArgs == undefined) {
                        radasoft.success();
                        $modalInstance.close(response.data);
                    } else {
                        var attributes = angular.fromJson($scope.mapReturnArgs.response.graphic[0].attributes);
                        var geometry = angular.fromJson($scope.mapReturnArgs.response.graphic[0].geometry);
                        var graphic = [{ attributes: attributes, geometry: geometry }];

                        graphic[0].attributes.HEAD_COL_RUNNING_ID = response.data.HEAD_COL_RUNNING_ID;

                        radasoft.gisPostFeatureUrl({
                            featureUrl: $scope.mapReturnArgs.response.featureUrl,
                            token: $scope.mapReturnArgs.response.token,
                            adds: graphic[0].attributes.OBJECTID == undefined ? graphic : [],
                            updates: graphic[0].attributes.OBJECTID != undefined ? graphic : []
                        }).then(function () {
                            radasoft.success();
                            $modalInstance.close(response.data);
                        });
                    }
                });
            }
        });
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.submit = function (form, style) {
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
            $scope.save($scope.formData, style);
        }
    };

    $scope.getHeadColById = function (DOC_ID, HEAD_COL_RUNNING_ID) {
        var deffered = $q.defer();
        radasoft.getHeadColById({ DOC_ID: DOC_ID, HEAD_COL_RUNNING_ID: HEAD_COL_RUNNING_ID }).then(function (response) {
            $scope.formData = response.data;

            deffered.resolve();
        });
        return deffered.promise;
    }

    $scope.init = function () {
        $scope.getCountry().then(function () {
            $scope.getProvince().then(function () {
                if (params.formData.HEAD_COL_RUNNING_ID == 0) {
                    $scope.formData = params.formData;
                } else {
                    $scope.getHeadColById(params.formData.DOC_ID, params.formData.HEAD_COL_RUNNING_ID).then(function () {
                        radasoft.getDistrict({ PROVINCE_ID: $scope.formData.LOC_PROVINCE.PROV_ID }).then(function (response) {
                            $scope.selectLocDistrict = response.data;
                            radasoft.getSubDistrict({ PROVINCE_ID: $scope.formData.LOC_PROVINCE.PROV_ID, DISTRICT_ID: $scope.formData.LOC_CITY.CITY_ID }).then(function (response) {
                                $scope.selectLocSubDistrict = response.data;

                                radasoft.getDistrict({ PROVINCE_ID: $scope.formData.DEED_PROVINCE.PROV_ID }).then(function (response) {
                                    $scope.selectDistrict = response.data;

                                    radasoft.getSubDistrict({ PROVINCE_ID: $scope.formData.DEED_PROVINCE.PROV_ID, DISTRICT_ID: $scope.formData.DEED_CITY.CITY_ID }).then(function (response) {
                                        $scope.selectSubDistrict = response.data;
                                    });
                                });
                            });
                        });
                    });
                }
            });
        });
    }

    $scope.init();
}]);