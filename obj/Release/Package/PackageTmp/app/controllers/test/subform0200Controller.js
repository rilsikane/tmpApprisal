//app.controller('subform0200Controller', ['$scope', '$state', 'toaster', '$modal', '$translate', 'SweetAlert', 'radasoft', '$filter', '$log', function ($scope, $state, toaster, $modal, $translate, SweetAlert, radasoft, $filter, $log) {
//    $scope.colleteralUsageType = [];
//    $scope.collType = [];
//    $scope.colleterals = [];
//    $scope.riskcde = [];
//    $scope.energyType = [];
//    $scope.roadType = [];
//    $scope.landScape = [];
//    $scope.materialFloor = [];
//    $scope.brand = [];
//    $scope.btnDisabled = false;
//    $scope.inputDisabled = false;

//    $scope.iconSplit = 'fa fa-bolt';
//    $scope.iconEdit = 'fa fa-pencil';
//    $scope.iconDelete = 'fa fa-times';

//    $scope.css_th_1 = 'col-sm-2';
//    $scope.css_th_2 = 'col-sm-2';
//    $scope.css_th_3 = 'col-sm-2';
//    $scope.css_th_4 = 'col-sm-2';
//    $scope.css_th_5 = 'col-sm-1';
//    $scope.css_th_6 = 'col-sm-2';
//    $scope.css_th_7 = 'col-sm-1';

//    $scope.appraisalButton = [
//    { id: 1, text: 'จัดเกรดหลักทรัพย์' },
//    { id: 1, text: 'จัดทำภาพถ่าย' },
//    { id: 1, text: 'ข้อมูลตลาด/แผนที่' },
//    { id: 1, text: 'WQS' },
//    { id: 1, text: 'ราคาต้นทุนสิ่งปลูกสร้าง' },
//    { id: 1, text: 'จัดทำภาพถ่าย' }
//    ];

//    if (!$scope.tab.create || !$scope.tab.update) {
//        $scope.btnDisabled = true;
//        $scope.inputDisabled = true;
//    }

//    $scope.$on('activateTab200', function (event, parameters) {
//        if ($scope.colleterals.length == 0) {
//            $scope.init();
//        }
//    });

//    $scope.getHeadColl = function () {
//        radasoft.getHeadColl({ DOC_ID: $scope.tab.DOC_ID }).then(function (response) {
//            $scope.colleterals = response.data;
//        });
//    }

//    $scope.init = function () {
//        radasoft.getColleteralType({ DOC_ID: $scope.tab.DOC_ID }).then(function (response) {
//            $scope.collType = response.data;
//            radasoft.getHeadColl({ DOC_ID: $scope.tab.DOC_ID }).then(function (response) {
//                //if (response.data.success) {
//                $scope.colleterals = response.data;

//                radasoft.getColleteralUsageType({}).then(function (response) {
//                    $scope.colleteralUsageType = response.data;

//                    radasoft.getRISKCDE().then(function (response) {
//                        $scope.riskcde = response.data;

//                        radasoft.getEnergyType({}).then(function (response) {
//                            $scope.energyType = response.data;

//                            radasoft.getRoadType({}).then(function (response) {
//                                $scope.roadType = response.data;

//                                radasoft.getLandScape({}).then(function (response) {
//                                    $scope.landScape = response.data;

//                                    radasoft.getMaterialFloor({}).then(function (response) {
//                                        $scope.materialFloor = response.data;

//                                        radasoft.getBrand({}).then(function (response) {
//                                            $scope.brand = response.data;
//                                        });
//                                    });
//                                });
//                            });
//                        });
//                    });
//                });
//                //}
//            });
//        });
//    }

//    $scope.deleteHeadCol = function (colleteral) {
//        radasoft.confirmAndSave($translate.instant('CONFIRM.DELETE'), '', function (isconfirmed) {
//            if (isconfirmed) {
//                radasoft.delHeadCol({ HEAD_COL_RUNNING_ID: colleteral.HEAD_COL_RUNNING_ID }).then(function (response) {
//                    $scope.getHeadColl();
//                    radasoft.success();
//                });
//            }
//        });
//    }

