app.controller('headColCtrl', ['$scope', '$state', 'toaster', '$modal', '$translate', 'SweetAlert', 'radasoft', '$filter', '$log', function ($scope, $state, toaster, $modal, $translate, SweetAlert, radasoft, $filter, $log) {
    $scope.colleteralUsageType = [];
    $scope.collType = [];
    $scope.colleterals = [];
    $scope.riskcde = [];
    $scope.energyType = [];
    $scope.roadType = [];
    $scope.landScape = [];
    $scope.materialFloor = [];
    $scope.brand = [];
    $scope.btnDisabled = false;
    $scope.inputDisabled = false;

    $scope.iconSplit = 'fa fa-bolt';
    $scope.iconEdit = 'fa fa-pencil';
    $scope.iconDelete = 'fa fa-times';

    $scope.css_th_1 = 'col-sm-2';
    $scope.css_th_2 = 'col-sm-2';
    $scope.css_th_3 = 'col-sm-2';
    $scope.css_th_4 = 'col-sm-2';
    $scope.css_th_5 = 'col-sm-1';
    $scope.css_th_6 = 'col-sm-2';
    $scope.css_th_7 = 'col-sm-1';

    $scope.appraisalButton = [
    { id: 1, text: 'จัดเกรดหลักทรัพย์' },
    { id: 1, text: 'จัดทำภาพถ่าย' },
    { id: 1, text: 'ข้อมูลตลาด/แผนที่' },
    { id: 1, text: 'WQS' },
    { id: 1, text: 'ราคาต้นทุนสิ่งปลูกสร้าง' },
    { id: 1, text: 'จัดทำภาพถ่าย' }
    ];

    if (!$scope.tab.create || !$scope.tab.update) {
        $scope.btnDisabled = true;
        $scope.inputDisabled = true;
    }

    $scope.$on('activateTab200', function (event, parameters) {
        if ($scope.colleterals.length == 0) {
            $scope.init();
        }
    });

    $scope.getHeadColl = function () {
        radasoft.getHeadColl({ DOC_ID: $scope.tab.DOC_ID }).then(function (response) {
            $scope.colleterals = response.data;
        });
    }

    $scope.init = function () {
        radasoft.getColleteralType({ DOC_ID: $scope.tab.DOC_ID }).then(function (response) {
            $scope.collType = response.data;
            radasoft.getHeadColl({ DOC_ID: $scope.tab.DOC_ID }).then(function (response) {
                //if (response.data.success) {
                $scope.colleterals = response.data;

                radasoft.getColleteralUsageType({}).then(function (response) {
                    $scope.colleteralUsageType = response.data;

                    radasoft.getRISKCDE().then(function (response) {
                        $scope.riskcde = response.data;

                        radasoft.getEnergyType({}).then(function (response) {
                            $scope.energyType = response.data;

                            radasoft.getRoadType({}).then(function (response) {
                                $scope.roadType = response.data;

                                radasoft.getLandScape({}).then(function (response) {
                                    $scope.landScape = response.data;

                                    radasoft.getMaterialFloor({}).then(function (response) {
                                        $scope.materialFloor = response.data;

                                        radasoft.getBrand({}).then(function (response) {
                                            $scope.brand = response.data;
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
                //}
            });
        });
    }

    $scope.deleteHeadCol = function (colleteral) {
        radasoft.confirmAndSave($translate.instant('CONFIRM.DELETE'), '', function (isconfirmed) {
            if (isconfirmed) {
                radasoft.delHeadCol({ HEAD_COL_RUNNING_ID: colleteral.HEAD_COL_RUNNING_ID }).then(function (response) {
                    $scope.getHeadColl();
                    radasoft.success();
                });
            }
        });
    }

    $scope.openProject = function () {
        $scope.openProjectPhaseZone($translate.instant('PROJECT'), true, false);
    }

    $scope.openPhaseZone = function () {
        $scope.openProjectPhaseZone($translate.instant('PHASE_ZONE'), false, true);
    }

    $scope.openProjectPhaseZone = function (title, showProject, showPhaseZone) {
        var params = {
            title: title,
            showProject: showProject,
            showPhaseZone: showPhaseZone,
            developer: $scope.$parent.formData.DEVELOPER != undefined && $scope.$parent.formData.DEVELOPER.DEV_RUNNING_ID > 0 ? $scope.$parent.formData.DEVELOPER : undefined,
            project: $scope.$parent.formData.PROJECT != undefined && $scope.$parent.formData.PROJECT.PROJECT_RUNNING_ID > 0 ? $scope.$parent.formData.PROJECT : undefined
        };

        $modal.open({
            templateUrl: 'app/views/project/popup.html',
            controller: 'projectController',
            backdrop: 'static',
            keyboard: false,
            //windowClass: 'app-modal-window-80',
            size: 'lg',
            resolve: {
                params: function () {
                    return params;
                }
            }
        }).result.then(function (data) {
            $scope.saveProjectData(data.developer, data.project);
        });
    }

    $scope.saveProjectData = function (dev, proj) {
        radasoft.confirmAndSave($translate.instant('CONFIRM.SAVE_PROJECT'), $translate.instant('SAVE_PROJECT_WARNNING'), function (isconfirmed) {
            if (isconfirmed) {
                radasoft.setFormDataProject({
                    REQUEST_RUNNING_ID: $scope.$parent.formData.REQUEST_RUNNING_ID,
                    DEVELOPER: dev,
                    PROJECT: proj
                }).then(function (response) {
                    $scope.$parent.formData.DEVELOPER = dev;
                    $scope.$parent.formData.PROJECT = proj;
                    radasoft.success();
                });
            }
        });
    }

    $scope.editSubCol = function (headCol, subCol) {
        var botColForm = $filter('filter')(headCol.BOT_COL_FORM, subCol.HEAD_COL_TYPE, null, 'COL_FORM_ID')[0];

        var IS_PROJECT = $scope.$parent.formData.JOB_TYPE;

        $scope.openSubCol(headCol, botColForm, IS_PROJECT, subCol);
    }

    $scope.deleteSubCol = function (headCol, subCol) {
        radasoft.confirmAndSave($translate.instant('CONFIRM.DELETE'), '', function (isconfirmed) {
            if (isconfirmed) {
                radasoft.deleteSubCol({ headCol: headCol, subCol: subCol }).then(function (response) {
                    $scope.getHeadColl();
                    radasoft.success();
                });
            }
        });
    }

    $scope.openSubCol = function (colleteral, botColForm, IS_PROJECT, data) {
        //$log.debug(data);
        var includeTemplateUrl1 = 'app/views/test/subcol/' + botColForm.COL_FORM_ID + '.html';
        var includeTemplateUrl2 = 'app/views/test/subcol/000000.html';
        $modal.open({
            templateUrl: 'app/views/test/subform0202.html',
            controller: 'subform0202Controller',
            backdrop: 'static',
            keyboard: false,
            //windowClass: 'app-modal-window-80',
            size: 'lg',
            resolve: {
                params: function () {
                    return {
                        headCol: colleteral,
                        botColForm: botColForm,
                        includeTemplateUrl1: includeTemplateUrl1,
                        includeTemplateUrl2: includeTemplateUrl2,
                        colleteralUsageType: $scope.colleteralUsageType,
                        riskcde: $scope.riskcde,
                        energyType: $scope.energyType,
                        roadType: $scope.roadType,
                        landScape: $scope.landScape,
                        materialFloor: $scope.materialFloor,
                        brand: $scope.brand,
                        formData: data,
                        requestData: $scope.$parent.formData,
                        IS_PROJECT: IS_PROJECT
                    };
                }
            }
        }).result.then(function (data) {
            $scope.getHeadColl();
            radasoft.success();
        });
    }

    $scope.addHeadCol = function (HEAD_COL_TYPE_ID, HEAD_COL_DETAIL) {
        var IS_PROJECT = $scope.$parent.formData.JOB_TYPE;
        $scope.openHeadColEditor(IS_PROJECT, {
            DOC_ID: $scope.$parent.formData.REQUEST_RUNNING_ID,
            JOB_RUNNING_ID: $scope.$parent.formData.JOB_RUNNING_ID,
            HEAD_COL_RUNNING_ID: 0,
            HEAD_COL_TYPE_ID: HEAD_COL_TYPE_ID,
            HEAD_COL_DETAIL: HEAD_COL_DETAIL,
            HEAD_COL_SUB_TYPE_ID: '00',
            DEED_COUNTRY: {
                CODE: 'TH',
                NAME_THAI: 'ไทย'
            }
        });
    }
    $scope.editHeadCol = function (data) {
        var IS_PROJECT = $scope.$parent.formData.JOB_TYPE;
        $scope.openHeadColEditor(IS_PROJECT, data);
    }

    $scope.openHeadColEditor = function (IS_PROJECT, data) {
        $modal.open({
            templateUrl: 'app/views/test/subform0201.html',
            controller: 'headColEditorCtrl',
            backdrop: 'static',
            keyboard: false,
            size: 'lg',
            resolve: {
                params: function () {
                    return {
                        formData: data,
                        IS_PROJECT: IS_PROJECT
                    };
                }
            }
        }).result.then(function (data) {
            $scope.getHeadColl();
        });
    }

    //$scope.addHeadCol = function (colType, subType) {
    //    $scope.openHeadColEditor(colType, {
    //        HEAD_COL_RUNNING_ID: 0,
    //        DOC_ID: $scope.tab.DOC_ID,
    //        HEAD_COL_TYPE_ID: colType.CODE,
    //        HEAD_COL_DETAIL: colType.COL_TYPE,
    //        HEAD_COL_SUB_TYPE_ID: '00',
    //        COL_TYPE: colType,
    //        GRADE_QNR_ID: colType.GRADE_QNR_ID,
    //        DEED_COUNTRY: {
    //            CODE: 'TH',
    //            NAME_THAI: 'ไทย'
    //        }
    //    });
    //}

    $scope.addSubCol = function (colleteral, botColForm) {
        var IS_PROJECT = $scope.$parent.formData.JOB_TYPE;
        $scope.openSubCol(colleteral, botColForm, IS_PROJECT, {});
    }

    $scope.modalHeadColAction = function (args) {
        radasoft.openDialog({
            templateUrl: 'app/views/test/headColActionDialogTemplate.html',
            controller: args.controller,
            windowClass: args.windowClass || '',// 'app-modal-window-80',
            resolve: {
                params: function () {
                    return {
                        includeUrl: args.includeUrl,
                        showButtonSave: args.showButtonSave || false,
                        headCol: args.colleteral,
                        colAct: args.colAct
                    };
                }
            }
        }).result.then(function (data) {
            radasoft.success();
            $scope.getHeadColl();
        });
    }

    $scope.editPhoto = function (colleteral, colAct) {
        $scope.modalHeadColAction({
            colleteral: colleteral,
            colAct: colAct,
            controller: 'subform0204Controller',
            includeUrl: 'app/views/test/subform0203.html',
            showButtonSave: true
        });
    }

    $scope.editAttach = function (colleteral, colAct) {
        $scope.modalHeadColAction({
            colleteral: colleteral,
            colAct: colAct,
            controller: 'subform0205Controller',
            includeUrl: 'app/views/test/subform0205.html',
            showButtonSave: true
        });
    }

    $scope.editWQS = function (colleteral, colAct) {
        radasoft.openDialog({
            controller: 'wqsFactorListCtrl',
            resolve: {
                params: function () {
                    return {
                        HEAD_COL_TYPE_ID: colleteral.CODE,
                        HEAD_COL_RUNNING_ID: colleteral.HEAD_COL_RUNNING_ID
                    };
                }
            }
        }).result.then(function (NV) {
            radasoft.openDialog({
                templateUrl: 'app/views/test/headColActionDialogTemplate.html',
                controller: 'subform0206Controller',
                //includeUrl: 'app/views/test/subform0206.html',
                //showButtonSave: true,
                windowClass: 'app-modal-window-80',
                resolve: {
                    params: function () {
                        return {
                            JOB_RUNNING_ID: colleteral.JOB_RUNNING_ID,
                            HEAD_COL_RUNNING_ID: colleteral.HEAD_COL_RUNNING_ID,
                            HEAD_COL_TYPE_ID: NV.VALUE,
                            MARKET_COMPAIR: colleteral.MARKET_COMPAIR
                        };
                    }
                }
            }).result.then(function () {
                radasoft.success();
                $scope.getHeadColl();
            });
        });
    }

    $scope.editMAP = function (colleteral, colAct) {
        var HEAD_COL_RUNNING_ID = '';
        if (colleteral.LOCATION_LAT != null
            && colleteral.LOCATION_LAT != undefined
            && colleteral.LOCATION_LAT != ''
            && colleteral.LOCATION_LONG != null
            && colleteral.LOCATION_LONG != undefined
            && colleteral.LOCATION_LONG != '') {
            HEAD_COL_RUNNING_ID = colleteral.HEAD_COL_RUNNING_ID;
        }
        radasoft.openMapEdit({
            page: 'MapEdit',
            HEAD_COL_RUNNING_ID: HEAD_COL_RUNNING_ID,
            HEAD_COL_CODE: colleteral.HEAD_COL_CODE
        }, function (args) {
            $scope.mapReturnArgs = args;
        });
    }

    $scope.editGrade = function (colleteral, colAct) {
        $scope.modalHeadColAction({
            colleteral: colleteral,
            colAct: colAct,
            controller: 'subform0208Controller',
            includeUrl: 'app/views/test/subform0208.html',
            showButtonSave: true
        });
    }

    $scope.editMarket = function (colleteral, colAct) {
        $scope.modalHeadColAction({
            colleteral: colleteral,
            colAct: colAct,
            controller: 'subform0209Controller',
            includeUrl: 'app/views/test/subform0209.html',
            showButtonSave: false,
            windowClass: 'app-modal-window-80'
        });
    }

    $scope.editAppraisal = function (colleteral, colAct) {
        $scope.modalHeadColAction({
            colleteral: colleteral,
            colAct: colAct,
            controller: 'subform0210Controller',
            includeUrl: 'app/views/test/subform0210.html',
            showButtonSave: false
        });
    }

    $scope.editReport = function (colleteral, colAct) {
        $scope.modalHeadColAction({
            colleteral: colleteral,
            colAct: colAct,
            controller: 'subform0211Controller',
            includeUrl: 'app/views/test/subform0211.html',
            showButtonSave: false
        });
    }

    $scope.openProjectCollteral = function () {
        radasoft.openDialog({
            templateUrl: 'app/views/project/completedProjectModal.html',
            controller: 'completedProjectController',
            windowClass: 'app-modal-window-80',
            resolve: {
                params: function () {
                    return {
                        includeUrl: 'app/views/project/completedProject.html',
                        formData: {
                            JOB_RUNNING_ID: $scope.$parent.formData.JOB_RUNNING_ID
                        }
                    };
                }
            }
        }).result.then(function (data) {
            $scope.init();
            radasoft.success();
        });
    }

    $scope.costSubCol = function (colleteral, subcol) {
        radasoft.openDialog({
            //templateUrl: 'app/views/project/completedProjectModal.html',
            controller: 'costBuildingController',
            windowClass: 'app-modal-window-80',
            resolve: {
                params: function () {
                    return {
                        includeUrl: 'app/views/test/subcol/costSubCol.html',
                        headCol: colleteral,
                        subCol: subcol
                    };
                }
            }
        }).result.then(function (data) {
            $scope.getHeadColl();
            radasoft.success();
        });
    }

    $scope.collAct = function (colleteral, colAct) {
        if (colAct.COL_ACT_CODE === 'PHOTO') {
            $scope.editPhoto(colleteral, colAct);
        }
        else if (colAct.COL_ACT_CODE === 'ATTACH') {
            $scope.editAttach(colleteral, colAct);
        }
        else if (colAct.COL_ACT_CODE === 'WQS') {
            $scope.editWQS(colleteral, colAct);
        }
        else if (colAct.COL_ACT_CODE === 'MAP') {
            $scope.editMAP(colleteral, colAct);
        }
        else if (colAct.COL_ACT_CODE === 'GRADE') {
            $scope.editGrade(colleteral, colAct);
        }
        else if (colAct.COL_ACT_CODE === 'MARKET') {
            $scope.editMarket(colleteral, colAct);
        }
        else if (colAct.COL_ACT_CODE === 'APPRAI') {
            $scope.editAppraisal(colleteral, colAct);
        }
        else if (colAct.COL_ACT_CODE === 'REPORT') {
            $scope.editReport(colleteral, colAct);
        }
    }

    $scope.splitSubCol = function (headCol, subCol) {
        //radasoft.debug(headCol);
        //radasoft.debug(subCol);
        radasoft.confirmAndSave($translate.instant('CONFIRM.SPLITSUBCOL'), '', function (isconfirmed) {
            if (isconfirmed) {
                radasoft.splitSubCol(headCol, subCol).then(function (response) {
                    radasoft.success();
                    $scope.getHeadColl();
                });
            }
        });
    }

    //$scope.init();
}]);
