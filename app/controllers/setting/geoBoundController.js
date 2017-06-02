app.controller('geoBoundController', ['$scope', '$rootScope', '$state', '$stateParams', 'radasoft', '$modal', '$translate', function ($scope, $rootScope, $state, $stateParams, radasoft, $modal, $translate) {
    $scope.provinces = [];
    $scope.districts = [];
    $scope.subDistricts = [];
    $scope.selectedProvince = {};

    $scope.provinceSearchKeyword = '';
    $scope.districtSearchKeyword = '';

    $scope.currentProvincePage = 1;
    $scope.provinceTotalItems = 0;

    $scope.currentDistrictPage = 1;
    $scope.districtTotalItems = 0;

    $scope.searchDistrict = function ($event) {
        if ($event != undefined && $event.keyCode == 13) {
            $scope.getDistrict();
        } else if ($event == undefined) {
            $scope.getDistrict();
        }
    }

    $scope.searchProvince = function ($event) {
        if ($event != undefined && $event.keyCode == 13) {
            $scope.getProvince();
        } else if ($event == undefined) {
            $scope.getProvince();
        }
    }

    $scope.getProvince = function () {
        radasoft.getProvinceMaster({
            limit: $rootScope.app.itemsPerPage,
            page: $scope.currentProvincePage,
            filters: [
             {
                 NAME: 'FILTER',
                 VALUE: $scope.provinceSearchKeyword
             }
            ]
        }).then(function (response) {
            $scope.provinces = response.data.data;
            $scope.provinceTotalItems = response.data.totals;
        });
    }

    $scope.selectProvince = function (province) {
        $scope.selectedProvince = province;
        $scope.getDistrict();
    }

    $scope.getDistrict = function () {
        radasoft.getDistrictMaster({
            limit: $rootScope.app.itemsPerPage,
            page: $scope.currentDistrictPage,
            filters: [
             {
                 NAME: 'PROVINCE_ID',
                 VALUE: $scope.selectedProvince.PROV_ID
             },
             {
                 NAME: 'FILTER',
                 VALUE: $scope.districtSearchKeyword
             }
            ]
        }).then(function (response) {
            $scope.districts = response.data.data;
            $scope.districtTotalItems = response.data.totals;
            $scope.subDistricts = [];
        });
    }
    $scope.selectDistrict = function (district) {
        $scope.selectedDistrict = district;

        $scope.getSubDistrict();
    }

    $scope.getSubDistrict = function () {
        radasoft.getSubDistrictMaster({
            PROVINCE_ID: $scope.selectedProvince.PROV_ID,
            DISTRICT_ID: $scope.selectedDistrict.CITY_ID
        }).then(function (response) {
            $scope.subDistricts = response.data;
        });
    }

    $scope.openProvinceDialog = function (data) {
        radasoft.openDialog({
            controller: 'provinceController',
            resolve: {
                params: function () {
                    return {
                        includeUrl: '/app/views/setting/geoBound/province.html',
                        formData: data
                    };
                }
            }
        }).result.then(function (data) {
            $scope.getProvince()
        });;
    }

    $scope.openDistrictDialog = function (data) {
        radasoft.openDialog({
            controller: 'districtController',
            resolve: {
                params: function () {
                    return {
                        includeUrl: '/app/views/setting/geoBound/district.html',
                        formData: data
                    };
                }
            }
        }).result.then(function (data) {
            $scope.getDistrict()
        });;
    }

    $scope.openSubDistrictDialog = function (data) {
        radasoft.openDialog({
            controller: 'subDistrictController',
            resolve: {
                params: function () {
                    return {
                        includeUrl: '/app/views/setting/geoBound/subDistrict.html',
                        formData: data
                    };
                }
            }
        }).result.then(function (data) {
            $scope.getSubDistrict()
        });;
    }

    $scope.addProvince = function () {
        $scope.openProvinceDialog({});
    }
    $scope.editProvince = function (province) {
        $scope.openProvinceDialog(province);
    }

    $scope.addDistrict = function () {
        $scope.openDistrictDialog({ PROVINCE_ID: $scope.selectedProvince.PROV_ID });
    }
    $scope.editDistrict = function (data) {
        $scope.openDistrictDialog(data);
    }

    $scope.addSubDistrict = function () {
        $scope.openSubDistrictDialog({
            PROV_ID: $scope.selectedProvince.PROV_ID,
            CITY_ID: $scope.selectedDistrict.CITY_ID
        });
    }
    $scope.editSubDistrict = function (data) {
        $scope.openSubDistrictDialog(data);
    }

    $scope.init = function () {
        $scope.getProvince();
    }

    $scope.init();

}]);

app.controller('provinceController', ['$scope', '$state', 'toaster', '$modal', '$translate', 'SweetAlert', '$modalInstance', 'radasoft', 'params', function ($scope, $state, toaster, $modal, $translate, SweetAlert, $modalInstance, radasoft, params) {

    $scope.btnDisabled = false;
    $scope.btnSubmitDisabled = false;

    $scope.formData = params.formData;
    $scope.includeUrl = params.includeUrl;
    $scope.title = $translate.instant('PROVINCE');

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
                    radasoft.setProvince($scope.formData).then(function (response) {
                        radasoft.success();
                        $modalInstance.close(response.data);
                    });
                }
            });
        }
    };

    $scope.delete = function (style) {
        radasoft.confirmAndSave($translate.instant('CONFIRM.DELETE'), '', function (isconfirmed) {
            if (isconfirmed) {
                radasoft.deleteProvince($scope.formData).then(function (response) {
                    radasoft.success();
                    $modalInstance.close(response.data);
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

app.controller('districtController', ['$scope', '$state', 'toaster', '$modal', '$translate', 'SweetAlert', '$modalInstance', 'radasoft', 'params', '$filter', function ($scope, $state, toaster, $modal, $translate, SweetAlert, $modalInstance, radasoft, params, $filter) {
    $scope.btnDisabled = false;
    $scope.btnSubmitDisabled = false;

    $scope.formData = params.formData;
    $scope.includeUrl = params.includeUrl;
    $scope.title = $translate.instant('DISTRICT');

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
                    radasoft.setDistrict($scope.formData).then(function (response) {
                        radasoft.success();
                        $modalInstance.close(response.data);
                    });
                }
            });
        }
    };

    $scope.delete = function (style) {
        radasoft.confirmAndSave($translate.instant('CONFIRM.DELETE'), '', function (isconfirmed) {
            if (isconfirmed) {
                radasoft.deleteDistrict($scope.formData).then(function (response) {
                    radasoft.success();
                    $modalInstance.close(response.data);
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

app.controller('subDistrictController', ['$scope', '$state', 'toaster', '$modal', '$translate', 'SweetAlert', '$modalInstance', 'radasoft', 'params', '$filter', function ($scope, $state, toaster, $modal, $translate, SweetAlert, $modalInstance, radasoft, params, $filter) {
    $scope.btnDisabled = false;
    $scope.btnSubmitDisabled = false;

    $scope.formData = params.formData;
    $scope.includeUrl = params.includeUrl;
    $scope.title = $translate.instant('DISTRICT');

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
                    radasoft.setSubDistrict($scope.formData).then(function (response) {
                        radasoft.success();
                        $modalInstance.close(response.data);
                    });
                }
            });
        }
    };

    $scope.delete = function (style) {
        radasoft.confirmAndSave($translate.instant('CONFIRM.DELETE'), '', function (isconfirmed) {
            if (isconfirmed) {
                radasoft.deleteSubDistrict($scope.formData).then(function (response) {
                    radasoft.success();
                    $modalInstance.close(response.data);
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