//    $scope.openHeadColEditor = function (colType, data) {
//        $modal.open({
//            templateUrl: 'app/views/test/subform0201.html',
//            controller: 'subform0201Controller',
//            backdrop: 'static',
//            keyboard: false,
//            //windowClass: 'app-modal-window-70',
//            size: 'lg',
//            resolve: {
//                params: function () {
//                    return {
//                        DOC_ID: $scope.tab.DOC_ID,
//                        COL_TYPE: colType,
//                        formData: data,
//                        requestData: $scope.$parent.formData
//                    };
//                }
//            }
//        }).result.then(function (data) {
//            $scope.getHeadColl();
//        });
//    }

//    $scope.openProject = function () {
//        $scope.openProjectPhaseZone($translate.instant('PROJECT'), true, false);
//    }

//    $scope.openPhaseZone = function () {
//        $scope.openProjectPhaseZone($translate.instant('PHASE_ZONE'), false, true);
//    }

//    $scope.openProjectPhaseZone = function (title, showProject, showPhaseZone) {
//        var params = {
//            title: title,
//            showProject: showProject,
//            showPhaseZone: showPhaseZone,
//            developer: $scope.$parent.formData.DEVELOPER != undefined && $scope.$parent.formData.DEVELOPER.DEV_RUNNING_ID > 0 ? $scope.$parent.formData.DEVELOPER : undefined,
//            project: $scope.$parent.formData.PROJECT != undefined && $scope.$parent.formData.PROJECT.PROJECT_RUNNING_ID > 0 ? $scope.$parent.formData.PROJECT : undefined
//        };

//        $modal.open({
//            templateUrl: 'app/views/project/popup.html',
//            controller: 'projectController',
//            backdrop: 'static',
//            keyboard: false,
//            //windowClass: 'app-modal-window-80',
//            size: 'lg',
//            resolve: {
//                params: function () {
//                    return params;
//                }
//            }
//        }).result.then(function (data) {
//            $scope.saveProjectData(data.developer, data.project);
//        });
//    }

//    $scope.saveProjectData = function (dev, proj) {
//        radasoft.confirmAndSave($translate.instant('CONFIRM.SAVE_PROJECT'), $translate.instant('SAVE_PROJECT_WARNNING'), function (isconfirmed) {
//            if (isconfirmed) {
//                radasoft.setFormDataProject({
//                    REQUEST_RUNNING_ID: $scope.$parent.formData.REQUEST_RUNNING_ID,
//                    DEVELOPER: dev,
//                    PROJECT: proj
//                }).then(function (response) {
//                    $scope.$parent.formData.DEVELOPER = dev;
//                    $scope.$parent.formData.PROJECT = proj;
//                    radasoft.success();
//                });
//            }
//        });
//    }

//    $scope.editSubCol = function (headCol, subCol) {

//        var botColForm = $filter('filter')(headCol.BOT_COL_FORM, subCol.HEAD_COL_TYPE, null, 'COL_FORM_ID')[0];

//        $scope.openSubCol(headCol, botColForm, subCol);
//    }

//    $scope.deleteSubCol = function (headCol, subCol) {
//        radasoft.confirmAndSave($translate.instant('CONFIRM.DELETE'), '', function (isconfirmed) {
//            if (isconfirmed) {
//                radasoft.deleteSubCol({ headCol: headCol, subCol: subCol }).then(function (response) {
//                    $scope.getHeadColl();
//                    radasoft.success();
//                });
//            }
//        });
//    }

//    $scope.openSubCol = function (colleteral, botColForm, data) {
//        //$log.debug(data);
//        var includeTemplateUrl1 = 'app/views/test/subcol/' + botColForm.COL_FORM_ID + '.html';
//        var includeTemplateUrl2 = 'app/views/test/subcol/000000.html';
//        $modal.open({
//            templateUrl: 'app/views/test/subform0202.html',
//            controller: 'subform0202Controller',
//            backdrop: 'static',
//            keyboard: false,
//            //windowClass: 'app-modal-window-80',
//            size: 'lg',
//            resolve: {
//                params: function () {
//                    return {
//                        headCol: colleteral,
//                        botColForm: botColForm,
//                        includeTemplateUrl1: includeTemplateUrl1,
//                        includeTemplateUrl2: includeTemplateUrl2,
//                        colleteralUsageType: $scope.colleteralUsageType,
//                        riskcde: $scope.riskcde,
//                        energyType: $scope.energyType,
//                        roadType: $scope.roadType,
//                        landScape: $scope.landScape,
//                        materialFloor: $scope.materialFloor,
//                        brand: $scope.brand,
//                        formData: data,
//                        requestData: $scope.$parent.formData
//                    };
//                }
//            }
//        }).result.then(function (data) {
//            $scope.getHeadColl();
//            radasoft.success();
//        });
//    }

