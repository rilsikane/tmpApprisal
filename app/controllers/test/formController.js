app.controller('formController', ['$rootScope', '$scope', '$state', '$stateParams', '$modal', '$translate', 'radasoft', '$q', function ($rootScope, $scope, $state, $stateParams, $modal, $translate, radasoft, $q) {
    $scope.title = $stateParams.STATE_NAME;
    $scope.tabs = [];
    $scope.w4buttons = [];
    $scope.changableState = [];
    $scope.ldloading = {};
    $scope.btnDisabled = false;

    $scope.dispathcer = [];
    $scope.appraiser = [];
    $scope.approvers = [];
    $scope.selectDeveloper = [];
    $scope.selectProject = [];
    $scope.H = $stateParams.H; // 0 Inbox,1 History
    $scope.S = $stateParams.S; // I Inbox,H History,A Admin
    $scope.tmpTitle = '';
    $scope.actHist = {};

    $scope.onTabChange = function (item) {
        switch (item.id) {
            case 100://ข้อมูลใบคำขอ	
                break;
            case 200://หลักทรัพย์	
                $scope.$broadcast('activateTab200');
                break;
            case 300://ไฟล์แนบ	
                $scope.$broadcast('activateTab300');
                break;
            case 400://หน่วยงานผู้จ่ายงาน	
                break;
            case 500://จ่ายงานประเมิน	
                break;
            case 550://นัดหมายลูกค้า	
                break;
            case 600://จัดเกรดหลักทรัพย์	
                break;
            case 700://จัดทำภาพถ่าย	
                break;
            case 750://จัดทำแผนที่	
                break;
            case 800://จัดทำข้อมูลตลาด	
                break;
            case 900://จัดทำข้อมูล WQS	
                break;
            case 1000://ราคาประเมิน
                $scope.$broadcast('activateTab1000');
                break;
            case 1100://เล่มรายงาน
                break;
            case 1200://ตรวจสอบเล่มและความถูกต้องของการประเมิน	
                break;
            case 1300://พิมพ์แบบฟอร์มเอกสารสรุปผล	
                break;
            case 1400://บันทึกผลสรุปและปิดงาน	
                break;
            case 1500://ข้อมูลหลักทรัพย์ (COLL_ID)	
                break;
            case 1600://ความพึงพอใจ	
                break;
            case 9500://ประวัติสถานะ	
                $scope.$broadcast('activateTab9500');
                break;
        }
    }

    $scope.$on('onContactResultSuccess', function (event, params) {
        $scope.formData.DATE_APPRAI_EVALUATE = params.DATE_CUST_APPOINTMENT;
        if (params.CONTACT_RESULT.VALUE == '1') {
            var submitAction = undefined;

            angular.forEach($scope.w4buttons, function (item) {
                if (item.ACT_TYPE == 'submit' && $scope.actHist.TO_STATE == 35) {
                    submitAction = item;
                }
            });

            if (submitAction != undefined) {
                var w4ActionParams = {
                    DOC_ID: $scope.DOC_ID,
                    ACT_ID: submitAction.ACT_ID,
                    ACT_TYPE: submitAction.ACT_TYPE,
                    REASON_ID: 0,
                    REASON_TEXT: '',
                    NOTE: ''
                };

                radasoft.w4action(w4ActionParams).then(function (response) {
                    $scope.updatew4($scope.ACT_HIST_ID);
                    radasoft.success();
                });
            } else {
                radasoft.success();
            }
        }
    });

    $scope.formData = {};

    $scope.getDocState = function (ACT_HIST_ID) {
        var deferred = $q.defer();

        $scope.getDocStateV2(ACT_HIST_ID).then(function (response) {
            deferred.resolve(response);
        });

        return deferred.promise;
    };

    $scope.getDocStateV2 = function (ACT_HIST_ID) {
        var deferred = $q.defer();
        radasoft.getDocStateV2({
            ACT_HIST_ID: ACT_HIST_ID,
            ROLE_ID: 0,
            H: $scope.H,
            S: $scope.S
        }).then(function (response) {
            if (response.data.STATE_ACTIONS.length == 0 && $scope.H == 0 && $scope.S == 'I' && ACT_HIST_ID > 0) {
                $state.go('app.inbox');
            } else {
                $scope.w4buttons = response.data.STATE_ACTIONS;

                $scope.title = $scope.tmpTitle;
            }

            $scope.tabs = response.data.FORM_SECTIONS;
            $scope.updateOU($scope.DOC_ID);

            deferred.resolve(response);
        });
        return deferred.promise;
    };

    $scope.getDispatcherOU = function (DOC_ID) {
        radasoft.getDispatcherOU({ REQUEST_RUNNING_ID: DOC_ID }).then(function (response) {
            $scope.dispathcer = response.data;
        });
    };

    $scope.getAppraiserOU = function (DOC_ID) {
        radasoft.getAppraiserOU({ REQUEST_RUNNING_ID: DOC_ID }).then(function (response) {
            $scope.appraiser = response.data;
        });
    };

    $scope.getApproversOU = function (DOC_ID) {
        radasoft.getApproversOU({ REQUEST_RUNNING_ID: DOC_ID }).then(function (response) {
            $scope.approvers = response.data;
        });
    };

    $scope.updateOU = function (DOC_ID) {
        $scope.getDispatcherOU(DOC_ID);
        $scope.getAppraiserOU(DOC_ID);
        $scope.getApproversOU(DOC_ID);
    }

    $scope.getChangableState = function (DOC_ID) {
        radasoft.getChangableState({
            DOC_ID: DOC_ID
        }).then(function (response) {
            $scope.changableState = response.data;
        });
    }

    $scope.updatew4 = function (ACT_HIST_ID) {
        $scope.tabs = [];
        $scope.w4buttons = [];
        $scope.changableState = [];

        $scope.ACT_HIST_ID = ACT_HIST_ID;

        if (ACT_HIST_ID == 0) {
        } else {
            $scope.init();
        }
    }

    $scope.action = function (action) {
        $modal.open({
            templateUrl: '/app/views/test/w4actionDialog.html',
            controller: 'w4actionDialogController',
            backdrop: 'static',
            keyboard: false,
            size: action.ACT_TYPE == 'history' ? 'lg' : 'lg',
            resolve: {
                params: function () {
                    return {
                        item: action,
                        DOC_ID: $scope.DOC_ID
                    };
                }
            }
        }).result.then(function (data) {
            $scope.updatew4($scope.ACT_HIST_ID);
            radasoft.success();
        }, function (data) {
            if (data === 'submit') {
                $scope.updatew4($scope.ACT_HIST_ID);
            }
        });
    };

    $scope.back = function () {
        $state.go('app.inbox', {});
    }

    $scope.init = function () {
        $scope.ACT_HIST_ID = $stateParams.ACT_HIST_ID;

        radasoft.getDocActHist({ ACT_HIST_ID: $scope.ACT_HIST_ID, H: $scope.H }).then(function (response) {
            $scope.actHist = response.data;

            $scope.DOC_ID = response.data.DOC_ID || 0;

            $scope.tmpTitle = ($scope.H == '0') ? response.data.TO_STATE_NAME : response.data.ACT_TEXT;

            radasoft.getFormData({ DOC_ID: $scope.DOC_ID }).then(function (response) {
                $scope.formData = response.data;

                if ($scope.formData.REQUEST_RUNNING_ID == 0) {
                    $scope.formData.CREDIT_BALANCE = 0;
                    $scope.formData.CREDIT_LIMIT = 0;
                }

                if ($scope.ACT_HIST_ID == 0) {
                    $scope.tmpTitle = $translate.instant('TITLE.NEWDOC');
                }

                $scope.getDocState($scope.ACT_HIST_ID).then(function () {
                    radasoft.refreshCountNumber();
                });
            });

        });
    }

    $scope.init();
}]);

