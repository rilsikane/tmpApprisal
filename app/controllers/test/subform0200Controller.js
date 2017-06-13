app.controller('costBuildingController', ['$scope', '$state', 'toaster', '$modal', '$translate', 'SweetAlert', '$modalInstance', 'radasoft', 'params', function ($scope, $state, toaster, $modal, $translate, SweetAlert, $modalInstance, radasoft, params) {
    $scope.includeUrl = params.includeUrl;
    $scope.title = $translate.instant('COST');
    $scope.showBtnSave = false;
    $scope.showBtnDelete = false;
    $scope.tab = params.tab;
    $scope.headCol = params.headCol;
    $scope.subCol = params.subCol;
    $scope.subcolCost = [];

    $scope.inputDisabled = true;

    $scope.depreciation = [];

    if ($scope.tab.update) {
        $scope.showBtnSave = true;
        $scope.inputDisabled = false;
    }
    $scope.getDepreciationValue = function (cost, plan) {
        radasoft.getDepreciationValue({
            DEP_PLAN: plan == undefined ? cost.DEPLICIATIONSET == undefined ? 0 : cost.DEPLICIATIONSET.VALUE : plan.VALUE,
            DEP_YEAR: cost.AGE
        }).then(function (response) {
            if (response.data != null) {
                cost.DEPLICIATIONPERCENT = response.data.DEP_PERCENT;
                $scope.calSubColCost(cost);
            }
        });
    }
    $scope.delete = function (item) {
        item.IS_DELETE = true;
    }
    $scope.add = function () {
        SweetAlert.swal({
            title: "รายละเอียด",
            //text: "Write something interesting:",
            type: "input",
            showCancelButton: true,
            closeOnConfirm: true,
            animation: "slide-from-top"
            //inputPlaceholder: "Write something"
        },
        function (inputValue) {
            if (inputValue === false) return false;

            if (inputValue === "") {
                swal.showInputError("กรุณากรอกรายละเอียด");
                return false
            }

            $scope.subcolCost.push({
                CAB_RUNNING_ID: 0,
                HEAD_COL_RUNNING_ID: $scope.headCol.HEAD_COL_RUNNING_ID,
                BUILDING_COL_RUNNING_ID: $scope.subCol.BUILDING_COL_RUNNING_ID,
                HEAD_COL_CODE: '-',
                SUB_COL_CODE: '-',
                DETAIL: inputValue,
                AREA: 0,
                UNITPRICE: 0,
                TOTALPRICE: 0,
                AGE: 0,
                DEPLICIATIONPERYEAR: 0,
                DEPLICIATIONPERCENT: 0,
                DEPLICIATIONPRICE: 0,
                AFTERDEPLICIATIONPRICE: 0,
                DEPLICIATIONPRICEUNIT: 0,
                MANUAL: true
            });
        });
    }

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
            if (cost.DEPLICIATIONPERYEAR > 0) {
                cost.DEPLICIATIONPERCENT = cost.DEPLICIATIONPERYEAR * cost.AGE;
            }

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
            $scope.setCost();
        }
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.init = function () {
        radasoft.getDepreciation({}).then(function (response) {
            $scope.depreciation = response.data;
            $scope.getCost();
        });
    }

    $scope.init();
}]);