//    $scope.openSubCol1 = function (colleteral, botColForm, data) {
//        $state.go('app.form.form2', { DOC_ID: $scope.tab.DOC_ID });
//    }

//    $scope.addHeadCol = function () {
//        $scope.openHeadColEditor();
//    }
//    $scope.editHeadCol = function (data) {
//        $scope.open(data.COL_TYPE, data);
//    }

//    $scope.addHeadCol = function (colType, subType) {
//        $scope.openHeadColEditor(colType, {
//            HEAD_COL_RUNNING_ID: 0,
//            DOC_ID: $scope.tab.DOC_ID,
//            HEAD_COL_TYPE_ID: colType.CODE,
//            HEAD_COL_DETAIL: colType.COL_TYPE,
//            HEAD_COL_SUB_TYPE_ID: '00',
//            COL_TYPE: colType,
//            GRADE_QNR_ID: colType.GRADE_QNR_ID,
//            DEED_COUNTRY: {
//                CODE: 'TH',
//                NAME_THAI: 'ไทย'
//            }
//        });
//    }

//    $scope.addSubCol = function (colleteral, botColForm) {
//        $scope.openSubCol(colleteral, botColForm, { IS_PROJECT: $scope.$parent.formData.JOB_TYPE });
//    }

//    $scope.modalHeadColAction = function (args) {
//        radasoft.openDialog({
//            templateUrl: 'app/views/test/headColActionDialogTemplate.html',
//            controller: args.controller,
//            windowClass: args.windowClass || '',// 'app-modal-window-80',
//            resolve: {
//                params: function () {
//                    return {
//                        includeUrl: args.includeUrl,
//                        showButtonSave: args.showButtonSave || false,
//                        headCol: args.colleteral,
//                        colAct: args.colAct
//                    };
//                }
//            }
//        }).result.then(function (data) {
//            radasoft.success();
//            $scope.getHeadColl();
//        });
//    }

//    $scope.editPhoto = function (colleteral, colAct) {
//        $scope.modalHeadColAction({
//            colleteral: colleteral,
//            colAct: colAct,
//            controller: 'subform0204Controller',
//            includeUrl: 'app/views/test/subform0203.html',
//            showButtonSave: true
//        });
//    }

//    $scope.editAttach = function (colleteral, colAct) {
//        $scope.modalHeadColAction({
//            colleteral: colleteral,
//            colAct: colAct,
//            controller: 'subform0205Controller',
//            includeUrl: 'app/views/test/subform0205.html',
//            showButtonSave: true
//        });
//    }

//    $scope.editWQS = function (colleteral, colAct) {
//        $scope.modalHeadColAction({
//            colleteral: colleteral,
//            colAct: colAct,
//            controller: 'subform0206Controller',
//            includeUrl: 'app/views/test/subform0206.html',
//            showButtonSave: true,
//            windowClass: 'app-modal-window-80'
//        });
//    }

//    $scope.editMAP = function (colleteral, colAct) {
//        radasoft.openMapEdit({
//            page: 'MapEdit',
//            HEAD_COL_RUNNING_ID: colleteral.HEAD_COL_RUNNING_ID,
//            HEAD_COL_CODE: colleteral.HEAD_COL_CODE
//        }, function (args) {
//            $scope.mapReturnArgs = args;
//        });
//    }

//    $scope.editGrade = function (colleteral, colAct) {
//        $scope.modalHeadColAction({
//            colleteral: colleteral,
//            colAct: colAct,
//            controller: 'subform0208Controller',
//            includeUrl: 'app/views/test/subform0208.html',
//            showButtonSave: true
//        });
//    }

//    $scope.editMarket = function (colleteral, colAct) {
//        $scope.modalHeadColAction({
//            colleteral: colleteral,
//            colAct: colAct,
//            controller: 'subform0209Controller',
//            includeUrl: 'app/views/test/subform0209.html',
//            showButtonSave: false,
//            windowClass: 'app-modal-window-80'
//        });
//    }