app.controller('w4actionDialogController', ['$scope', '$state', '$modalInstance', '$timeout', 'radasoft', 'params', function ($scope, $state, $modalInstance, $timeout, radasoft, params) {
    $scope.ldloading = {};
    $scope.btnDisabled = false;
    $scope.params = params;
    $scope.notifications = [];
    $scope.validations = [];
    $scope.noteRequired = true;
    $scope.reasonRequired = true;
    $scope.btnSubmitDisabled = false;
    $scope.hiddenInput = false;
    $scope.hiddenSubmitButton = false;
    $scope.showSubmitButton = false;

    $scope.formData = {
        NOTE: '',
        REASON: null
    };

    $scope.reasons = [];

    $scope.getW4actionReason = function () {
        radasoft.getW4actionReason({ ACT_ID: $scope.params.item.ACT_ID }).then(function (response) {
            if (response.data.success) {
                $scope.reasons = response.data.data;
            }
        });
    };

    $scope.getW4actionValid = function () {
        radasoft.getW4actionValid({ ACT_ID: $scope.params.item.ACT_ID, DOC_ID: $scope.params.DOC_ID }).then(function (response) {
            if (response.data.success) {
                $scope.validations = response.data.data;

                $.each($scope.validations, function (idx, item) {
                    if (item.VALID_TYPE == 3 && item.INVALID) {
                        $scope.btnSubmitDisabled = true;
                    }
                });

                if (!$scope.btnSubmitDisabled) {
                    $scope.showSubmitButton = true;
                }
            }
        });
    };

    $scope.getW4history = function () {
        radasoft.getW4history({ DOC_ID: $scope.params.DOC_ID }).then(function (response) {
            if (response.data.success) {
                $scope.history = response.data.data;
            }
        });
    };

    $scope.cancel = function () {
        if ($scope.hiddenInput && $scope.hiddenSubmitButton) {
            $modalInstance.dismiss('submit');
        } else {
            $modalInstance.dismiss('cancel');
        }
    };

    $scope.submit = function (form, style) {
        //var style = 'expand-left';
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
            $scope.ldloading[style.replace('-', '_')] = true;
            $scope.btnDisabled = true;
            $scope.errors = [];

            var w4ActionParams = {
                DOC_ID: $scope.params.DOC_ID,
                ACT_ID: $scope.params.item.ACT_ID,
                ACT_TYPE: $scope.params.item.ACT_TYPE,
                REASON_ID: $scope.formData.REASON ? $scope.formData.REASON.REASON_ID : 0,
                REASON_TEXT: $scope.formData.REASON ? $scope.formData.REASON.REASON_TEXT : '',
                NOTE: $scope.formData.NOTE
            };

            radasoft.w4action(w4ActionParams).then(function (response) {
                if (response.data.length > 0) {
                    $scope.validations = response.data;
                    $scope.hiddenInput = true;
                    $scope.hiddenSubmitButton = true;
                } else {
                    $modalInstance.close(response.data);
                }
            }).finally(function () {
                $scope.ldloading[style.replace('-', '_')] = false;
                $scope.btnDisabled = false;
                radasoft.refreshCountNumber();
            });
        }
    };

    if ($scope.params.item.ACT_TYPE == 'history') {
        $scope.getW4history();
    } else {
        $scope.getW4actionReason();

        $scope.getW4actionValid();
    }
}]);