app.controller('subform0202Controller', ['$scope', '$state', 'toaster', '$modal', '$translate', 'SweetAlert', '$modalInstance', 'radasoft', 'params', '$filter', '$q', '$rootScope', function ($scope, $state, toaster, $modal, $translate, SweetAlert, $modalInstance, radasoft, params, $filter, $q, $rootScope) {
    $scope.tab = params.tab;
    $scope.dpOpenState = {};
    $scope.displayAllFiled = true;
    $scope.ldloading = {};
    $scope.btnDisabled = false;
    $scope.btnSubmitDisabled = true;
    $scope.inputDisabled = true;
    $scope.labelControlCss = 'col-sm-4 control-label';
    $scope.formControlCss = 'col-sm-8';
    $scope.colCertTypeUrl = '';

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
    $scope.radioRentType = [{ VALUE: 'L', NAME: 'เช่าที่ดิน' }, { VALUE: 'B', NAME: 'เช่าอาคาร' }];
    $scope.radioDecorated = [
        { VALUE: 1, NAME: $translate.instant('ตกแต่งพร้อมอยู่') }
        , { VALUE: 2, NAME: $translate.instant('ตกแต่งบางส่วน') }
        , { VALUE: 3, NAME: $translate.instant('ยังไม่ตกแต่ง') }];
    $scope.radioDeveloper = [
        { VALUE: 1, NAME: $translate.instant('บริษัทที่อยู่ในตลาดหลักทรัพย์') }
        , { VALUE: 2, NAME: $translate.instant('บริษัทอยู่นอกตลาด') }
        , { VALUE: 3, NAME: $translate.instant('ผู้รับเหมาก่อสร้าง') }];
    $scope.radioContructComplete = [{ VALUE: '0', NAME: 'ยังไม่เสร็จ' }, { VALUE: '1', NAME: 'เสร็จแล้ว' }, { VALUE: '2', NAME: 'แล้วเสร็จ (%)' }];
    $scope.radioInsureYN = [{ VALUE: 'Y', NAME: 'ทำประกัน' }, { VALUE: 'N', NAME: 'ไม่ทำประกัน' }];
    $scope.radioBound = [{ VALUE: '1', NAME: 'ตรวจสอบแปลงคง' }, { VALUE: '2', NAME: 'ตรวจสอบจากระวาง' }];
    $scope.radioBoundFound = [{ VALUE: '1', NAME: 'ถูกต้อง' }, { VALUE: '2', NAME: 'คลาดเคลื่อน' }, { VALUE: '3', NAME: 'ไม่พบ' }, { VALUE: '4', NAME: 'อ่านไม่ออก' }];
    $scope.radioRegisYN = [{ VALUE: 'Y', NAME: 'จดทะเบียน' }, { VALUE: 'N', NAME: 'ไม่จดทะเบียน' }];

    $scope.selectOutCityPlanProvince = [];
    $scope.selectCountry = [];
    $scope.selectProvince = [];
    $scope.selectDistrict = [];
    $scope.selectSubDistrict = [];
    //$scope.selectLevelLandFill = [];
    $scope.radioHousingType = [{ VALUE: '1', NAME: 'อยู่เอง' }, { VALUE: '2', NAME: 'ให้เช่า' }];
    $scope.selectBrand = [];
    $scope.selectCustRelaction = [];
    $scope.selectAcquiredVia = [];
    $scope.selectInsuredCode = [];
    $scope.selectPropShape = [];
    $scope.SURVEY_CHKBUILD = [];
    $scope.ONST_COMPLETE = [];
    $scope.EVALUATE_PLAN = [];

    $scope.selectProvinceDOL = [];
    $scope.selectDistrictDOL = [];
    $scope.selectSubDistrictDOL = [];

    $scope.selectUseCityPlan = [];
    $scope.selectBuildType = [];
    $scope.selectLandRentType = [];

    if ($scope.tab.update || $scope.tab.create) {
        $scope.btnSubmitDisabled = false;
        $scope.inputDisabled = false;
    }

    $scope.onSubTypeChange = function ($item, $model) {
        //console.log($item);
        if ($item.MAIN_CODE == '286005') {
            if ($item.CODE == '14') {
                $scope.formData.RENT_TYPE = 'B';
                $scope.formData.APPR_CUR_OTHER_AREA = $scope.formData.USAGE_AREA;
            } else if ($item.CODE == '15') {
                $scope.formData.RENT_TYPE = 'L';
                $scope.formData.APPR_CUR_OTHER_AREA = $scope.formData.AREA_WA;
            }
        } else if ($item.MAIN_CODE == '286003') {
            $scope.colCertTypeUrl = '/app/views/test/subcol/' + radasoft.transformColCertType($item.CODE) + '.html';
            $scope.formData.COL_NO = '';
            $scope.formData.RAWANG = '';
            $scope.formData.LAND_NO = '';
            $scope.formData.SURVEY_NO = '';
            $scope.formData.BOOK_NO = '';
            $scope.formData.PAGE_NO = '';
            $scope.formData.AIRIAL_PHOTO_NO = '';
            $scope.formData.AIRIAL_CODE_NO = '';
            $scope.formData.AIRIAL_SHEET_NO = '';
            $scope.formData.DEED_PROVINCE = undefined;
            $scope.formData.DEED_CITY = undefined;
            $scope.formData.DEED_DISTRICT = undefined;
            $scope.formData.DEED_DISTRICT_OLD = '';
        } else if ($item.MAIN_CODE == '286006') {
            $scope.colCertTypeUrl = '/app/views/test/subcol/' + radasoft.transformColCertType($item.CODE) + '.html';
            $scope.formData.COL_NO = '';
            $scope.formData.RAWANG = '';
            $scope.formData.LAND_NO = '';
            $scope.formData.SURVEY_NO = '';
            $scope.formData.BOOK_NO = '';
            $scope.formData.PAGE_NO = '';
            $scope.formData.AIRIAL_PHOTO_NO = '';
            $scope.formData.AIRIAL_CODE_NO = '';
            $scope.formData.AIRIAL_SHEET_NO = '';
            $scope.formData.DEED_PROVINCE = undefined;
            $scope.formData.DEED_CITY = undefined;
            $scope.formData.DEED_DISTRICT = undefined;
            $scope.formData.DEED_DISTRICT_OLD = '';
        }
    }
    $scope.onCondoColCertTypeChange = function (item) {
        $scope.formData.COL_NO = '';
        $scope.formData.RAWANG = '';
        $scope.formData.LAND_NO = '';
        $scope.formData.SURVEY_NO = '';
        $scope.formData.BOOK_NO = '';
        $scope.formData.PAGE_NO = '';
        $scope.formData.AIRIAL_PHOTO_NO = '';
        $scope.formData.AIRIAL_CODE_NO = '';
        $scope.formData.AIRIAL_SHEET_NO = '';
        $scope.formData.DEED_PROVINCE = undefined;
        $scope.formData.DEED_CITY = undefined;
        $scope.formData.DEED_DISTRICT = undefined;
        $scope.formData.DEED_DISTRICT_OLD = '';

        $scope.colCertTypeUrl = '/app/views/test/subcol/' + radasoft.transformColCertType(item.VALUE) + '.html';
    }
    $scope.onRentColCertTypeChange = function (item) {
        $scope.formData.COL_NO = '';
        $scope.formData.RAWANG = '';
        $scope.formData.LAND_NO = '';
        $scope.formData.SURVEY_NO = '';
        $scope.formData.BOOK_NO = '';
        $scope.formData.PAGE_NO = '';
        $scope.formData.AIRIAL_PHOTO_NO = '';
        $scope.formData.AIRIAL_CODE_NO = '';
        $scope.formData.AIRIAL_SHEET_NO = '';
        $scope.formData.DEED_PROVINCE = undefined;
        $scope.formData.DEED_CITY = undefined;
        $scope.formData.DEED_DISTRICT = undefined;
        $scope.formData.DEED_DISTRICT_OLD = '';

        $scope.colCertTypeUrl = '/app/views/test/subcol/' + radasoft.transformColCertType(item.VALUE) + '.html';
    }
    $scope.onMachineRegisChange = function () {
        $scope.formData.REGIS_NO = '';
    }
    $scope.initCondoMasterData = function () {
        radasoft.getProvinceDOL({}).then(function (response) {
            $scope.selectProvinceDOL = response.data;
            radasoft.getDistrictDOL({
                PROVINCE_ID: $scope.formData.DEED_PROVINCE ? $scope.formData.DEED_PROVINCE.PROV_ID : ''
            }).then(function (response) {
                $scope.selectDistrictDOL = response.data;
                radasoft.getSubDistrictDOL({
                    PROVINCE_ID: $scope.formData.DEED_PROVINCE ? $scope.formData.DEED_PROVINCE.PROV_ID : '',
                    DISTRICT_ID: $scope.formData.DEED_CITY ? $scope.formData.DEED_CITY.CITY_ID : ''
                }).then(function (response) {
                    $scope.selectSubDistrictDOL = response.data;

                    radasoft.getProvince({}).then(function (response) {
                        $scope.selectProvince = response.data;
                        radasoft.getDistrict({
                            PROVINCE_ID: $scope.formData.CONDO_PROVINCE ? $scope.formData.CONDO_PROVINCE.PROV_ID : ''
                        }).then(function (response) {
                            $scope.selectDistrict = response.data;
                            radasoft.getSubDistrict({
                                PROVINCE_ID: $scope.formData.CONDO_PROVINCE ? $scope.formData.CONDO_PROVINCE.PROV_ID : '',
                                DISTRICT_ID: $scope.formData.CONDO_CITY ? $scope.formData.CONDO_CITY.CITY_ID : ''
                            }).then(function (response) {
                                $scope.selectSubDistrict = response.data;

                                $scope.getHeadColSubType({ "VALUE": "286003" }).then(function (data) {
                                    $scope.colCertTypes = data;

                                    //if ($scope.IS_PROJECT) {
                                    //    radasoft.getZoneByProject({ PROJECT_RUNNING_ID: $scope.requestData.PROJECT.PROJECT_RUNNING_ID }).then(function (response) {
                                    //        $scope.selectProjectZone = response.data;
                                    //    });
                                    //}
                                });
                            });
                        });
                    });

                });
            });
        });
    }

    $scope.initRentMasterData = function () {
        $scope.getDeedOffice().then(function () {
            radasoft.getSurveyChkBuild().then(function (response) {
                $scope.SURVEY_CHKBUILD = response.data;
                radasoft.getOnstComplete().then(function (response) {
                    $scope.ONST_COMPLETE = response.data;
                    radasoft.getEvaluatePlan().then(function (response) {
                        $scope.EVALUATE_PLAN = response.data;

                        radasoft.getProvinceDOL({}).then(function (response) {
                            $scope.selectProvinceDOL = response.data;
                            radasoft.getDistrictDOL({
                                PROVINCE_ID: $scope.formData.DEED_PROVINCE ? $scope.formData.DEED_PROVINCE.PROV_ID : ''
                            }).then(function (response) {
                                $scope.selectDistrictDOL = response.data;
                                radasoft.getSubDistrictDOL({
                                    PROVINCE_ID: $scope.formData.DEED_PROVINCE ? $scope.formData.DEED_PROVINCE.PROV_ID : '',
                                    DISTRICT_ID: $scope.formData.DEED_CITY ? $scope.formData.DEED_CITY.CITY_ID : ''
                                }).then(function (response) {
                                    $scope.selectSubDistrictDOL = response.data;

                                    $scope.getHeadColSubType({ "VALUE": "286003" }).then(function (data) {
                                        $scope.colCertTypes = data;

                                        radasoft.getLandRentType({}).then(function (response) {
                                            $scope.selectLandRentType = response.data;
                                            radasoft.getBuildType({}).then(function (response) {
                                                $scope.selectBuildType = response.data;
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    }

    $scope.initLandMasterData = function () {
        radasoft.getPropShape({}).then(function (response) {
            $scope.selectPropShape = response.data;
            radasoft.getProvince({}).then(function (response) {
                $scope.selectProvince = response.data;
                radasoft.getProvinceDOL({}).then(function (response) {
                    $scope.selectProvinceDOL = response.data;
                    radasoft.getDistrictDOL({
                        PROVINCE_ID: $scope.formData.DEED_PROVINCE ? $scope.formData.DEED_PROVINCE.PROV_ID : ''
                    }).then(function (response) {
                        $scope.selectDistrictDOL = response.data;
                        radasoft.getSubDistrictDOL({
                            PROVINCE_ID: $scope.formData.DEED_PROVINCE ? $scope.formData.DEED_PROVINCE.PROV_ID : '',
                            DISTRICT_ID: $scope.formData.DEED_CITY ? $scope.formData.DEED_CITY.CITY_ID : ''
                        }).then(function (response) {
                            $scope.selectSubDistrictDOL = response.data;

                            //if ($scope.IS_PROJECT) {
                            //    radasoft.getZoneByProject({ PROJECT_RUNNING_ID: $scope.requestData.PROJECT.PROJECT_RUNNING_ID }).then(function (response) {
                            //        $scope.selectProjectZone = response.data;
                            //    });
                            //}
                        });
                    });
                });
            });
        });
    }

    $scope.initBuildMasterData = function () {
        radasoft.getProvince({}).then(function (response) {
            $scope.selectProvince = response.data;
            radasoft.getDistrict({
                PROVINCE_ID: $scope.formData.DEED_PROVINCE ? $scope.formData.DEED_PROVINCE.PROV_ID : ''
            }).then(function (response) {
                $scope.selectDistrict = response.data;
                radasoft.getSubDistrict({
                    PROVINCE_ID: $scope.formData.DEED_PROVINCE ? $scope.formData.DEED_PROVINCE.PROV_ID : '',
                    DISTRICT_ID: $scope.formData.DEED_CITY ? $scope.formData.DEED_CITY.CITY_ID : ''
                }).then(function (response) {
                    $scope.selectSubDistrict = response.data;

                    radasoft.getBuildType({}).then(function (response) {
                        $scope.selectBuildType = response.data;
                    });
                });
            });
        });
    }

    $scope.initLandBuildMasterData = function () {

    }

    $scope.initCarMasterData = function () {

        $scope.getInsuredCode().then(function () {
            radasoft.getProvince({}).then(function (response) {
                $scope.selectProvince = response.data;

                radasoft.getBrand({}).then(function (response) {
                    $scope.selectBrand = response.data;
                });
            });
        });
    }

    $scope.initShipMasterData = function () {
        $scope.getInsuredCode().then(function () {
            radasoft.getProvince({}).then(function (response) {
                $scope.selectProvince = response.data;
            });
        });
    }

    $scope.initOtherMasterData = function () {
        //if ($scope.IS_PROJECT) {
        //    radasoft.getZoneByProject({ PROJECT_RUNNING_ID: $scope.requestData.PROJECT.PROJECT_RUNNING_ID }).then(function (response) {
        //        $scope.selectProjectZone = response.data;
        //    });
        //}
        $scope.getHeadColSubType({ "VALUE": "286003" }).then(function (data) {
            $scope.colCertTypes = data.filter(function (x) { return x.VALUE != ""; });
            if (!$scope.formData.COL_CERT_TYPE || $scope.formData.COL_CERT_TYPE == null || !$scope.formData.COL_CERT_TYPE.VALUE) {
                $scope.formData.COL_CERT_TYPE = data.filter(function (x) { return x.VALUE == "1"; })[0];
            }
            $scope.initLandMasterData();
        });
    }

    $scope.delRentPermit = function (item) {
        item.DELETE = true;
        $scope.updatePERMIT_LICENSE_CNT();
    }
    $scope.addRentPermit = function () {
        $scope.rentPermitEditor({ RPERMIT_COL_RUNNING_ID: -Math.round(Math.random() * 100000) }).result.then(function (data) {
            $scope.formData.RENT_PERMIT.push(data)
        }).finally(function () {
            $scope.updatePERMIT_LICENSE_CNT();
        });
    }
    $scope.modRentPermit = function (item) {
        $scope.rentPermitEditor(item).result.then(function (data) {
            angular.copy(data, item);
        }).finally(function () {
            $scope.updatePERMIT_LICENSE_CNT();
        });
    }
    $scope.updatePERMIT_LICENSE_CNT = function () {
        var counter = 1;
        angular.forEach($scope.formData.RENT_PERMIT, function (item) {
            if (!item.DELETE) {
                item.PERMIT_LICENSE_CNT = counter;
                counter++;
            }
        });
    }
    $scope.rentPermitEditor = function (item) {
        return radasoft.openDialog({
            controller: 'rentPermitCtrl',
            resolve: {
                params: function () {
                    return {
                        formData: item
                    };
                }
            }
        });
    }

    $scope.addLandMark = function () {
        $scope.landMarkEditor({ LANDMARK_COL_RUNNING_ID: -Math.round(Math.random() * 100000) }).result.then(function (data) { $scope.formData.LANDMARK.push(data) });
    }
    $scope.modLandMark = function (item) {
        $scope.landMarkEditor(item).result.then(function (data) { angular.copy(data, item); });
    }
    $scope.landMarkEditor = function (item) {
        return radasoft.openDialog({
            controller: 'landMarkCtrl',
            resolve: {
                params: function () {
                    return {
                        formData: item
                    };
                }
            }
        });
    }

    $scope.addFloor = function () {
        $scope.formData.BUILDING_FLOOR.push({
            BFLOOR_COL_RUNNING_ID: -Math.round((Math.random() * 10000)),
            DSC_FLOORNAME: '',
            DSC_FLOORXSZ: '',
            USAGE_FLOOR: ''
        });
    }

    $scope.calLandPrice = function () {
        $scope.formData.APPR_CUR_LAND_AMOUNT = $scope.formData.AREA_WA * $scope.formData.APPR_CUR_LAND_PRICE;
    }

    $scope.calLandArea = function () {
        var rai = $scope.formData.RAI * 400;
        var ngan = $scope.formData.NGAN * 100;
        var wa = $scope.formData.WA;

        $scope.formData.AREA_WA_TOTAL = rai + ngan + wa;
        $scope.formData.AREA_WA = $scope.formData.AREA_WA_TOTAL - $scope.formData.AREA_WA_UNUSE;

        switch ($scope.headCol.HEAD_COL_TYPE_ID) {
            case '286005'://สิทธิการเช่า
                $scope.formData.APPR_CUR_OTHER_AREA = $scope.formData.AREA_WA_TOTAL;
                break;
        }
    }
    $scope.onRentUsageAreaChange = function () {
        $scope.formData.APPR_CUR_OTHER_AREA = $scope.formData.USAGE_AREA;
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

            //$scope.getProvince();
        });
    }

    $scope.onProvinceChange = function (item, model) {
        //$scope.clearDistrict();
        $scope.getDistrict(item, model);
    }

    $scope.onProvinceDOLChange = function (item, model) {
        //$scope.clearDistrict();
        $scope.getDistrictDOL(item, model);
    }

    $scope.getProvince = function () {
        radasoft.getProvince({}).then(function (response) {
            $scope.selectProvince = response.data;
            $scope.selectOutCityPlanProvince = response.data;
            //if ($scope.IS_PROJECT) {
            //    radasoft.getZoneByProject({ PROJECT_RUNNING_ID: $scope.requestData.PROJECT.PROJECT_RUNNING_ID }).then(function (response) {
            //        $scope.selectProjectZone = response.data;
            //    });
            //}
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

    $scope.getProvinceDOL = function () {
        radasoft.getProvinceDOL({}).then(function (response) {
            $scope.selectProvinceDOL = response.data;
        });
    }
    $scope.getDistrictDOL = function (item, model) {
        //$scope.formData.LOC_PROVINCE = item;
        $scope.selectDistrictDOL = [];
        $scope.selectSubDistrictDOL = [];
        $scope.formData.DEED_CITY = {};
        $scope.formData.DEED_DISTRICT = {};
        radasoft.getDistrictDOL({ PROVINCE_ID: item.PROV_ID }).then(function (response) {
            $scope.selectDistrictDOL = response.data;
        });
    }
    $scope.getSubDistrictDOL = function ($item, $model) {
        //$scope.formData.LOC_CITY = $item;
        $scope.selectSubDistrictDOL = [];
        $scope.formData.DEED_DISTRICT = {};

        radasoft.getSubDistrictDOL({ PROVINCE_ID: $item.PROVINCE_ID, DISTRICT_ID: $item.CITY_ID }).then(function (response) {
            $scope.selectSubDistrictDOL = response.data;
        });
    }

    $scope.clearDistrict = function () {
        //$scope.formData.DEED_CITY = null;

        //$scope.clearSubDistrict();
    }
    $scope.clearSubDistrict = function () {
        //$scope.formData.DEED_DISTRICT = null;
    }

    $scope.onSubDistrictDOLChange = function ($item, $model) {
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
            radasoft.alert($translate.instant('INVALID_INPUT_DATA'));
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
            templateUrl: '/app/views/test/subcol/000001.html',
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
        //switch (parseInt($scope.headCol.HEAD_COL_TYPE_ID)) {
        switch (parseInt($scope.botColForm.COL_FORM_ID)) {
            case 286003:
                $scope.initLandMasterData();
                break;//ที่ดิน
            case 286004:
                $scope.initBuildMasterData();
                break;//อาคารสิ่งปลูกสร้าง
            case 286005:
                $scope.initRentMasterData();
                break;//สิทธิการเช่า
            case 286006:
                $scope.initLandBuildMasterData();
                break;//ที่ดินพร้อมอาคารสิ่งปลูกสร้าง
            case 286066:
                $scope.initCondoMasterData();
                break;//คอนโดมิเนียม/อาคารชุด/ห้องชุด
            case 286011:
                $scope.initMachine();
                $scope.initDepliciation();
                break;//เครื่องจักร
            case 286038:
                $scope.initCarMasterData();
                $scope.initCarDepliciation();
                break;//รถยนต์
            case 286039:
                $scope.initShipMasterData();
                $scope.initDepliciation();
                break;//เรือ
            case 999999:
                $scope.initOtherMasterData();
                //$scope.initDepliciation();
                break;//อื่นๆ 
        }
    }

    $scope.init = function () {
        $scope.getCountry();

        var province = $scope.formData.DEED_PROVINCE || { PROV_ID: '' };
        var district = $scope.formData.DEED_CITY || { CITY_ID: '' };

        $scope.getSubCol($scope.formData).then(function (response) {
            $scope.formData = response.data;

            if ($scope.formData.COL_CERT_TYPE != null) {
                $scope.colCertTypeUrl = '/app/views/test/subcol/' + radasoft.transformColCertType($scope.formData.COL_CERT_TYPE.VALUE) + '.html';
            }

            if ($scope.formData.SUB_TYPE && $scope.formData.SUB_TYPE.CODE == null) {
                $scope.formData.SUB_TYPE = undefined;
            }

            $scope.qGetDistrict(province.PROV_ID).then(function () {
                $scope.qGetSubDistrict(province.PROV_ID, district.CITY_ID).then(function () {
                    $scope.getAcquireVia().then(function () {
                        $scope.getCustRelation().then(function () {
                            radasoft.getLandColor({}).then(function (response) {
                                $scope.selectUseCityPlan = response.data;

                                $scope.initSubColData();
                            });
                        });
                    });
                });
            });
        });
    }
    $scope.initDepliciation = function () {
        $scope.formData.REPLACEMENT_COST = $scope.formData.REPLACEMENT_COST | 0.0;
        $scope.formData.DEPLICIATIONPERCENT = $scope.formData.DEPLICIATIONPERCENT | 0.0;
        $scope.formData.DEPLICIATIONPRICE = $scope.formData.DEPLICIATIONPRICE | 0.0;
        $scope.formData.APPR_CUR_OTHER_AMOUNT = $scope.formData.APPR_CUR_OTHER_AMOUNT | 0.0;
        $scope.calDepliciation();

    }
    $scope.initCarDepliciation = function () {
        $scope.formData.REPLACEMENT_COST = $scope.formData.REPLACEMENT_COST | 0.0;
        $scope.formData.DEPLICIATIONPERCENT = $scope.formData.DEPLICIATIONPERCENT | 0.0;
        $scope.formData.DEPLICIATIONPRICE = $scope.formData.DEPLICIATIONPRICE | 0.0;
        $scope.formData.APPR_CUR_OTHER_AMOUNT = $scope.formData.APPR_CUR_OTHER_AMOUNT | 0.0;
        $scope.calCarDepliciation();

    }
    $scope.calDepliciation = function () {
        $scope.formData.APPR_CUR_NET_TOTAL = $scope.formData.REPLACEMENT_COST - $scope.formData.DEPLICIATIONPRICE;
    }
    $scope.calCarDepliciation = function () {
        $scope.formData.APPR_CUR_OTHER_AMOUNT = $scope.formData.REPLACEMENT_COST - $scope.formData.DEPLICIATIONPRICE;
    }
    $scope.initMachine = function () {
        $scope.radioMachineOperation = [{ VALUE: 'S', NAME: 'Stand alone' }, { VALUE: 'L', NAME: 'Line ผลิต' }];
    }
    $scope.onShipRegisChange = function () {
        if ('N' == $scope.formData.REGIS_YN) {
            $scope.formData.REGIS_NO = "-";
        } else {
            $scope.formData.REGIS_NO = "";
        }
    }
    $scope.onShipInsureChange = function () {
        if ($scope.formData.IS_INSURANCE == 'N') {
            $scope.formData.INSURED_CODE = undefined;
            $scope.formData.POLICY_NO = '';
            $scope.formData.INSURED_AMT = 0;
            $scope.formData.INSURED_ISSUE_DATE = undefined;
            $scope.formData.INSURED_EXP_DATE = undefined;
        }
    }
    $scope.getHeadColSubType = function (headColType) {
        var deferred = $q.defer();
        radasoft.getHeadColSubType({ MAIN_CODE: headColType.VALUE }).then(function (response) {
            deferred.resolve(response.data);
        })

        return deferred.promise;
    }
    $scope.onColCertTypesChange = function () {
        $scope.formData.COL_NO = undefined;
        $scope.formData.SCHOLAR_NO = undefined;
        $scope.formData.RAWANG = undefined;
        $scope.formData.BOOK_NO = undefined;
        $scope.formData.PAGE_NO = undefined;
        $scope.formData.LAND_NO = undefined;
        $scope.formData.AIRIAL_PHOTO_NO = undefined;
        $scope.formData.AIRIAL_CODE_NO = undefined;
        $scope.formData.AIRIAL_SHEET_NO = undefined;
        $scope.formData.SURVEY_NO = undefined;
        $scope.formData.SURVEY_NO = undefined;
    }
    $scope.onCarInsureChange = function(){
        $scope.formData.INSURED_CODE = undefined;
        $scope.formData.POLICY_NO = undefined;
        $scope.formData.INSURED_AMT = undefined;
        $scope.formData.INSURED_AMT = undefined;
    }

    $scope.init();
}]);

app.controller('subform0203Controller', ['$scope', '$state', 'toaster', '$modal', '$translate', 'SweetAlert', '$modalInstance', 'radasoft', 'params', function ($scope, $state, toaster, $modal, $translate, SweetAlert, $modalInstance, radasoft, params) {
    $scope.ldloading = {};
    $scope.btnDisabled = false;
    $scope.btnSubmitDisabled = false;

    $scope.labelControlCss = 'col-sm-3 control-label';
    $scope.formControlCss = 'col-sm-8';

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

app.controller('landMarkCtrl', ['$scope', '$translate', '$modalInstance', 'radasoft', 'params', function ($scope, $translate, $modalInstance, radasoft, params) {
    $scope.includeUrl = '/app/views/test/subcol/000003.html';
    $scope.showBtnSave = true;
    $scope.title = $translate.instant('LANDMARK');

    $scope.formData = angular.copy(params.formData);

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
            $modalInstance.close($scope.formData);
        }
    };
}]);

app.controller('rentPermitCtrl', ['$scope', '$translate', '$modalInstance', 'radasoft', 'params', function ($scope, $translate, $modalInstance, radasoft, params) {
    $scope.includeUrl = '/app/views/test/subcol/000005.html';
    $scope.showBtnOK = true;
    $scope.title = $translate.instant('RENTPERMIT');
    $scope.dpOpenState = {};

    $scope.formData = angular.copy(params.formData);

    $scope.openDatePicker = function ($event, elementOpened) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.dpOpenState[elementOpened] = !$scope.dpOpenState[elementOpened];
    }

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
            $modalInstance.close($scope.formData);
        }
    };
}]);