//    $scope.editAppraisal = function (colleteral, colAct) {
//        $scope.modalHeadColAction({
//            colleteral: colleteral,
//            colAct: colAct,
//            controller: 'subform0210Controller',
//            includeUrl: 'app/views/test/subform0210.html',
//            showButtonSave: false
//        });
//    }

//    $scope.editReport = function (colleteral, colAct) {
//        $scope.modalHeadColAction({
//            colleteral: colleteral,
//            colAct: colAct,
//            controller: 'subform0211Controller',
//            includeUrl: 'app/views/test/subform0211.html',
//            showButtonSave: false
//        });
//    }

//    $scope.openProjectCollteral = function () {
//        radasoft.openDialog({
//            templateUrl: 'app/views/project/completedProjectModal.html',
//            controller: 'completedProjectController',
//            windowClass: 'app-modal-window-80',
//            resolve: {
//                params: function () {
//                    return {
//                        includeUrl: 'app/views/project/completedProject.html',
//                        formData: {
//                            JOB_RUNNING_ID: $scope.$parent.formData.JOB_RUNNING_ID
//                        }
//                    };
//                }
//            }
//        }).result.then(function (data) {
//            $scope.init();
//            radasoft.success();
//        });
//    }

//    $scope.costSubCol = function (colleteral, subcol) {
//        radasoft.openDialog({
//            //templateUrl: 'app/views/project/completedProjectModal.html',
//            controller: 'costBuildingController',
//            windowClass: 'app-modal-window-80',
//            resolve: {
//                params: function () {
//                    return {
//                        includeUrl: 'app/views/test/subcol/costSubCol.html',
//                        headCol: colleteral,
//                        subCol: subcol
//                    };
//                }
//            }
//        }).result.then(function (data) {
//            $scope.getHeadColl();
//            radasoft.success();
//        });
//    }

//    $scope.collAct = function (colleteral, colAct) {
//        if (colAct.COL_ACT_CODE === 'PHOTO') {
//            $scope.editPhoto(colleteral, colAct);
//        }
//        else if (colAct.COL_ACT_CODE === 'ATTACH') {
//            $scope.editAttach(colleteral, colAct);
//        }
//        else if (colAct.COL_ACT_CODE === 'WQS') {
//            $scope.editWQS(colleteral, colAct);
//        }
//        else if (colAct.COL_ACT_CODE === 'MAP') {
//            $scope.editMAP(colleteral, colAct);
//        }
//        else if (colAct.COL_ACT_CODE === 'GRADE') {
//            $scope.editGrade(colleteral, colAct);
//        }
//        else if (colAct.COL_ACT_CODE === 'MARKET') {
//            $scope.editMarket(colleteral, colAct);
//        }
//        else if (colAct.COL_ACT_CODE === 'APPRAI') {
//            $scope.editAppraisal(colleteral, colAct);
//        }
//        else if (colAct.COL_ACT_CODE === 'REPORT') {
//            $scope.editReport(colleteral, colAct);
//        }
//    }

//    $scope.splitSubCol = function (headCol, subCol) {
//        //radasoft.debug(headCol);
//        //radasoft.debug(subCol);
//        radasoft.confirmAndSave($translate.instant('CONFIRM.SPLITSUBCOL'), '', function (isconfirmed) {
//            if (isconfirmed) {
//                radasoft.splitSubCol(headCol, subCol).then(function (response) {
//                    radasoft.success();
//                    $scope.getHeadColl();
//                });
//            }
//        });
//    }

//    //$scope.init();
//}]);

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

//app.controller('subform0201Controller', ['$scope', '$state', 'toaster', '$modal', '$translate', 'SweetAlert', '$modalInstance', 'radasoft', 'params', '$q', function ($scope, $state, toaster, $modal, $translate, SweetAlert, $modalInstance, radasoft, params, $q) {
//    $scope.keyId = params.formData.HEAD_COL_RUNNING_ID;
//    $scope.ldloading = {};
//    $scope.btnDisabled = false;
//    $scope.btnSubmitDisabled = false;

//    $scope.labelControlCss = 'col-sm-4 control-label';
//    $scope.formControlCss = 'col-sm-8';

//    $scope.includeTemplateUrl = 'app/views/test/boundary.html';

//    $scope.formData = {};//params.formData;

//    $scope.requestData = params.requestData;

//    $scope.title = $scope.formData.COL_TYPE.COL_TYPE;