app.controller('subform0550Controller', ['$scope', 'radasoft', '$translate', '$q', function ($scope, radasoft, $translate, $q) {
    $scope.inputDisabled = true;

    $scope.showBtnSave = true;
    $scope.dpOpenState = {};
    //$scope.formData = params.formData;

    if ($scope.tab.create || $scope.tab.update) {
        $scope.inputDisabled = false;
    }

    $scope.selectContactResult = [];
    $scope.custContact = [];

    $scope.getCustContact = function (JOB_RUNNING_ID, CUSCONTACT_RUNNING_ID) {
        radasoft.getCustContact({ JOB_RUNNING_ID: JOB_RUNNING_ID, CUSCONTACT_RUNNING_ID: CUSCONTACT_RUNNING_ID }).then(function (response) {
            $scope.custContact = response.data;
        });
    }

    $scope.openAppointment = function (data) {
        radasoft.openDialog({
            controller: 'subform0551Controller',
            resolve: {
                params: function () {
                    return {
                        formData: data,
                        STATE_ID: $scope.$parent.actHist.TO_STATE
                    };
                }
            }
        }).result.then(function (data) {
            if (data.CONTACT_RESULT.VALUE == '1') {
                $scope.init();
                $scope.$emit('onContactResultSuccess', data)
            } else {
                radasoft.success();
                $scope.init();
            }
        });
    }

    $scope.delete = function (item) {
        radasoft.confirmAndSave($translate.instant('CONFIRM.DELETE'), '', function (isconfirmed) {
            if (isconfirmed) {
                radasoft.delCustContact(item).then(function (response) {
                    radasoft.success();
                    $scope.init();
                });
            }
        });
    }

    $scope.edit = function (item) {
        $scope.openAppointment(item);
    }

    $scope.add = function () {
        $scope.openAppointment({
            JOB_RUNNING_ID: $scope.$parent.formData.JOB_RUNNING_ID,
            CUSCONTACT_RUNNING_ID: -1
        });
    }

    $scope.calendar = function () {
        radasoft.openDialog({
            controller: 'subform0552Controller',
            templateUrl: '/app/views/test/subform0552.html',
            resolve: {
                params: function () {
                    return {
                        JOB_RUNNING_ID: $scope.$parent.formData.JOB_RUNNING_ID
                    };
                }
            }
        }).result.then(function (data) {
            radasoft.success();
            $scope.init();
        });
    }

    $scope.submit = function (form) {
        radasoft.confirmAndSave($translate.instant('CONFIRM.SAVE'), '', function (isconfirmed) {
            if (isconfirmed) {
                radasoft.setDATE_APPRAI_EVALUATE($scope.$parent.formData).then(function () {
                    radasoft.success();
                });
            }
        });
    }

    $scope.init = function () {
        $scope.getCustContact($scope.$parent.formData.JOB_RUNNING_ID, 0);
    }

    $scope.init();
}]);
app.controller('subform0551Controller', ['$scope', 'radasoft', '$modalInstance', 'params', '$translate', '$q', function ($scope, radasoft, $modalInstance, params, $translate, $q) {
    $scope.title = $translate.instant('APPOINTMENT_CALENDAR');
    $scope.includeUrl = '/app/views/test/subform0551.html';
    $scope.showBtnSave = true;
    $scope.dpOpenState = {};
    $scope.formData = undefined;
    $scope.STATE_ID = params.STATE_ID;
    $scope.inputDisabled = false;
    $scope.selectContactResult = [];
    $scope.disabledContactResult = false;

    $scope.getContactResult = function () {
        var deferred = $q.defer();
        radasoft.getContactResult({}).then(function (response) {
            $scope.selectContactResult = response.data;

            deferred.resolve({});
        }, function () {
            deferred.reject();
        });
        return deferred.promise;
    }
    $scope.getCustContact = function (JOB_RUNNING_ID, CUSCONTACT_RUNNING_ID) {
        radasoft.getCustContact({ JOB_RUNNING_ID: JOB_RUNNING_ID, CUSCONTACT_RUNNING_ID: CUSCONTACT_RUNNING_ID }).then(function (response) {
            $scope.formData = response.data[0];

            if (CUSCONTACT_RUNNING_ID == -1) {
                $scope.formData.CONTACT_RESULT = undefined;
                $scope.formData.DATE_CUST_APPOINTMENT = undefined;
            } else {
                $scope.disabledContactResult = true;
            }
        });
    }
    $scope.openDatePicker = function ($event, elementOpened) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.dpOpenState[elementOpened] = !$scope.dpOpenState[elementOpened];
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
                    $scope.formData.STATE_ID = $scope.STATE_ID;
                    radasoft.setCustContact($scope.formData).then(function (response) {
                        $modalInstance.close(response.data);
                    });
                }
            });
        }
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.init = function () {
        $scope.getContactResult().then(function () {
            $scope.getCustContact(params.formData.JOB_RUNNING_ID, params.formData.CUSCONTACT_RUNNING_ID);
        });
    }
    $scope.onContactChage = function () {
        if ("1" != $scope.formData.CONTACT_RESULT.VALUE) {
            $scope.formData.DATE_CUST_APPOINTMENT = undefined;
            $scope.formData.APPOINTMENT_HOUR = undefined;
            $scope.formData.APPOINTMENT_MINUTE = undefined;
        }
    }

    $scope.init();
}]);

