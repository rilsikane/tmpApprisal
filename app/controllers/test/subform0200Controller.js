﻿
app.controller('costBuildingController', ['$scope', '$state', 'toaster', '$modal', '$translate', 'SweetAlert', '$modalInstance', 'radasoft', 'params', function ($scope, $state, toaster, $modal, $translate, SweetAlert, $modalInstance, radasoft, params) {
    $scope.includeUrl = params.includeUrl;
    $scope.title = $translate.instant('COST');
    $scope.showBtnSave = true;
    $scope.showBtnDelete = false;

    $scope.headCol = params.headCol;
    $scope.subCol = params.subCol;

    $scope.getCost = function () {
        radasoft.getCost({
            HEAD_COL_RUNNING_ID: $scope.headCol.HEAD_COL_RUNNING_ID,
            BUILDING_COL_RUNNING_ID: $scope.subCol.BUILDING_COL_RUNNING_ID
        }).then(function (response) {
            $scope.subcolCost = response.data;

            $scope.calSubColCost();
        });
    }

    $scope.setCost = function () {
        radasoft.confirmAndSave($translate.instant('CONFIRM.SAVE'), '', function (isconfirmed) {
            if (isconfirmed) {
                radasoft.setCost($scope.subcolCost).then(function (response) {
                    $scope.subcolCost = response.data;
                    radasoft.success();
                });
            }
        });
    }

    $scope.calSubColCost = function (cost) {
        if (cost != undefined) {
            cost.TOTALPRICE = cost.UNITPRICE * cost.AREA;
            cost.DEPLICIATIONPRICE = ((cost.TOTALPRICE * cost.DEPLICIATIONPERCENT) / 100) * cost.AGE;

            cost.AFTERDEPLICIATIONPRICE = cost.TOTALPRICE - cost.DEPLICIATIONPRICE;
            cost.DEPLICIATIONPRICEUNIT = cost.AFTERDEPLICIATIONPRICE / cost.AREA;
        }

        $scope.sumAREA = 0;
        $scope.sumTOTALPRICE = 0;
        $scope.sumDEPLICIATIONPRICE = 0;
        $scope.sumAFTERDEPLICIATIONPRICE = 0;
        $scope.sumDEPLICIATIONPRICEUNIT = 0;

        angular.forEach($scope.subcolCost, function (item) {
            $scope.sumAREA += item.AREA;
            $scope.sumTOTALPRICE += item.TOTALPRICE;
            $scope.sumDEPLICIATIONPRICE += item.DEPLICIATIONPRICE;
            $scope.sumAFTERDEPLICIATIONPRICE += item.AFTERDEPLICIATIONPRICE;
            $scope.sumDEPLICIATIONPRICEUNIT += item.DEPLICIATIONPRICEUNIT;
        });
    }

    $scope.save = function () {
        $scope.setCost();
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.init = function () {
        $scope.getCost();
    }

    $scope.init();
}]);

app.controller('subform0202Controller', ['$scope', '$state', 'toaster', '$modal', '$translate', 'SweetAlert', '$modalInstance', 'radasoft', 'params', '$filter', '$q', '$rootScope', function ($scope, $state, toaster, $modal, $translate, SweetAlert, $modalInstance, radasoft, params, $filter, $q, $rootScope) {
    $scope.dpOpenState = {};
    $scope.displayAllFiled = true;
    $scope.ldloading = {};
    $scope.btnDisabled = false;
    $scope.btnSubmitDisabled = false;
    $scope.labelControlCss = 'col-sm-4 control-label';
    $scope.formControlCss = 'col-sm-8';

    // parameter
    $scope.IS_PROJECT = params.IS_PROJECT;
    $scope.selectProjectZone = [];
    $scope.requestData = params.requestData;
    $scope.headCol = params.headCol;
    $scope.botColForm = params.botColForm;
    $scope.formData = params.formData;
    $scope.selectUsageType = params.colleteralUsageType;
    $scope.includeTemplateUrl1 = params.includeTemplateUrl1;
    $scope.includeTemplateUrl2 = params.includeTemplateUrl2;
    $scope.riskcde = params.riskcde;
    $scope.radioEnergy = params.energyType;
    $scope.selectRoadType = params.roadType;
    $scope.selectLevelLandFill = params.landScape;
    $scope.selectMaterial = params.materialFloor;
    $scope.selectDeedOffice;

    $scope.title1 = $scope.headCol.HEAD_COL_DETAIL;
    $scope.title2 = $scope.botColForm.COL_FORM_NAME;

    $scope.radioYN = [{ VALUE: 'Y', NAME: $translate.instant('YES') }, { VALUE: 'N', NAME: $translate.instant('NO') }];
    $scope.radioYesNo = [{ VALUE: 'Y', NAME: $translate.instant('GUTTER1') }, { VALUE: 'N', NAME: $translate.instant('GUTTER2') }];
    $scope.radioRentType = [{ VALUE: 'L', NAME: $translate.instant('LAND') }, { VALUE: 'B', NAME: $translate.instant('BUILDING') }];
    $scope.radioDecorated = [
        { VALUE: 1, NAME: $translate.instant('ตกแต่งพร้อมอยู่') }
        , { VALUE: 2, NAME: $translate.instant('ตกแต่งบางส่วน') }
        , { VALUE: 3, NAME: $translate.instant('ยังไม่ตกแต่ง') }];
    $scope.radioDeveloper = [
        { VALUE: 1, NAME: $translate.instant('บริษัทที่อยู่ในตลาดหลักทรัพย์') }
        , { VALUE: 2, NAME: $translate.instant('บริษัทอยู่นอกตลาด') }
        , { VALUE: 3, NAME: $translate.instant('ผู้รับเหมาก่อสร้าง') }];
    $scope.radioContructComplete = [{ VALUE: '1', NAME: 'เสร็จแล้ว' }, { VALUE: '0', NAME: 'ยังไม่เสร็จ' }];
    $scope.radioInsureYN = [{ VALUE: 'Y', NAME: 'ทำประกัน' }, { VALUE: 'N', NAME: 'ไม่ทำประกัน' }];
    $scope.radioBound = [{ VALUE: '1', NAME: 'ตรวจสอบแปลงคง' }, { VALUE: '2', NAME: 'ตรวจสอบจากระวาง' }];
    $scope.radioBoundFound = [{ VALUE: '1', NAME: 'ถูกต้อง' }, { VALUE: '2', NAME: 'คลาดเคลื่อน' }, { VALUE: '3', NAME: 'ไม่พบบ' }, { VALUE: '4', NAME: 'อ่านไม่ออก' }];
    $scope.radioRegisYN = [{ VALUE: 'N', NAME: 'จดทะเบียน' }, { VALUE: 'Y', NAME: 'ไม่จดทะเบียน' }];

    $scope.selectOutCityPlanProvince = [];
    $scope.selectCountry = [];
    $scope.selectProvince = [];
    $scope.selectDistrict = [];
    $scope.selectSubDistrict = [];
    //$scope.selectLevelLandFill = [];
    $scope.radioHousingType = [{ VALUE: '1', NAME: 'อยู่เอง' }, { VALUE: '2', NAME: 'ให้เช่า' }];
    $scope.selectBrand = params.brand;
    $scope.selectCustRelaction = [];
    $scope.selectAcquiredVia = [];
    $scope.selectInsuredCode = [];
    $scope.selectPropShape = [];

    $scope.onSubTypeChange = function ($item, $model) {

    }

    $scope.addFloor = function () {
        $scope.formData.BUILDING_FLOOR.push({
            BFLOOR_COL_RUNNING_ID: -Math.round((Math.random() * 10000)),
            DSC_FLOORNAME: '',
            DSC_FLOORXSZ: '',
            USAGE_FLOOR: ''
        });
    }

    $scope.getPropShape = function () {
        radasoft.getPropShape({}).then(function (response) {
            $scope.selectPropShape = response.data;
        });
    }

    $scope.calLandArea = function () {
        var rai = $scope.formData.RAI * 400;
        var ngan = $scope.formData.NGAN * 100;
        var wa = $scope.formData.WA;

        $scope.formData.AREA_WA = rai + ngan + wa;
    }

    $scope.getCustRelation = function () {
        var deferred = $q.defer();

        radasoft.getCustRelation({ FILTER: '' }).then(function (response) {
            $scope.selectCustRelaction = response.data;
        }).finally(function () {
            deferred.resolve();
        });

        return deferred.promise;
    }

    $scope.getAcquireVia = function () {
        var deferred = $q.defer();

        radasoft.getAcquireVia({ FILTER: '' }).then(function (response) {
            $scope.selectAcquiredVia = response.data;
        }).finally(function () {
            deferred.resolve();
        });

        return deferred.promise;
    }

    $scope.getCountry = function () {
        radasoft.getCountry({}).then(function (response) {
            $scope.selectCountry = response.data;

            $scope.getProvince();
        });
    }

    $scope.onProvinceChange = function (item, model) {
        $scope.clearDistrict();

        $scope.getDistrict(item, model);
    }

    $scope.getProvince = function () {
        radasoft.getProvince({}).then(function (response) {
            $scope.selectProvince = response.data;
            $scope.selectOutCityPlanProvince = response.data;
            if ($scope.IS_PROJECT) {
                radasoft.getZoneByProject({ PROJECT_RUNNING_ID: $scope.requestData.PROJECT.PROJECT_RUNNING_ID }).then(function (response) {
                    $scope.selectProjectZone = response.data;
                });
            }
        });
    }

    $scope.getDistrict = function (item, model) {
        $scope.formData.LOC_PROVINCE = item;
        $scope.selectDistrict = [];
        $scope.selectSubDistrict = [];
        $scope.formData.DISTRICT = {};
        $scope.formData.SUBDISTRICT = {};
        radasoft.getDistrict({ PROVINCE_ID: item.PROV_ID }).then(function (response) {
            $scope.selectDistrict = response.data;
        });
    }

    $scope.getSubDistrict = function ($item, $model) {
        $scope.formData.LOC_CITY = $item;
        $scope.selectSubDistrict = [];
        $scope.formData.SUBDISTRICT = {};
        $scope.clearSubDistrict();

        radasoft.getSubDistrict({ PROVINCE_ID: $item.PROVINCE_ID, DISTRICT_ID: $item.CITY_ID }).then(function (response) {
            $scope.selectSubDistrict = response.data;
        });
    }

    $scope.clearDistrict = function () {
        $scope.formData.DEED_CITY = null;

        $scope.clearSubDistrict();
    }
    $scope.clearSubDistrict = function () {
        $scope.formData.DEED_DISTRICT = null;
    }

    $scope.onSubDistrictChange = function ($item, $model) {
        //$scope.formData.LOC_DISTRICT = $item;
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

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
            $scope.save($scope.formData, style);
        }
    };

    $scope.save = function (item, style) {

        var data = {
            headCol: $scope.headCol,
            botColForm: $scope.botColForm,
            subColl: item
        };

        radasoft.confirmAndSave($translate.instant('CONFIRM.SAVE'), '', function (isconfirmed) {
            if (isconfirmed) {
                radasoft.setSubCol(data).then(function (response) {
                    radasoft.success();
                    $modalInstance.close(response);
                });
            }
        });
    }

    $scope.openColCus = function (item) {
        $modal.open({
            backdrop: 'static',
            keyboard: false,
            //backdropClass: 'bg-blue',
            //openedClass: 'aaaaa',
            templateUrl: 'app/views/test/subcol/000001.html',
            controller: 'subform0203Controller',
            //windowClass: 'app-modal-window-80',
            size: 'md',
            resolve: {
                params: function () {
                    return {
                        formData: item,
                        custRelation: $scope.selectCustRelaction,
                        acquireVia: $scope.selectAcquiredVia
                    };
                }
            }
        }).result.then(function (data) {
            var existing = $filter('filter')($scope.formData.COL_CUS, data.BCUS_COL_RUNNING_ID, true, 'BCUS_COL_RUNNING_ID')[0];

            if (existing == undefined) {
                $scope.formData.COL_CUS.push(data);
            } else {
                angular.copy(data, item);
            }
        });
    }

    $scope.addColCus = function () {
        $scope.openColCus({ BCUS_COL_RUNNING_ID: -Math.round((Math.random() * 100000)) });
    }

    $scope.editColCus = function (item) {
        $scope.openColCus(item);
    }

    $scope.deleteColCus = function (item) {
        radasoft.confirmAndSave($translate.instant('CONFIRM.DELETE'), '', function (isconfirmed) {
            if (isconfirmed) {
                radasoft.deleteColCus(item).then(function (response) {
                    $scope.formData.COL_CUS = $.grep($scope.formData.COL_CUS, function (i) { return i.BCUS_COL_RUNNING_ID != item.BCUS_COL_RUNNING_ID; })
                    radasoft.success();
                });
            }
        });
    }

    $scope.qGetDistrict = function (PROV_ID) {
        var deferred = $q.defer();

        radasoft.getDistrict({
            PROVINCE_ID: PROV_ID || ''
        }).then(function (response) {
            $scope.selectDistrict = response.data;
        }).finally(function () {
            deferred.resolve();
        });

        return deferred.promise;
    }
    $scope.qGetSubDistrict = function (PROV_ID, CITY_ID) {
        var deferred = $q.defer();

        radasoft.getSubDistrict({
            PROVINCE_ID: PROV_ID || '',
            DISTRICT_ID: CITY_ID || ''
        }).then(function (response) {
            $scope.selectSubDistrict = response.data;
        }).finally(function () {
            deferred.resolve();
        });

        return deferred.promise;
    }

    $scope.getSubCol = function (formData) {
        var deferred = $q.defer();

        var params = {
            COL_FORM_ID: $scope.botColForm.COL_FORM_ID,
            HEAD_COL_RUNNING_ID: $scope.headCol.HEAD_COL_RUNNING_ID,
            JOB_RUNNING_ID: $scope.headCol.JOB_RUNNING_ID,
            formData: formData
        };

        radasoft.getSubCol(params).then(function (response) {
            deferred.resolve(response);
        });

        return deferred.promise;
    }

    $scope.openDatePicker = function ($event, elementOpened) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.dpOpenState[elementOpened] = !$scope.dpOpenState[elementOpened];
    }

    $scope.getDeedOffice = function () {
        var deferred = $q.defer();

        radasoft.getDeedOffice({}).then(function (response) {
            $scope.selectDeedOffice = response.data;
            deferred.resolve(response);
        });

        return deferred.promise;
    }

    $scope.getInsuredCode = function () {
        var deferred = $q.defer();

        radasoft.getInsuredCode({}).then(function (response) {
            $scope.selectInsuredCode = response.data;
            deferred.resolve(response);
        });

        return deferred.promise;
    }

    $scope.initSubColData = function () {
        switch (parseInt($scope.headCol.HEAD_COL_TYPE_ID)) {
            case 286003:
                $scope.getPropShape();
                break;//ที่ดิน
            case 286004:
                break;//อาคารสิ่งปลูกสร้าง
            case 286005:
                $scope.getDeedOffice();
                break;//สิทธิการเช่า
            case 286066:
                break;//คอนโดมิเนียม/อาคารชุด/ห้องชุด
            case 286011:
                break;//เครื่องจักร
            case 286038:
                $scope.getInsuredCode();
                break;//รถยนต์
            case 286039:
                $scope.getInsuredCode();
                break;//เรือ
            case 999999:
                break;//อื่นๆ 
        }
    }

    $scope.init = function () {
        $scope.getCountry();

        var province = $scope.formData.DEED_PROVINCE || { PROV_ID: '' };
        var district = $scope.formData.DEED_CITY || { CITY_ID: '' };

        $scope.getSubCol($scope.formData).then(function (response) {
            $scope.formData = response.data;

            if ($scope.formData.SUB_TYPE && $scope.formData.SUB_TYPE.CODE == null) {
                $scope.formData.SUB_TYPE = undefined;
            }

            $scope.qGetDistrict(province.PROV_ID).then(function () {
                $scope.qGetSubDistrict(province.PROV_ID, district.CITY_ID).then(function () {
                    $scope.getAcquireVia().then(function () {
                        $scope.getCustRelation().then(function () {
                            $scope.initSubColData();
                        });
                    });
                });
            });
        });
    }

    $scope.init();
}]);

app.controller('subform0203Controller', ['$scope', '$state', 'toaster', '$modal', '$translate', 'SweetAlert', '$modalInstance', 'radasoft', 'params', function ($scope, $state, toaster, $modal, $translate, SweetAlert, $modalInstance, radasoft, params) {
    $scope.ldloading = {};
    $scope.btnDisabled = false;
    $scope.btnSubmitDisabled = false;

    $scope.labelControlCss = 'col-sm-3 control-label';
    $scope.formControlCss = 'col-sm-8 no-padding';

    $scope.formData = angular.copy(params.formData);

    $scope.selectAcquiredVia = params.acquireVia || [];
    $scope.selectCusRelation = params.custRelation || [];

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
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
            $scope.save($scope.formData, style);
        }
    };
    $scope.save = function () {
        $modalInstance.close($scope.formData);
    }
}]);