//    $scope.selectCountry = [];
//    $scope.selectProvince = [];
//    $scope.selectDistrict = [];
//    $scope.selectSubDistrict = [];

//    $scope.selectLocCountry = [];
//    $scope.selectLocProvince = [];
//    $scope.selectLocDistrict = [];
//    $scope.selectLocSubDistrict = [];

//    $scope.radioMachineOperation = [{ VALUE: 'S', NAME: 'Stand alone' }, { VALUE: 'L', NAME: 'Line ผลิต' }, { VALUE: 'X', NAME: 'ไม่ใช่เครื่องจักร' }];
//    $scope.radioRegisYN = [{ VALUE: 'N', NAME: 'จดทะเบียน' }, { VALUE: 'Y', NAME: 'ไม่จดทะเบียน' }];

//    $scope.selectProjectUnitType = [];

//    $scope.getHeadColById = function () {
//        var deffered = $q.defer();
//        radasoft.getHeadColById({ HEAD_COL_RUNNING_ID: params.formData.HEAD_COL_RUNNING_ID }).then(function (response) {
//            $scope.formData = response.data;
//        });
//        return deffered.promise;
//    }

//    $scope.getCountry = function () {
//        radasoft.getCountry({}).then(function (response) {
//            $scope.selectCountry = response.data;

//            $scope.getProvince();
//        });
//    }

//    $scope.getProjectUnitType = function () {
//        if ($scope.requestData.JOB_TYPE) {
//            radasoft.getUnitType({}).then(function (response) {
//                $scope.selectProjectUnitType = response.data;
//            });
//        }
//    }

//    $scope.getProvince = function () {
//        radasoft.getProvince({}).then(function (response) {
//            $scope.selectProvince = response.data;

//            $scope.getProjectUnitType();
//        });
//    }
//    $scope.getDistrict = function (item, model) {
//        //$scope.formData.LOC_PROVINCE = item;
//        $scope.selectDistrict = [];
//        $scope.selectSubDistrict = [];
//        $scope.formData.DEED_CITY = undefined;
//        $scope.formData.DEED_DISTRICT = undefined;

//        $scope.formData.LOC_CITY = undefined;
//        $scope.formData.LOC_DISTRICT = undefined;
//        radasoft.getDistrict({ PROVINCE_ID: item.PROV_ID }).then(function (response) {
//            $scope.selectDistrict = response.data;

//            $scope.getLocDistrict(item, model);
//        });
//    }
//    $scope.getSubDistrict = function ($item, $model) {
//        $scope.formData.LOC_CITY = $item;
//        $scope.selectSubDistrict = [];
//        $scope.formData.DEED_DISTRICT = undefined;
//        $scope.formData.LOC_DISTRICT = undefined;
//        radasoft.getSubDistrict({ PROVINCE_ID: $item.PROVINCE_ID, DISTRICT_ID: $item.CITY_ID }).then(function (response) {
//            $scope.selectSubDistrict = response.data;
//        });
//    }

//    $scope.getLocProvince = function () {
//        radasoft.getProvince({}).then(function (response) {
//            $scope.selectLocProvince = response.data;
//        });
//    }
//    $scope.getLocDistrict = function (item, model) {
//        $scope.formData.LOC_PROVINCE = item;
//        $scope.selectLocDistrict = [];
//        $scope.selectLocSubDistrict = [];

//        $scope.formData.LOC_CITY = undefined;
//        $scope.formData.LOC_DISTRICT = undefined;
//        radasoft.getDistrict({ PROVINCE_ID: item.PROV_ID }).then(function (response) {
//            $scope.selectLocDistrict = response.data;
//        });
//    }
//    $scope.getLocSubDistrict = function ($item, $model) {
//        $scope.formData.LOC_CITY = $item;
//        $scope.selectLocSubDistrict = [];
//        $scope.formData.LOC_DISTRICT = undefined;
//        radasoft.getSubDistrict({ PROVINCE_ID: $item.PROVINCE_ID, DISTRICT_ID: $item.CITY_ID }).then(function (response) {
//            $scope.selectLocSubDistrict = response.data;
//        });
//    }

//    $scope.openMap = function () {