app.controller('subform0552Controller', ['$scope', 'radasoft', '$filter', '$translate', 'params', '$modalInstance', '$stateParams', function ($scope, radasoft, $filter, $translate, params, $modalInstance, $stateParams) {

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    //$scope.includeUrl = '/app/views/test/subform0552.html';
    $scope.JOB_RUNNING_ID = params.JOB_RUNNING_ID || $stateParams.JOB_RUNNING_ID;
    $scope.events = [];

    $scope.getCalendar = function () {
        radasoft.getCalendar({ JOB_RUNNING_ID: $scope.JOB_RUNNING_ID }).then(function (response) {
            $scope.events = response.data;
        });
    }

    $scope.calendarView = 'month';
    $scope.calendarDay = new Date();

    $scope.openEventEditor = function (data) {
        radasoft.openDialog({
            controller: 'subform0551Controller',
            resolve: {
                params: function () {
                    return {
                        formData: data
                    };
                }
            }
        }).result.then(function (data) {
            radasoft.success();
            $scope.getCalendar();
        });
    }


    $scope.eventClicked = function (event) {
        $scope.openEventEditor(event);
    };

    $scope.addEvent = function () {
        $scope.openEventEditor({
            CALENDAR_RUNNING_ID: 0,
            JOB_RUNNING_ID: $scope.$parent.formData.JOB_RUNNING_ID,
            EVALUATE_DATE_TIME: new Date()
        });
    };

    $scope.eventEdited = function (data) {
        $scope.openEventEditor(data);
    };

    $scope.eventDeleted = function (data) {
        radasoft.confirmAndSave($translate.instant('CONFIRM.DELETE'), '', function (isconfirmed) {
            if (isconfirmed) {
                radasoft.deleteCalendar(data).then(function (response) {
                    radasoft.success();
                    $scope.getCalendar();
                });
            }
        });
    };

    $scope.setCalendarToToday = function () {
        $scope.calendarDay = new Date();
    };

    $scope.toggle = function ($event, field, event) {
        $event.preventDefault();
        $event.stopPropagation();

        event[field] = !event[field];
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.init = function () {
        $scope.getCalendar();
    }

    $scope.init();
}]);

app.controller('subform1200Controller', ['$scope', 'radasoft', function ($scope, radasoft) {
    $scope.requestAttach = [];
    $scope.btnDisabled = true;
    $scope.inputDisabled = true;

    if ($scope.tab.create || $scope.tab.update) {
        $scope.btnDisabled = false;
        $scope.inputDisabled = false;
    }

    $scope.getRequestAttach = function () {
        radasoft.getRequestAttachForApprover({ DOC_ID: $scope.DOC_ID }).then(function (response) {
            $scope.requestAttach = response.data;
        });
    }

    $scope.submit = function () {
        $scope.$broadcast('setQuestionnaire');
    }

    $scope.init = function () {
        $scope.getRequestAttach();
    }

    $scope.init();
}]);
app.controller('subform1300Controller', ['$scope', 'radasoft', '$sce', '$translate', function ($scope, radasoft, $sce, $translate) {
    $scope.content = {};
    $scope.btnDisabled = true;
    $scope.inputDisabled = true;
    $scope.inputReadOnly = true;

    if ($scope.tab.create || $scope.tab.update) {
        $scope.btnDisabled = false;
        $scope.inputDisabled = false;
    }

    $scope.getHeadColAppraisalList = function () {
        radasoft.getHeadColAppraisalList({ JOB_RUNNING_ID: $scope.$parent.formData.JOB_RUNNING_ID }).then(function (response) {
            var allOk = true;

            angular.forEach(response.data, function (item) {
                if (item.APPRAISAL_REPORT_OK == false) {
                    allOk = false;
                }
            });

            if ($scope.btnDisabled == false) {
                $scope.btnDisabled = !allOk;
            }

            $scope.headColAppraisalList = response.data;
        });
    }

    $scope.print = function () {
        radasoft.confirmAndSave($translate.instant('CONFIRM.GEN_COMMITTEE_REPORT'), '', function (isconfirmed) {
            if (isconfirmed) {
                radasoft.genRequestCommittee({
                    JOB_RUNNING_ID: $scope.$parent.formData.JOB_RUNNING_ID,
                    DOC_ID: $scope.$parent.formData.REQUEST_RUNNING_ID,
                    regen: true
                }).then(function (response) {
                    $scope.$parent.formData.APPRAISAL_COMMITTEE_SIGN_FORM = response.data;
                    //radasoft.downloadFile($scope.$parent.formData.APPRAISAL_COMMITTEE_SIGN_FORM);
                    radasoft.success();
                });
            }
        });
    }

    $scope.init = function () {
        $scope.getHeadColAppraisalList();
    }

    $scope.init();
}]);
app.controller('subform1400Controller', ['$scope', 'radasoft', '$sce', '$translate', function ($scope, radasoft, $sce, $translate) {
    $scope.btnDisabled = true;
    $scope.inputDisabled = true;
    $scope.inputReadOnly = true;

    if ($scope.tab.create || $scope.tab.update) {
        $scope.btnDisabled = false;
        $scope.inputDisabled = false;
    }

    $scope.radioYN = [{ VALUE: 'Y', NAME: $translate.instant('YES') }, { VALUE: 'N', NAME: $translate.instant('NO') }];
    $scope.options = {
        language: 'en',
        allowedContent: true,
        entities: false
    };
    $scope.onReady = function () {
        // ...
    };
    $scope.upload = function () {
        radasoft.upload({
            config: 'upload/document',
            id1: $scope.$parent.formData.JOB_RUNNING_ID
        }).result.then(function (data) {
            radasoft.debug(data);
            $scope.$parent.formData.APPRAISAL_COMMITTEE_SIGNED_FORM = data[0];
        });
    }
    $scope.deleteAttach = function (attach) {
        radasoft.confirmAndSave($translate.instant('CONFIRM.DELETE'), '', function (isconfirmed) {
            if (isconfirmed) {
                radasoft.deleteAttachDoc(attach).then(function (response) {
                    radasoft.success();
                    $scope.$parent.formData.APPRAISAL_COMMITTEE_SIGNED_FORM = {
                        ATTACHDOC_RUNNING_ID: 0,
                        DOC_NAME: ''
                    };
                });
            }
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
                    radasoft.approverSave($scope.$parent.formData).then(function (response) {
                        radasoft.success();
                    });
                }
            });
        }
    }
    $scope.savesend = function () {
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
            radasoft.confirmAndSave($translate.instant('CONFIRM.SAVESEND'), '', function (isconfirmed) {
                if (isconfirmed) {
                    radasoft.approverSaveSend($scope.$parent.formData).then(function (response) {
                        radasoft.success();
                    });
                }
            });
        }
    }

    $scope.init = function () {
    }

    $scope.init();

}]);
app.controller('subform1500Controller', ['$scope', 'radasoft', '$translate', function ($scope, radasoft, $translate) {
    $scope.collid = [];

    $scope.getCOLL_ID = function () {
        radasoft.getCOLL_ID({ JOB_RUNNING_ID: $scope.$parent.formData.JOB_RUNNING_ID }).then(function (response) {
            $scope.collid = response.data;
        });
    }

    $scope.init = function () {
        $scope.getCOLL_ID();
    }

    $scope.save = function () {
        radasoft.confirmAndSave($translate.instant('CONFIRM.SAVE'), '', function (response) {
            radasoft.setCOLL_ID($scope.collid).then(function (response) {
                radasoft.success();
            });
        });
    }

    $scope.init();
}]);

app.controller('subform1600Controller', ['$scope', 'radasoft', function ($scope, radasoft) {
    $scope.btnDisabled = true;
    $scope.inputDisabled = true;

    if ($scope.tab.create || $scope.tab.update) {
        $scope.btnDisabled = false;
        $scope.inputDisabled = false;
    }

    $scope.submit = function () {
        $scope.$broadcast('setQuestionnaire');
    }
}]);