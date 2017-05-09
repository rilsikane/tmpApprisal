angular.module('Application')
    .service('radasoft', [
        '$q',
        '$http',
        '$modal',
        '$translate',
        '$log',
        '$state',
        'SweetAlert',
        '$rootScope',
        '$timeout',
        '$httpParamSerializerJQLike',
        function ($q, $http, $modal, $translate, $log, $state, SweetAlert, $rootScope, $timeout) {
            var tokenKey = 'accessToken';
            this.info = function (msg) {
                $log.info(msg);
            }
            this.debug = function (msg) {
                $log.debug(msg);
            }
            this.httpPost = function (action, params, httpConfig) {
                var url = 'https://gsbappraisal.cdg.co.th/rdsdWeb/api/Values/' + action;
                return this.http('POST', url, params, httpConfig || {});
            }
            this.httpGet = function (action, params, httpConfig) {
                var str = [];
                for (var p in params) {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(params[p]));
                }
                var url = 'https://gsbappraisal.cdg.co.th/rdsdWeb/api/Values/' + action + (params ? '?' + str.join("&") : '');
                return this.http('GET', url, {}, httpConfig || {});
            }
            this.httpLogout = function () {
                var url = 'api/Account/Logout';
                return this.http('POST', url, {}, {});
            }
            this.http = function (method, url, params, httpConfig) {
                var token = sessionStorage.getItem(tokenKey);

                var deferred = $q.defer();

                var responseType = httpConfig.responseType || 'json';

                var config = {
                    method: method,
                    data: params,
                    url: url,
                    responseType: responseType,
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                };

                $http(config).then(function (response) {
                    deferred.resolve(response);
                }, function (response) {
                    if (response.status == 401) {
                        //SweetAlert.swal('Unauthorized.');
                        $state.go('login.signin');
                    } else {
                        if (typeof (response.data) == 'object') {
                            SweetAlert.swal(response.data.Message, response.data.ExceptionMessage);
                        } else {
                            SweetAlert.swal(response.status + ' : ' + response.statusText, url);
                        }
                        deferred.reject(response);
                    }
                });

                return deferred.promise;
            };

            this.login = function (params) {

                var loginData = {
                    grant_type: 'password',
                    username: params.username,
                    password: params.password
                };

                var deferred = $q.defer();

                var url = 'https://gsbappraisal.cdg.co.th/rdsdWeb/Token';

                var config = {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                    }
                    , transformRequest: function (obj) {
                        var str = [];
                        for (var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        return str.join("&");
                    }
                };

                $http.post(url, loginData, config).then(function (response) {
                    sessionStorage.setItem(tokenKey, response.data.access_token);
                    deferred.resolve(response);
                }, function (response) {
                    //SweetAlert.swal(response.status + ' : ' + response.statusText, url);
                    deferred.reject(response);
                });

                return deferred.promise;
            }

            this.logout = function () {
                var deferred = $q.defer();

                this.httpLogout().then(function (response) {
                    sessionStorage.removeItem(tokenKey);
                    sessionStorage.removeItem('role');
                    sessionStorage.removeItem('roles');
                    deferred.resolve(response);
                }, function () {
                    deferred.reject(response);
                });

                return deferred.promise;
            }

            this.getUserRole = function () {
                return this.httpGet('getUserRole');
            }

            this.initApp = function () {
                var deferred = $q.defer();
                var me = this;
                var role = angular.fromJson(sessionStorage.getItem('role') || '{"ROLE_RUNNING_ID":0}');
                var roles = angular.fromJson(sessionStorage.getItem('roles') || '[]');

                me.getLogonUser({}).then(function (response) {
                    $rootScope.user = response.data;
                    $rootScope.role = role;
                    $rootScope.roles = roles;
                    $rootScope.isAppriaiser = $rootScope.role.ROLE_RUNNING_ID == 13;

                    me.getAppConfig().then(function (response) {
                        $rootScope.appConfig = response.data;

                        me.refreshCountNumber().then(function (response) {

                            me.getRoleMenus({ ID: role.ROLE_RUNNING_ID }).then(function (response) {
                                $rootScope.app.menuItems = response.data;

                                angular.forEach($rootScope.app.menuItems, function (item) {
                                    if (item.MENU_LEVEL == 2) {
                                        switch (item.URL) {
                                            case 'app.inbox':
                                                $rootScope.app.inboxTitle = item.MENU_NAME;
                                                break;
                                            case 'app.inboxhist':
                                                $rootScope.app.inboxHistTitle = item.MENU_NAME;
                                                break;
                                            default:
                                                break;
                                        }
                                    }
                                });

                                deferred.resolve(response);
                            }, function () {
                                deferred.reject(response);
                            });


                        }, function (response) {
                            deferred.reject(response);
                        });
                    }, function (response) {
                        deferred.reject(response);
                    });
                }, function (response) {
                    deferred.reject(response);
                });

                //if (typeof (role) != 'undefined' && role != null) {
                //} else {
                //    deferred.resolve({});
                //}

                return deferred.promise;
            }

            this.refreshCountNumber = function () {
                var me = this;
                var deferred = $q.defer();

                var role = angular.fromJson(sessionStorage.getItem('role'));

                if (typeof (role) != 'undefined' && role != null) {
                    me.countInboxAndHistory({ ROLE_ID: role.ROLE_RUNNING_ID }).then(function (response) {
                        $rootScope.app.COUNT_MYDOC = response.data.data.COUNT_MYDOC;
                        $rootScope.app.COUNT_INBOX = response.data.data.COUNT_INBOX;
                        $rootScope.app.COUNT_HISTORY = response.data.data.COUNT_HISTORY;
                        deferred.resolve(response);
                    }, function (response) {
                        deferred.reject(response);
                    });
                } else {
                    deferred.reject();
                }

                return deferred.promise;
            }

            this.alert = function (title, text) {
                return SweetAlert.swal({
                    title: title,
                    text: text,
                    type: "warning",
                    //showCancelButton: true,
                    //confirmButtonColor: "#DD6B55",
                    confirmButtonText: "OK"
                });
            }
            this.swal = function (text) {
                return SweetAlert.swal(text);
            }
            this.success = function (title, text) {
                return SweetAlert.swal({
                    title: title ? title : $translate.instant('NOTIFY.SUCCESS'),
                    text: text,
                    type: "success",
                    confirmButtonColor: '#007AFF',
                    confirmButtonText: $translate.instant('BUTTON.OK')
                });
            }
            this.error = function (title, text, ex) {
                //console.log(title, text, ex);
                if (ex) {
                    title = ex.ExceptionType;
                    text = ex.Message;
                }
                return SweetAlert.swal({
                    title: title ? title : "ไม่สำเร็จ",
                    text: text,
                    type: "error"
                });
            }
            this.confirm = function (title, text, callback) {
                return SweetAlert.swal({
                    title: title,
                    text: text,
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: '#007AFF',
                    confirmButtonText: $translate.instant('BUTTON.YES'),
                    cancelButtonText: $translate.instant('BUTTON.NO'),
                    closeOnConfirm: true,
                    closeOnCancel: true,
                    showLoaderOnConfirm: false
                }, callback);
            }
            this.confirmAndSave = function (title, text, callback) {
                SweetAlert.swal({
                    title: title,
                    text: text,
                    type: "info",
                    showCancelButton: true,
                    confirmButtonColor: '#007AFF',
                    confirmButtonText: $translate.instant('BUTTON.YES'),
                    cancelButtonText: $translate.instant('BUTTON.NO'),
                    closeOnConfirm: false,
                    //closeOnCancel: true,
                    showLoaderOnConfirm: true
                }, callback);
            }

            this.getLoggedUserRole = function () {
                var deferred = $q.defer();
                var role = angular.fromJson(sessionStorage.getItem('role'));
                if (role == null || typeof (role) == 'undefined') {
                    this.logout().then(function () {
                        $state.go('login.signin');
                    }).finally(function () {
                        deferred.reject();
                    });
                } else {
                    deferred.resolve(role);
                }
                return deferred.promise;
            }

            this.getSystemInfo = function (params) {
                return this.httpPost('getSytemInfo', params);
            };

            this.getLogonUser = function (params) {
                return this.httpPost('getUser', params);
            };

            this.countInboxAndHistory = function (params) {
                return this.httpGet('countInboxAndHistory', params);
            }

            this.getMyDocs = function (params) {
                var defered = $q.defer();
                var me = this;
                me.getLoggedUserRole().then(function (role) {
                    params.ROLE_ID = role.ROLE_RUNNING_ID;

                    me.httpPost('getMyDocs', params).then(function (response) {
                        defered.resolve(response);
                    }, function (error) {
                        defered.reject(error);
                    });
                });

                return defered.promise;
            }

            this.getMyInbox = function (params) {
                var defered = $q.defer();
                var me = this;
                me.getLoggedUserRole().then(function (role) {
                    params.ROLE_ID = role.ROLE_RUNNING_ID;

                    me.httpPost('getMyInbox', params).then(function (response) {
                        defered.resolve(response);
                    }, function (error) {
                        defered.reject(error);
                    });
                });

                return defered.promise;
            }

            this.getMyHist = function (params) {
                var defered = $q.defer();
                var me = this;
                me.getLoggedUserRole().then(function (role) {
                    params.ROLE_ID = role.ROLE_RUNNING_ID;

                    me.httpPost('getMyHist', params).then(function (response) {
                        defered.resolve(response);
                    }, function (error) {
                        defered.reject(error);
                    });
                });

                return defered.promise;
            }

            this.getFormSection = function (params) {
                return this.httpGet('getFormSection', params);
            }

            this.getDocState = function (params) {
                return this.httpPost('getDocState', params);
            }

            //this.getDocStateV2 = function (params) {
            //    return this.httpGet('getDocStateV2', params);
            //}

            this.getStateAction = function (params) {
                return this.httpGet('getStateAction', params);
            }

            this.getDispatcherOU = function (params) {
                return this.httpGet('getDispatcherOU', params);
            }
            this.getAppraiserOU = function (params) {
                return this.httpGet('getAppraiserOU', params);
            }
            this.getApproversOU = function (params) {
                return this.httpGet('getApproversOU', params);
            }

            this.setDispatcherOU = function (params) {
                return this.httpGet('setDispatcherOU', params);
            }
            this.setAppraiserOUsetApproverOU = function (params) {
                return this.httpPost('setAppraiserOUsetApproverOU', params);
            }
            this.getFormData = function (params) {
                return this.httpGet('getFormData', params);
            }
            this.getW4actionReason = function (params) {
                return this.httpGet('getW4actionReason', params);
            }
            this.getW4actionValid = function (params) {
                return this.httpGet('getW4actionValid', params);
            }
            this.getW4history = function (params) {
                return this.httpGet('getW4history', params);
            }
            this.getColleteralType = function (params) {
                return this.httpGet('getColleteralType', params);
            }
            this.getColleteralSubType = function (params) {
                return this.httpPost('getColleteralSubType', params);
            }

            this.setHeadColl = function (params) {
                return this.httpPost('setHeadColl', params);
            }
            this.getHeadColl = function (params) {
                return this.httpGet('getHeadColl', params);
            }
            this.delHeadCol = function (params) {
                return this.httpGet('delHeadCol', params);
            }

            this.setFormData = function (params) {
                return this.httpPost('setFormData', params);
            }
            this.getStepOwner = function (params) {
                return this.httpGet('getStepOwner', params);
            }
            this.getMatrix = function (params) {
                return this.httpPost('getMatrix', params);
            }
            this.getCountry = function (params) {
                return this.httpGet('getCountry', params);
            }
            this.getProvince = function (params) {
                return this.httpGet('getProvince', params);
            }
            this.getDistrict = function (params) {
                return this.httpGet('getDistrict', params);
            }
            this.getSubDistrict = function (params) {
                return this.httpGet('getSubDistrict', params);
            }

            this.w4action = function (params) {
                return this.httpPost('w4action', params);
            }

            this.w4changeState = function (params) {
                return this.httpPost('w4changeState', params);
            }

            this.getChangableState = function (params) {
                return this.httpPost('getChangableState', params);
            }

            this.getOwnerOU = function (params) {
                return this.httpPost('Home/getOwnerOU', params);
            }

            this.getSegment = function (params) {
                return this.httpPost('getSegment', params);
            }
            this.getObjective = function (params) {
                return this.httpPost('getObjective', params);
            }
            this.getDebtType = function (params) {
                return this.httpPost('getDebtType', params);
            }
            this.getCustType = function (params) {
                return this.httpPost('getCustType', params);
            }
            this.getDept = function (params) {
                return this.httpPost('getDept', params);
            }
            this.getRequestType = function (params) {
                return this.httpPost('getRequestType', params);
            }
            this.getAllUser = function () {
                return this.httpGet('getAllUser');
            }
            this.getRoleMenus = function (params) {
                return this.httpGet('getRoleMenus', params);
            }
            this.getTables = function () {
                return this.httpGet('getTables');
            }
            this.getTableColumns = function (params) {
                return this.httpGet('getTableColumns', params);
            }
            this.getTableData = function (params) {
                return this.httpGet('getTableData', params);
            }
            this.getRoles = function (params) {
                return this.httpGet('getRoles', params);
            }
            this.getColleteralUsageType = function (params) {
                return this.httpGet('getColleteralUsageType', params);
            }
            this.getRISKCDE = function (params) {
                return this.httpGet('getRISKCDE', params);
            }
            this.setSubCol = function (params) {
                var id = params.botColForm.COL_FORM_ID;
                var url = '';
                $log.info(params);
                switch (id) {
                    case 286003://ที่ดินเปล่า
                        url = 'setSubCol_286003';
                        break;
                    case 286006://ที่ดินพร้อมสิ่งปลูกสร้าง
                        url = 'setSubCol_286006';
                        break;
                    case 300000://ยานพาหนะ
                        url = 'setSubCol_300000';
                        break;
                    case 286038://รถยนต์ หรือทะเบียนรถ
                        url = 'setSubCol_286038';
                        break;
                    case 286005://สิทธิการเช่าอาคาร
                        url = 'setSubCol_286005';
                        break;
                    case 286004://อาคารสิ่งปลูกสร้าง
                        url = 'setSubCol_286004';
                        break;
                    case 286008://อื่นๆที่เกียวกับที่ดินและสิ่งปลูกสร้าง-โอนสิทธิการเช่าฯ
                        url = 'setSubCol_286008';
                        break;
                    case 286011://เครื่องจักร
                        url = 'setSubCol_286011';
                        break;
                    case 286039://เรือสินค้า เรือขนทราย หรือเรือยนต์ทุกประเภท
                        url = 'setSubCol_286039';
                        break;
                    case 286066://คอนโดมิเนียม/อาคารชุด/ห้องชุด
                        url = 'setSubCol_300001';
                        break;
                    case 999999://อื่นๆ
                        url = 'setSubCol_999999';
                        break;
                }

                params.subColl.COL_TYPE = params.headCol.COL_TYPE;
                params.subColl.HEAD_COL_TYPE = params.subColl.SUB_TYPE.MAIN_CODE;
                params.subColl.SUB_COL_TYPE = params.subColl.SUB_TYPE.CODE;
                params.subColl.HEAD_COL_RUNNING_ID = params.headCol.HEAD_COL_RUNNING_ID;

                return this.httpPost(url, params.subColl);
            }
            this.getSubCol = function (params) {

                var url = '';

                var urlParams = {};

                switch (params.COL_FORM_ID) {
                    case 286003: url = 'getSubCol_286003'; urlParams = { SUB_COL_RUNNING_ID: params.formData.LAND_COL_RUNNING_ID || 0 }; break;//ที่ดิน
                    case 286004: url = 'getSubCol_286004'; urlParams = { SUB_COL_RUNNING_ID: params.formData.BUILDING_COL_RUNNING_ID || 0 }; break;//อาคารสิ่งปลูกสร้าง
                    case 286005: url = 'getSubCol_286005'; urlParams = { SUB_COL_RUNNING_ID: params.formData.RENT_RUNNING_ID || 0 }; break;//สิทธิการเช่า
                    case 286066: url = 'getSubCol_286066'; urlParams = { SUB_COL_RUNNING_ID: params.formData.CONDO_COL_RUNNING_ID || 0 }; break;//คอนโดมิเนียม/อาคารชุด/ห้องชุด
                    case 286011: url = 'getSubCol_286011'; urlParams = { SUB_COL_RUNNING_ID: params.formData.MACHINE_RUNNING_ID || 0 }; break;//เครื่องจักร
                    case 286038: url = 'getSubCol_286038'; urlParams = { SUB_COL_RUNNING_ID: params.formData.CAR_RUNNING_ID || 0 }; break;//รถยนต์
                    case 286039: url = 'getSubCol_286039'; urlParams = { SUB_COL_RUNNING_ID: params.formData.SHIP_RUNNING_ID || 0 }; break;//เรือ
                    case 999999: url = 'getSubCol_999999'; urlParams = { SUB_COL_RUNNING_ID: params.formData.OTHERS_RUNNING_ID || 0 }; break;//อื่นๆ 
                }

                urlParams.HEAD_COL_RUNNING_ID = params.HEAD_COL_RUNNING_ID;
                urlParams.JOB_RUNNING_ID = params.JOB_RUNNING_ID;

                var deferred = $q.defer();

                this.httpGet(url, urlParams).then(function (response) {

                    if (urlParams.SUB_COL_RUNNING_ID == 0) {
                        response.data.IS_PROJECT = params.formData.IS_PROJECT || false;
                        switch (params.COL_FORM_ID) {
                            case 286003:
                                response.data.PROJECT_PRICE.ZONE = undefined;
                                break;//ที่ดิน
                            case 286004:
                                response.data.PROJECT_PRICE.ZONE = undefined;
                                break;//อาคารสิ่งปลูกสร้าง
                            case 286005:
                                break;//สิทธิการเช่า
                            case 286066:
                                break;//คอนโดมิเนียม/อาคารชุด/ห้องชุด
                            case 286011:
                                response.data.AGE_STD_MONTH = undefined;
                                response.data.AGE_STD_YEAR = undefined;
                                response.data.AGE_YEAR = undefined;
                                response.data.AGE_MONTH = undefined;
                                response.data.APPR_CUR_NET_TOTAL = undefined;
                                break;//เครื่องจักร
                            case 286038:
                                response.data.AGE_STD_MONTH = undefined;
                                response.data.AGE_STD_YEAR = undefined;
                                response.data.AGE_YEAR = undefined;
                                response.data.AGE_MONTH = undefined;
                                response.data.APPR_CUR_NET_TOTAL = undefined;
                                response.data.REGIS_PROVINCE = undefined;
                                break;//รถยนต์
                            case 286039:
                                response.data.AGE_STD_MONTH = undefined;
                                response.data.AGE_STD_YEAR = undefined;
                                response.data.AGE_YEAR = undefined;
                                response.data.AGE_MONTH = undefined;
                                response.data.APPR_CUR_NET_TOTAL = undefined;
                                break;//เรือ
                            case 999999:
                                break;//อื่นๆ 
                        }
                    }

                    deferred.resolve({ data: response.data });

                }, function () {
                    deferred.reject();
                });

                return deferred.promise;
            }
            this.deleteSubCol = function (params) {
                //$log.info(params);

                var id = params.subCol.HEAD_COL_TYPE;

                var url = 'deleteSubCol_' + id;

                switch (id) {
                    case "286066"://คอนโดมิเนียม/อาคารชุด/ห้องชุด
                        url = 'deleteSubCol_300001';
                        break;
                }

                return this.httpPost(url, params.subCol);
            }

            this.getEnergyType = function (params) {
                return this.httpGet('getEnergyType', params);
            }

            this.getRoadType = function (params) {
                return this.httpGet('getRoadType', params);
            }

            this.getLandScape = function (params) {
                return this.httpGet('getLandScape', params);
            }

            this.getMaterialFloor = function (params) {
                return this.httpGet('getMaterialFloor', params);
            }

            this.getBrand = function (params) {
                return this.httpGet('getBrand', params);
            }

            this.setColPhoto = function (params) {

                var data = [];

                angular.forEach(params, function (page) {
                    var newPage = {
                        HEAD_COL_RUNNING_ID: page.HEAD_COL_RUNNING_ID,
                        PAGE_LIST: page.PAGE_LIST,
                        PAGE_REMARK: page.PAGE_REMARK,
                        PHOTO_RUNNING_ID: page.PHOTO_RUNNING_ID,
                        PHOTO_LIMIT: page.PHOTO_LIMIT,
                        TEMPLATE_TYPE: page.TEMPLATE_TYPE,
                        PHOTO: []
                    };

                    angular.forEach(page.PHOTO, function (item, $index) {
                        newPage.PHOTO.push({
                            ATTACHDOC_RUNNING_ID: item.ATTACHDOC_RUNNING_ID,
                            LATITUDE: item.LATITUDE,
                            LONGTITUDE: item.LONGTITUDE,
                            NAME: item.NAME,
                            REMARK: item.REMARK
                        });
                    });

                    data.push(newPage);
                });

                return this.httpPost('setColPhoto', data);
            }
            this.deleteColPhotoPage = function (params) {
                return this.httpPost('deleteColPhotoPage', params);
            }

            this.setColAttach = function (params) {
                return this.httpPost('setColAttach', params);
            }
            this.deleteAttachDoc = function (params) {
                return this.httpPost('deleteAttachDoc', params);
            }
            this.getRequestAttach = function (params) {
                return this.httpGet('getRequestAttach', params);
            }
            this.setRequestAttach = function (params) {
                return this.httpPost('setRequestAttach', params);
            }
            this.genHeadCollReport = function (params) {
                return this.httpPost('genHeadCollReport', params);
            }
            this.setGrade = function (params) {
                return this.httpPost('setGrade', params);
            }
            this.getWqs = function (params) {
                return this.httpGet('getWqs', params);
            }
            this.setWqs = function (params) {
                return this.httpPost('setWqs', params);
            }
            //getDeveloper
            this.getDeveloper = function (params) {
                return this.httpGet('getDeveloper', params);
            }
            this.setDeveloper = function (params) {
                return this.httpPost('setDeveloper', params);
            }
            this.deleteDeveloper = function (params) {
                return this.httpPost('deleteDeveloper', params);
            }
            this.getProject = function (params) {
                return this.httpGet('getProject', params);
            }
            this.setProject = function (params) {
                return this.httpPost('setProject', params);
            }
            this.deleteProject = function (params) {
                return this.httpPost('deleteProject', params);
            }
            this.getProjectUnit = function (params) {
                return this.httpGet('getProjectUnit', params);
            }
            this.setProjectUnit = function (params) {
                return this.httpPost('setProjectUnit', params);
            }
            this.deleteProjectUnit = function (params) {
                return this.httpPost('deleteProjectUnit', params);
            }
            this.getUnitType = function (params) {
                return this.httpGet('getUnitType', params);
            }
            this.getProjectPhase = function (params) {
                return this.httpGet('getProjectPhase', params);
            }
            this.setProjectPhase = function (params) {
                return this.httpPost('setProjectPhase', params);
            }
            this.deleteProjectPhase = function (params) {
                return this.httpPost('deleteProjectPhase', params);
            }
            this.getZoneByPhase = function (params) {
                return this.httpGet('getZoneByPhase', params);
            }
            this.getZoneByProject = function (params) {
                return this.httpGet('getZoneByProject', params);
            }
            this.setProjectZone = function (params) {
                return this.httpPost('setProjectZone', params);
            }
            this.deleteProjectZone = function (params) {
                return this.httpPost('deleteProjectZone', params);
            }

            this.getProjectPrice = function (params) {
                return this.httpGet('getProjectPrice', params);
            }
            this.setProjectPrice = function (params) {
                return this.httpPost('setProjectPrice', params);
            }
            this.deleteProjectPrice = function (params) {
                return this.httpPost('deleteProjectPrice', params);
            }
            this.setFormDataProject = function (params) {
                return this.httpPost('setFormDataProject', params);
            }
            //
            this.getCompletedProject = function (params) {
                return this.httpGet('getCompletedProject', params);
            }
            //getCompletedProjectUnit
            this.getCompletedProjectUnit = function (params) {
                return this.httpGet('getCompletedProjectUnit', params);
            }

            this.openDialog = function (params) {

                params = params || {};

                params.templateUrl = params.templateUrl || 'app/views/common/dialogWrapper.html';
                params.windowClass = params.windowClass || '';

                return $modal.open({
                    templateUrl: params.templateUrl,
                    controller: params.controller,
                    backdrop: 'static',
                    keyboard: false,
                    windowClass: params.windowClass,//'app-modal-window-80',
                    size: 'lg',
                    resolve: params.resolve
                });
            }


            this.getProvinceMaster = function (params) {
                return this.httpPost('getProvinceMaster', params);
            }
            this.getDistrictMaster = function (params) {
                return this.httpPost('getDistrictMaster', params);
            }
            this.getSubDistrictMaster = function (params) {
                return this.httpGet('getSubDistrictMaster', params);
            }
            this.setProvince = function (params) {
                return this.httpPost('setProvince', params);
            }
            this.deleteProvince = function (params) {
                return this.httpPost('deleteProvince', params);
            }

            this.setDistrict = function (params) {
                return this.httpPost('setDistrict', params);
            }
            this.deleteDistrict = function (params) {
                return this.httpPost('deleteDistrict', params);
            }

            this.setSubDistrict = function (params) {
                return this.httpPost('setSubDistrict', params);
            }
            this.deleteSubDistrict = function (params) {
                return this.httpPost('deleteSubDistrict', params);
            }

            this.createColleteralFromProject = function (params) {
                return this.httpPost('createColleteralFromProject', params);
            }

            this.getMarketPrice = function (params) {
                return this.httpPost('getMarketPrice', params);
            }
            this.setMarketPrice = function (params) {
                return this.httpPost('setMarketPrice', params);
            }
            this.deleteMarketPrice = function (params) {
                return this.httpPost('deleteMarketPrice', params);
            }
            this.getMarketInfo = function (params) {
                return this.httpGet('getMarketInfo', params);
            }
            this.getMarketStatus = function (params) {
                return this.httpGet('getMarketStatus', params);
            }
            this.getMarketSell = function (params) {
                return this.httpGet('getMarketSell', params);
            }
            this.getLandColor = function (params) {
                return this.httpGet('getLandColor', params);
            }
            this.getMaintainLevel = function (params) {
                return this.httpGet('getMaintainLevel', params);
            }
            this.getInteriorLevel = function (params) {
                return this.httpGet('getInteriorLevel', params);
            }
            this.getPropShape = function (params) {
                return this.httpGet('getPropShape', params);
            }
            this.getPropEvironment = function (params) {
                return this.httpGet('getPropEvironment', params);
            }
            this.getColUsage = function (params) {
                return this.httpGet('getColUsage', params);
            }
            this.getColCertType = function (params) {
                return this.httpGet('getColCertType', params);
            }
            this.getHeadColType = function (params) {
                return this.httpGet('getHeadColType', params);
            }
            this.getHeadColSubType = function (params) {
                return this.httpGet('getHeadColSubType', params);
            }
            this.setJobMarketPrice = function (params) {
                return this.httpPost('setJobMarketPrice', params);
            }
            this.deleteJobMarketPrice = function (params) {
                return this.httpPost('deleteJobMarketPrice', params);
            }
            this.getJobMarketPrice = function (params) {
                return this.httpGet('getJobMarketPrice', params);
            }
            this.getMarketType = function (params) {
                return this.httpGet('getMarketType', params);
            }
            this.getMarketTemplateType = function (params) {
                return this.httpGet('getMarketTemplateType', params);
            }
            this.setMarketCompairNumber = function (params) {
                return this.httpPost('setMarketCompairNumber', params);
            }

            this.upload = function (params) {
                return $modal.open({
                    backdrop: 'static',
                    keyboard: false,
                    templateUrl: 'app/views/tools/uploader.html',
                    controller: 'uploaderController',
                    size: 'lg',
                    resolve: {
                        params: function () {
                            return params;
                        }
                    }
                });
            }

            this.getCost = function (params) {
                return this.httpGet('getCost', params);
            }
            this.setCost = function (params) {
                return this.httpPost('setCost', params);
            }

            this.getQnrMaster = function (params) {
                return this.httpGet('getQnrMaster', params);
            }
            this.setQnrAnswer = function (params) {
                return this.httpPost('setQnrAnswer', params);
            }
            this.openMapDefineHeadColLocation = function (params, callback) {
                this.openMap({
                    page: params.page,
                    HEAD_COL_RUNNING_ID: params.HEAD_COL_RUNNING_ID || '',
                    //DEED_NO: params.DEED_NO || '',
                    DEED_DISTRICT: params.DEED_DISTRICT.CODE || '',
                    DEED_CITY: params.DEED_CITY.CITY_ID || '',
                    DEED_PROVINCE: params.DEED_PROVINCE.PROV_ID || ''
                }, callback);
            }
            this.openMapDefineProjectLocation = function (params, callback) {
                this.openMap({
                    page: params.page,
                    PROJECT_RUNNING_ID: params.PROJECT_RUNNING_ID || '',
                    DEED_DISTRICT: params.DEED_DISTRICT.CODE || '',
                    DEED_CITY: params.DEED_CITY.CITY_ID || '',
                    DEED_PROVINCE: params.DEED_PROVINCE.PROV_ID || ''
                }, callback);
            }
            this.openMapDefineMarketLocation = function (params, callback) {
                this.openMap({
                    page: params.page,
                    MARKETSTOCK_ID: params.MARKETSTOCK_ID || '',
                    ADD_NO: params.ADD_NO || '',
                    ADD_MOO: params.ADD_MOO || '',
                    ADD_SOI: params.ADD_SOI || '',
                    ADD_ROAD: params.ADD_ROAD || '',
                    ADD_DISTRICT: params.ADD_DISTRICT.CODE || '',
                    ADD_CITY: params.ADD_CITY.CITY_ID || '',
                    ADD_PROVINCE: params.ADD_PROVINCE.PROV_ID
                }, callback);
            }
            this.openMapEdit = function (params, callback) {
                this.openMap({
                    page: params.page,
                    HEAD_COL_RUNNING_ID: params.HEAD_COL_RUNNING_ID || '',
                    HEAD_COL_CODE: params.HEAD_COL_CODE || ''
                }, callback);
            }
            this.openMap = function (params, callback) {
                $log.info(params);

                var str = [];

                for (var p in params) {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(params[p] == undefined ? '' : params[p]));
                }

                //var url = 'https://gsbappraisal.cdg.co.th/rdsdWeb/api/Values/' + action + (params ? '?' + str.join("&") : '');
                //var url0 = 'https://10.254.30.85/GSBAppraisal/MainPage.aspx?page=DefineHeadColLocation&HEAD_COL_RUNNING_ID=823371&HEAD_COL_CODE=';
                //var url = '/GSBAppraisal/MainPage.aspx?page=DefineHeadColLocation&HEAD_COL_RUNNING_ID=&Deed_Province=&Deed_City=&Deed_District=&Deed_No=';
                //var url2 = 'htmlpage1.html';
                //var url = '/GSBAppraisalWeb/MainPage.aspx?' + str.join("&");

                var url = $rootScope.appConfig.mapUrl + '/MainPage.aspx?' + str.join("&");

                window.openMapCallback = callback;

                window.open(url, 'abc', 'location=1,status=1,scrollbars=1, width=600,height=600', true);

                //return deferred.promise;
            }
            this.gisPostFeatureUrl = function (params) {
                var deferred = $q.defer();
                var postData = {
                    token: params.token || '',
                    f: 'json',
                    adds: angular.toJson(params.adds) || '',
                    updates: angular.toJson(params.updates) || ''
                };
                var config = {
                    url: params.featureUrl,
                    method: 'POST',
                    data: postData,//$httpParamSerializerJQLike(postData),
                    transformRequest: function (obj) {
                        var str = [];
                        for (var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        return str.join("&");
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                };

                $http(config).then(function (response) {
                    deferred.resolve(response);
                }, function (response) {
                    if (typeof (response.data) == 'object') {
                        SweetAlert.swal(response.data.Message, response.data.ExceptionMessage);
                    } else {
                        SweetAlert.swal(response.status + ' : ' + response.statusText, url);
                    }
                    deferred.reject(response);
                });

                return deferred.promise;
            }

            this.getQnrPackage = function (params) {
                return this.httpGet('getQnrPackage', params);
            }

            this.getQuestionnaire = function (params) {
                return this.httpGet('getQuestionnaire', params);
            }

            this.setQuestionnaire = function (params) {
                return this.httpPost('setQuestionnaire', params);
            }
            this.getQnrResult = function (params) {
                return this.httpGet('getQnrResult', params);
            }
            this.getCOLL_ID = function (params) {
                return this.httpGet('getCOLL_ID', params);
            }
            this.setCOLL_ID = function (params) {
                return this.httpPost('setCOLL_ID', params);
            }
            this.getCalendar = function (params) {
                return this.httpGet('getCalendar', params);
            }
            this.setCalendar = function (params) {
                return this.httpPost('setCalendar', params);
            }
            this.deleteCalendar = function (params) {
                return this.httpPost('deleteCalendar', params);
            }
            this.genRequestCommittee = function (params) {
                return this.httpGet('genRequestCommittee', params);
            }
            this.downloadFile = function (attachDoc) {
                var url = 'home/download/' + attachDoc.ATTACHDOC_RUNNING_ID;
                //window.location = url;
                window.open(url);

                //$('<a target="_blank" href="' + url + '"></a>').click();
            }
            this.tempDownload = function (tempFileName) {
                var url = 'home/tempDownload/' + tempFileName;
                window.open(url);
            }
            this.approverSave = function (params) {
                return this.httpPost('approverSave', params);
            }
            this.approverSaveSend = function (params) {
                return this.httpPost('approverSaveSend', params);
            }
            this.splitSubCol = function (headCol, subCol) {
                this.debug(headCol);
                this.debug(subCol);
                var url = 'splitSubCol_' + subCol.HEAD_COL_TYPE;
                this.debug(url);
                return this.httpPost(url, subCol);
            }

            this.getRptFiles = function () {
                return this.httpGet('getRptFiles', {});
            }
            this.testCrystalReport = function (params) {
                return this.httpGet('testCrystalReport', params);
            }
            this.httpRequest = function (params) {
                return this.httpGet('httpRequest', params);
            }
            this.getAppConfig = function () {
                return this.httpGet('getAppConfig', {});
            }
            this.deleteColCus = function (params) {
                return this.httpPost('deleteColCus', params);
            }
            this.getAllOU = function (params) {
                return this.httpGet('getAllOU', params);
            }
            this.getOURoles = function (params) {
                return this.httpGet('getOURoles', params);
            }
            this.getDocStateV2 = function (params) {
                var ROLE_ID = $rootScope.role && $rootScope.role.ROLE_RUNNING_ID ? $rootScope.role.ROLE_RUNNING_ID : 0;
                params.ROLE_ID = ROLE_ID;
                return this.httpGet('getDocStateV2', params);
            }
            this.getDocActHist = function (params) {
                return this.httpGet('getDocActHist', params);
            }
            this.getCustRelation = function (params) {
                return this.httpGet('getCustRelation', params);
            }
            this.getAcquireVia = function (params) {
                return this.httpGet('getAcquireVia', params);
            }
            this.getDeedOffice = function (params) {
                return this.httpGet('getDeedOffice', params);
            }
            this.getInsuredCode = function (params) {
                return this.httpGet('getInsuredCode', params);
            }
            this.getContactResult = function (params) {
                return this.httpGet('getContactResult', params);
            }
            this.getCustContact = function (params) {
                return this.httpGet('getCustContact', params);
            }
            this.setCustContact = function (params) {
                return this.httpPost('setCustContact', params);
            }
            this.delCustContact = function (params) {
                return this.httpPost('delCustContact', params);
            }
            this.getMasterOrgRoles = function (params) {
                return this.httpGet('getMasterOrgRoles', params);
            }
            this.setMasterOrgRoles = function (params) {
                return this.httpPost('setMasterOrgRoles', params);
            }
            this.getMasterUser = function (params) {
                return this.httpGet('getMasterUser', params);
            }
            this.setMasterUser = function (params) {
                return this.httpPost('setMasterUser', params);
            }
            this.getPrefix = function (params) {
                return this.httpGet('getPrefix', params);
            }
            this.getOU = function (params) {
                return this.httpGet('getOU', params);
            }
            this.changeUserValue = function (params) {
                return this.httpPost('changeUserValue', params);
            }
            this.getParameter = function (params) {
                return this.httpGet('getParameter', params);
            }
            this.setParameter = function (params) {
                return this.httpPost('setParameter', params);
            }
            this.delParameter = function (params) {
                return this.httpPost('delParameter', params);
            }
            this.getLenders = function (params) {
                return this.httpGet('getLenders', params);
            }
            this.getLender = function (params) {
                return this.httpGet('getLender', params);
            }
            this.setLender = function (params) {
                return this.httpPost('setLender', params);
            }
            this.delLender = function (params) {
                return this.httpPost('delLender', params);
            }
            //this.getAppraisalMethod = function (params) {
            //    return this.httpGet('getAppraisalMethod', params);
            //}
            this.getHeadColAppraisalModel = function (params) {
                return this.httpGet('getHeadColAppraisalModel', params);
            }
            this.setHeadColAppraisalModel = function (params) {
                return this.httpPost('setHeadColAppraisalModel', params);
            }
            this.getHeadColAppraisalList = function (params) {
                return this.httpGet('getHeadColAppraisalList', params);
            }
            this.genAppraisalReport = function (params) {
                return this.httpPost('genAppraisalReport', params);
            }
            this.getRequestAttachForApprover = function (params) {
                return this.httpGet('getRequestAttachForApprover', params);
            }
            this.getHeadColPhoto = function (params) {
                return this.httpGet('getHeadColPhoto', params);
            }
            this.getPhotoTakenPoint = function (params) {
                return this.httpGet('getPhotoTakenPoint', params);
            }
            this.getHeadColById = function (params) {
                return this.httpGet('getHeadColById', params);
            }
            this.getRequestFormByNo = function (params) {
                return this.httpGet('getRequestFormByNo', params);
            }
            this.createReviewJob = function (params) {
                return this.httpGet('createReviewJob', params);
            }
            this.getWqsFactorList = function (params) {
                return this.httpGet('getWqsFactorList', params);
            }
            this.deleteHeadColWqs = function (params) {
                return this.httpGet('deleteHeadColWqs', params);
            }
            this.getSurveyChkBuild = function () {
                return this.httpGet('getSurveyChkBuild', {});
            }
            this.getOnstComplete = function () {
                return this.httpGet('getOnstComplete', {});
            }
            this.getEvaluatePlan = function () {
                return this.httpGet('getEvaluatePlan', {});
            }
            this.getProvinceDOL = function (params) {
                return this.httpGet('getProvinceDOL', params);
            }
            this.getDistrictDOL = function (params) {
                return this.httpGet('getDistrictDOL', params);
            }
            this.getSubDistrictDOL = function (params) {
                return this.httpGet('getSubDistrictDOL', params);
            }
            this.setDATE_APPRAI_EVALUATE = function (params) {
                return this.httpPost('setDATE_APPRAI_EVALUATE', params);
            }
        }]);