//        var HEAD_COL_RUNNING_ID = ($scope.formData.LOCATION_LAT == '' || $scope.formData.LOCATION_LAT == null) && ($scope.formData.LOCATION_LONG == '' || $scope.formData.LOCATION_LONG == null) ? '' : $scope.formData.HEAD_COL_RUNNING_ID;
//        var DEED_PROVINCE = $scope.formData.DEED_PROVINCE || {};
//        var DEED_CITY = $scope.formData.DEED_CITY || {};
//        var DEED_DISTRICT = $scope.formData.DEED_DISTRICT || {};
//        var DEED_NO = $scope.formData.DEED_NO;

//        radasoft.openMapDefineHeadColLocation({
//            page: 'DefineHeadColLocation',
//            HEAD_COL_RUNNING_ID: HEAD_COL_RUNNING_ID,
//            DEED_PROVINCE: HEAD_COL_RUNNING_ID == '' ? {} : DEED_PROVINCE,
//            DEED_CITY: HEAD_COL_RUNNING_ID == '' ? {} : DEED_CITY,
//            DEED_DISTRICT: HEAD_COL_RUNNING_ID == '' ? {} : DEED_DISTRICT,
//            DEED_NO: HEAD_COL_RUNNING_ID == '' ? '' : DEED_NO
//        }, function (args) {
//            $scope.mapReturnArgs = args;
//            $scope.formData.LOCATION_LAT = args.location.lat;
//            $scope.formData.LOCATION_LONG = args.location.lon;
//            $scope.$apply();
//        });
//    }

//    $scope.onSubDistrictChange = function ($item, $model) {
//        $scope.formData.LOC_DISTRICT = $item;
//    }

//    $scope.save = function (item, style) {
//        radasoft.confirmAndSave($translate.instant('CONFIRM.SAVE'), '', function (isconfirmed) {
//            if (isconfirmed) {
//                radasoft.setHeadColl($scope.formData).then(function (response) {
//                    radasoft.debug($scope.mapReturnArgs);
//                    if ($scope.mapReturnArgs == undefined) {
//                        radasoft.success();
//                        $modalInstance.close(response.data);
//                    } else {
//                        var attributes = angular.fromJson($scope.mapReturnArgs.response.graphic[0].attributes);
//                        var geometry = angular.fromJson($scope.mapReturnArgs.response.graphic[0].geometry);
//                        var graphic = [{ attributes: attributes, geometry: geometry }];

//                        graphic[0].attributes.HEAD_COL_RUNNING_ID = response.data.HEAD_COL_RUNNING_ID;

//                        radasoft.gisPostFeatureUrl({
//                            featureUrl: $scope.mapReturnArgs.response.featureUrl,
//                            token: $scope.mapReturnArgs.response.token,
//                            adds: graphic[0].attributes.OBJECTID == undefined ? graphic : [],
//                            updates: graphic[0].attributes.OBJECTID != undefined ? graphic : []
//                        }).then(function () {
//                            radasoft.success();
//                            $modalInstance.close(response.data);
//                        });
//                    }
//                });
//            }
//        });
//    }

//    $scope.cancel = function () {
//        $modalInstance.dismiss('cancel');
//    };

//    $scope.submit = function (form, style) {
//        if (form.$invalid) {
//            var field = null, firstError = null;
//            for (field in form) {
//                radasoft.debug(field);
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
//            $scope.save($scope.formData, style);
//        }
//    };

//    $scope.init = function () {
//        $scope.getHeadColById().then(function () {
//            $scope.getCountry();
//        });
//    }

//    $scope.init();
//}]);

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

    $scope.onSubTypeChange = function ($item, $model) {

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
        //$scope.selectDistrict = [];
        //$scope.selectSubDistrict = [];

        radasoft.getProvince({}).then(function (response) {
            $scope.selectProvince = response.data;

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

    $scope.openColCus = function (data) {
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
                        formData: data,
                        custRelation: $scope.selectCustRelaction,
                        acquireVia: $scope.selectAcquiredVia
                    };
                }
            }
        }).result.then(function (data) {
            var existing = $filter('filter')($scope.formData.COL_CUS, data.BCUS_COL_RUNNING_ID, true, 'BCUS_COL_RUNNING_ID')[0];

            if (existing == undefined) {
                data.BCUS_COL_RUNNING_ID = -($scope.formData.COL_CUS.length + 1);
                $scope.formData.COL_CUS.push(data);
            }
        });
    }

    $scope.addColCus = function () {
        $scope.openColCus({ BCUS_COL_RUNNING_ID: 0 });
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
    $scope.formData = params.formData;

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