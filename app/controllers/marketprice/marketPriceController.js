app.controller('marketPriceController', ['$scope', '$rootScope', '$state', '$stateParams', 'radasoft', '$modal', '$translate', '$q', function ($scope, $rootScope, $state, $stateParams, radasoft, $modal, $translate, $q) {
    $scope.marketprices = [];
    $scope.marketPriceTotalItems = 0;
    $scope.marketPriceCurrentPage = 1;

    $scope.myFilter = {
        TEMPLATE_TYPE: {},
        HEAD_COL_TYPE: {},
        SUB_COL_TYPE: {},
        FROM_AGE: 0,
        THRU_AGE: 0,
        PROVINCE: {},
        DISTRICT: {},
        SUBDISTRICT: {}
    };

    $scope.onResetSearch = function () {
        $scope.myFilter = {
            TEMPLATE_TYPE: {},
            HEAD_COL_TYPE: {},
            SUB_COL_TYPE: {},
            FROM_AGE: 0,
            THRU_AGE: 0,
            PROVINCE: {},
            DISTRICT: {},
            SUBDISTRICT: {}
        };
    }

    $scope.getProvince = function () {
        var deffered = $q.defer();
        radasoft.getProvince({}).then(function (response) {
            $scope.selectProvince = response.data;
            deffered.resolve();
        });
        return deffered.promise;
    }
    $scope.getDistrict = function (item) {
        var deffered = $q.defer();

        $scope.myFilter.DISTRICT = {};
        $scope.selectDistrict = [];
        $scope.myFilter.SUBDISTRICT = {};
        $scope.selectSubDistrict = [];

        radasoft.getDistrict({ PROVINCE_ID: item.PROV_ID }).then(function (response) {
            $scope.selectDistrict = response.data;
            deffered.resolve();
        });
        return deffered.promise;
    }
    $scope.getSubDistrict = function (item) {
        var deffered = $q.defer();

        $scope.myFilter.SUBDISTRICT = {};
        $scope.selectSubDistrict = [];

        radasoft.getSubDistrict({ PROVINCE_ID: item.PROVINCE_ID, DISTRICT_ID: item.CITY_ID }).then(function (response) {
            $scope.selectSubDistrict = response.data;
        });
        return deffered.promise;
    }

    $scope.onSearchClick = function () {
        $scope.getPriceMarketStocklist();
    }

    $scope.onHeadColTypeChange = function (item) {
        $scope.myFilter.SUB_COL_TYPE = {};
        $scope.getHeadColSubType(item);
    }
    $scope.getHeadColType = function () {
        var deferred = $q.defer();
        if ($rootScope.headColType == undefined) {
            radasoft.getHeadColType({}).then(function (response) {
                $rootScope.headColType = response.data;

                $scope.headColType = $rootScope.headColType;
            }).finally(function () {
                deferred.resolve();
            });
        } else {
            deferred.resolve();
        }
        return deferred.promise;
    }

    $scope.getHeadColSubType = function (headColType) {
        var deferred = $q.defer();
        radasoft.getHeadColSubType({ MAIN_CODE: headColType.VALUE }).then(function (response) {
            $scope.headColSubType = response.data;
        }).finally(function () {
            deferred.resolve();
        });

        return deferred.promise;
    }

    $scope.getPriceMarketStocklist = function () {
        radasoft.getPriceMarketStocklist({
            limit: $rootScope.app.itemsPerPage,
            page: $scope.marketPriceCurrentPage,
            filters: [
                { NAME: 'TEMPLATE_TYPE', VALUE: $scope.myFilter.TEMPLATE_TYPE.VALUE || '' },
                { NAME: 'HEAD_COL_TYPE', VALUE: $scope.myFilter.HEAD_COL_TYPE.VALUE || '' },
                { NAME: 'SUB_COL_TYPE', VALUE: $scope.myFilter.SUB_COL_TYPE.VALUE || '' },
                { NAME: 'FROM_AGE', VALUE: $scope.myFilter.FROM_AGE || 0 },
                { NAME: 'THRU_AGE', VALUE: $scope.myFilter.THRU_AGE || 0 },
                { NAME: 'PROVINCE', VALUE: $scope.myFilter.PROVINCE.PROV_ID || '' },
                { NAME: 'DISTRICT', VALUE: $scope.myFilter.DISTRICT.CITY_ID || '' },
                { NAME: 'SUBDISTRICT', VALUE: $scope.myFilter.SUBDISTRICT.CODE || '' }
            ]
        }).then(function (response) {
            $scope.marketprices = response.data.data;
            $scope.marketPriceTotalItems = response.data.totals;

            if (response.data.data.length == 0) {
                radasoft.alert($translate.instant('NO_DATA_FOUND'));
            }
        });
    }

    $scope.openMarketPriceDialog = function (data) {
        radasoft.openDialog({
            controller: 'marketPriceDetailController',
            resolve: {
                params: function () {
                    return {
                        includeUrl: '/app/views/setting/marketprice/marketPriceDetail2.html',
                        formData: data,
                        dataMode: 0,//editable
                        showBtnDelete: true
                    };
                }
            }
        }).result.then(function (reload) {
            if (reload) {
                $scope.getPriceMarketStocklist();
            }
        });
    }

    $scope.editMarketPrice = function (data) {
        $scope.openMarketPriceDialog(data, data.HEAD_COL_TYPE_ID);
    }

    $scope.addMarketPrice = function () {
        radasoft.openDialog({
            controller: 'wqsFactorListCtrl',
            resolve: {
                params: function () {
                    return {
                        HEAD_COL_TYPE_ID: '',
                        HEAD_COL_RUNNING_ID: 0
                    };
                }
            }
        }).result.then(function (NV) {
            $scope.openMarketPriceDialog({
                MARKETSTOCK_RUNNING_ID: 0,
                TEMPLATE_TYPE: NV
            });
        });
    }

    $scope.pageChanged = function () {
        $scope.getPriceMarketStocklist();
    }

    $scope.init = function () {
        $scope.getHeadColType().then(function (response) {
            $scope.getProvince().then(function (response) {
                //$scope.getPriceMarketStocklist();
            });
        });
    }
    $scope.init();
}]);

app.controller('jobMarketPriceDetailCtrl', ['$scope', '$rootScope', '$state', 'toaster', '$modal', '$translate', 'SweetAlert', '$modalInstance', 'radasoft', 'params', '$q', function ($scope, $rootScope, $state, toaster, $modal, $translate, SweetAlert, $modalInstance, radasoft, params, $q) {
    $scope.random = Math.random().toString().replace('.', '');
    $scope.btnDisabled = false;
    $scope.btnSubmitDisabled = false;
    $scope.dataMode = params.dataMode;

    $scope.includeUrl = params.includeUrl;
    $scope.title = $translate.instant('MARKETPRICE');
    $scope.showBtnSave = true;
    $scope.showBtnDelete = params.showBtnDelete || false;

    $scope.formData = params.formData;

    $scope.upload = function () {
        return radasoft.upload({
            config: 'upload/photomarket',
            id1: $scope.formData.JMP_RUNNING_ID,
            imageFilter: true,
            limit: 1
        });
    }

    $scope.uploadPicture = function () {
        $scope.upload().result.then(function (data) {
            if (data[0]) {
                $scope.random = Math.random().toString().replace('.', '');
                $scope.formData.PICTURE = data[0];
            }
        });
    }

    $scope.uploadPictureSign = function () {
        $scope.upload().result.then(function (data) {
            if (data[0]) {
                $scope.random = Math.random().toString().replace('.', '');
                $scope.formData.PICTURE_SIGN = data[0];
            }
        });
    }

    $scope.getPriceMarketDetail = function () {
        radasoft.getJobMarketPriceDetail({ JMP_RUNNING_ID: params.formData.JMP_RUNNING_ID }).then(function (response) {
            if (response.data == null) {
                $scope.formData = params.formData;
            } else {
                $scope.formData = response.data;
            }

            if ($scope.formData.JMP_RUNNING_ID == 0) {
                //$scope.formData.TEMPLATE_TYPE = undefined;
            }
            $scope.random = Math.random().toString().replace('.', '');
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
                    radasoft.setJobMarketPrice($scope.formData).then(function (response) {
                        radasoft.success();
                        $modalInstance.close(false);
                    });
                }
            });
        }
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.init = function () {
        $scope.getPriceMarketDetail();
    }

    $scope.init();
}]);

app.controller('marketPriceDetailController', ['$scope', '$rootScope', '$state', 'toaster', '$modal', '$translate', 'SweetAlert', '$modalInstance', 'radasoft', 'params', '$q', function ($scope, $rootScope, $state, toaster, $modal, $translate, SweetAlert, $modalInstance, radasoft, params, $q) {
    $scope.random = Math.random().toString().replace('.', '');
    $scope.btnDisabled = false;
    $scope.btnSubmitDisabled = false;
    $scope.dataMode = params.dataMode;

    $scope.includeUrl = params.includeUrl;
    $scope.title = $translate.instant('MARKETPRICE') + '(' + params.formData.TEMPLATE_TYPE.CODE_MINOR_NAME + ')';
    $scope.showBtnSave = true;
    $scope.showBtnDelete = params.showBtnDelete || false;

    $scope.headColType = $rootScope.headColType || [];
    $scope.headColSubType = [];
    $scope.colCertType = $rootScope.colCertType || [];
    $scope.colUsage = $rootScope.colUsage || [];
    $scope.propEnvironment = $rootScope.propEnvironment || [];
    $scope.landShape = $rootScope.landShape || [];
    $scope.landScape = $rootScope.landScape || [];
    $scope.interiorLevel = $rootScope.interiorLevel || [];
    $scope.maintainLevel = $rootScope.maintainLevel || [];
    $scope.landColor = $rootScope.landColor || [];
    $scope.marketSell = $rootScope.marketSell || [];
    $scope.marketStatus = $rootScope.marketStatus || [];
    $scope.marketInfo = $rootScope.marketInfo || [];
    $scope.province = $rootScope.province || [];
    $scope.district = $rootScope.district || [];
    $scope.subDistrict = $rootScope.subDistrict || [];
    $scope.province = $rootScope.province || [];
    $scope.subDistrict = $rootScope.subDistrict || [];
    $scope.marketType = $rootScope.marketType || [];
    $scope.marketTemplateType = $rootScope.marketTemplateType || [];
    $scope.roadType = $rootScope.roadType || [];
    $scope.country = $rootScope.country || [];

    $scope.potential = [{ VALUE: 'G', NAME: $translate.instant('HEIGHT') }, { VALUE: 'M', NAME: $translate.instant('MEDIUM') }, { VALUE: 'L', NAME: $translate.instant('LOW') }];

    $scope.formUrl = '/app/views/setting/marketprice/marketPriceDetail2_' + params.formData.TEMPLATE_TYPE.CONDITION1 + '.html';

    $scope.dpOpenState = {};

    $scope.openDatePicker = function ($event, elementOpened) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.dpOpenState[elementOpened] = !$scope.dpOpenState[elementOpened];
    }

    $scope.openMap = function () {
        var MARKETSTOCK_ID = '';

        if ($scope.formData.LATITUDE != null
            && $scope.formData.LATITUDE != undefined
            && $scope.formData.LATITUDE != ''
            && $scope.formData.LONGITUDE != null
            && $scope.formData.LONGITUDE != undefined
            && $scope.formData.LONGITUDE != '') {
            MARKETSTOCK_ID = $scope.formData.MARKETSTOCK_RUNNING_ID;
        }

        var ADD_PROVINCE = $scope.formData.ADD_PROVINCE || {};
        var ADD_CITY = $scope.formData.ADD_CITY || {};
        var ADD_DISTRICT = $scope.formData.ADD_DISTRICT || {};

        radasoft.openMapDefineMarketLocation({
            page: 'DefineMarketLocation',
            MARKETSTOCK_ID: MARKETSTOCK_ID,
            ADD_NO: $scope.formData.ADD_NO,
            ADD_MOO: $scope.formData.ADD_MOO,
            ADD_SOI: $scope.formData.ADD_SOI,
            ADD_ROAD: $scope.formData.ADD_ROAD,
            ADD_PROVINCE: ADD_PROVINCE,// MARKETSTOCK_ID == '' ? {} : ADD_PROVINCE,
            ADD_CITY: ADD_CITY,// MARKETSTOCK_ID == '' ? {} : ADD_CITY,
            ADD_DISTRICT: ADD_DISTRICT // MARKETSTOCK_ID == '' ? {} : ADD_DISTRICT
        }, function (args) {
            $scope.mapReturnArgs = args;
            $scope.formData.LATITUDE = args.location.lat;
            $scope.formData.LONGITUDE = args.location.lon;
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
                    if ($scope.dataMode == 0) {
                        radasoft.setMarketPrice($scope.formData).then(function (response) {
                            if ($scope.mapReturnArgs == undefined) {
                                radasoft.success();
                                $modalInstance.close(true);
                            } else {
                                //$scope.mapReturnArgs.response.graphic[0].attributes.MARKETSTOCK_ID = response.data.MARKETSTOCK_RUNNING_ID;
                                var attributes = angular.fromJson($scope.mapReturnArgs.response.graphic[0].attributes);
                                var geometry = angular.fromJson($scope.mapReturnArgs.response.graphic[0].geometry);
                                var graphic = [{ attributes: attributes, geometry: geometry }];

                                graphic[0].attributes.MARKETSTOCK_ID = response.data.MARKETSTOCK_RUNNING_ID;

                                radasoft.gisPostFeatureUrl({
                                    featureUrl: $scope.mapReturnArgs.response.featureUrl,
                                    token: $scope.mapReturnArgs.response.token,
                                    adds: graphic[0].attributes.OBJECTID == undefined ? graphic : [],
                                    updates: graphic[0].attributes.OBJECTID != undefined ? graphic : []
                                }).then(function () {
                                    radasoft.success();
                                    $modalInstance.close(true);
                                });
                            }
                        });
                    } else if ($scope.dataMode == 1) {
                        radasoft.setJobMarketPrice($scope.formData).then(function (response) {
                            radasoft.success();
                            $modalInstance.close(false);
                        });
                    }
                }
            });
        }
    };

    $scope.delete = function () {
        radasoft.confirmAndSave($translate.instant('CONFIRM.DELETE'), '', function (isconfirmed) {
            if (isconfirmed) {
                radasoft.deleteMarketPrice($scope.formData).then(function (response) {
                    radasoft.success();
                    $modalInstance.close(true);
                });
            }
        });
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.getHeadColType = function () {
        var deferred = $q.defer();

        if ($rootScope.headColType == undefined) {
            radasoft.getHeadColType({}).then(function (response) {
                $rootScope.headColType = response.data;

                $scope.headColType = $rootScope.headColType;
            }).finally(function () {
                deferred.resolve();
            });
        } else {
            deferred.resolve();
        }

        return deferred.promise;
    }

    $scope.getCountry = function () {
        var deferred = $q.defer();

        if ($rootScope.country == undefined) {
            radasoft.getCountry({}).then(function (response) {
                $rootScope.country = response.data;

                $scope.country = $rootScope.country;
            }).finally(function () {
                deferred.resolve();
            });
        } else {
            deferred.resolve();
        }

        return deferred.promise;
    }

    $scope.getColCertType = function () {
        var deferred = $q.defer();

        if ($rootScope.colCertType == undefined) {
            radasoft.getColCertType({}).then(function (response) {
                $rootScope.colCertType = response.data;

                $scope.colCertType = $rootScope.colCertType;
            }).finally(function () {
                deferred.resolve();
            });
        } else {
            deferred.resolve();
        }

        return deferred.promise;
    }
    $scope.getColUsage = function () {
        var deferred = $q.defer();

        if ($rootScope.colUsage == undefined) {
            radasoft.getColUsage({}).then(function (response) {
                $rootScope.colUsage = response.data;

                $scope.colUsage = $rootScope.colUsage;
            }).finally(function () {
                deferred.resolve();
            });
        } else {
            deferred.resolve();
        }

        return deferred.promise;
    }
    $scope.getPropEvironment = function () {
        var deferred = $q.defer();

        if ($rootScope.propEnvironment == undefined) {
            radasoft.getPropEvironment({}).then(function (response) {
                $rootScope.propEnvironment = response.data;

                $scope.propEnvironment = $rootScope.propEnvironment;
            }).finally(function () {
                deferred.resolve();
            });
        } else {
            deferred.resolve();
        }

        return deferred.promise;
    }
    $scope.getPropShape = function () {
        var deferred = $q.defer();

        if ($rootScope.landShape == undefined) {
            radasoft.getPropShape({}).then(function (response) {
                $rootScope.landShape = response.data;

                $scope.landShape = $rootScope.landShape;
            }).finally(function () {
                deferred.resolve();
            });
        } else {
            deferred.resolve();
        }

        return deferred.promise;
    }
    $scope.getLandScape = function () {
        var deferred = $q.defer();

        if ($rootScope.landScape == undefined) {
            radasoft.getLandScape({}).then(function (response) {
                $rootScope.landScape = response.data;

                $scope.landScape = $rootScope.landScape;
            }).finally(function () {
                deferred.resolve();
            });
        } else {
            deferred.resolve();
        }

        return deferred.promise;
    }
    $scope.getInteriorLevel = function () {
        var deferred = $q.defer();

        if ($rootScope.interiorLevel == undefined) {
            radasoft.getInteriorLevel({}).then(function (response) {
                $rootScope.interiorLevel = response.data;

                $scope.interiorLevel = $rootScope.interiorLevel;
            }).finally(function () {
                deferred.resolve();
            });
        } else {
            deferred.resolve();
        }

        return deferred.promise;
    }
    //getMaintainLevel
    $scope.getMaintainLevel = function () {
        var deferred = $q.defer();

        if ($rootScope.maintainLevel == undefined) {
            radasoft.getMaintainLevel({}).then(function (response) {
                $rootScope.maintainLevel = response.data;

                $scope.maintainLevel = $rootScope.maintainLevel;
            }).finally(function () {
                deferred.resolve();
            });
        } else {
            deferred.resolve();
        }

        return deferred.promise;
    }
    //getLandColor
    $scope.getLandColor = function () {
        var deferred = $q.defer();

        if ($rootScope.landColor == undefined) {
            radasoft.getLandColor({}).then(function (response) {
                $rootScope.landColor = response.data;

                $scope.landColor = $rootScope.landColor;
            }).finally(function () {
                deferred.resolve();
            });
        } else {
            deferred.resolve();
        }

        return deferred.promise;
    }
    //getMarketSell
    $scope.getMarketSell = function () {
        var deferred = $q.defer();

        if ($rootScope.marketSell == undefined) {
            radasoft.getMarketSell({}).then(function (response) {
                $rootScope.marketSell = response.data;

                $scope.marketSell = $rootScope.marketSell;
            }).finally(function () {
                deferred.resolve();
            });
        } else {
            deferred.resolve();
        }

        return deferred.promise;
    }
    //getMarketStatus
    $scope.getMarketStatus = function () {
        var deferred = $q.defer();

        if ($rootScope.marketStatus == undefined) {
            radasoft.getMarketStatus({}).then(function (response) {
                $rootScope.marketStatus = response.data;

                $scope.marketStatus = $rootScope.marketStatus;
            }).finally(function () {
                deferred.resolve();
            });
        } else {
            deferred.resolve();
        }

        return deferred.promise;
    }
    //getMarketInfo
    $scope.getMarketInfo = function () {
        var deferred = $q.defer();

        if ($rootScope.marketInfo == undefined) {
            radasoft.getMarketInfo({}).then(function (response) {
                $rootScope.marketInfo = response.data;

                $scope.marketInfo = $rootScope.marketInfo;
            }).finally(function () {
                deferred.resolve();
            });
        } else {
            deferred.resolve();
        }

        return deferred.promise;
    }
    $scope.getProvince = function () {
        var deferred = $q.defer();

        if ($rootScope.province == undefined) {
            radasoft.getProvince({}).then(function (response) {
                $rootScope.province = response.data;

                $scope.province = $rootScope.province;
            }).finally(function () {
                deferred.resolve();
            });
        } else {
            deferred.resolve();
        }

        return deferred.promise;
    }

    $scope.getDistrict = function (item) {
        var deferred = $q.defer();

        radasoft.getDistrict({
            PROVINCE_ID: item == undefined ? '' : item.PROV_ID
        }).then(function (response) {
            $rootScope.district = response.data;

            $scope.district = $rootScope.district;
        }).finally(function () {
            deferred.resolve();
        });

        return deferred.promise;
    }

    $scope.getSubDistrict = function (item1, item2) {
        var deferred = $q.defer();

        radasoft.getSubDistrict({
            PROVINCE_ID: item1 == undefined ? '' : item1.PROV_ID,
            DISTRICT_ID: item2 == undefined ? '' : item2.CITY_ID
        }).then(function (response) {
            $rootScope.subDistrict = response.data;

            $scope.subDistrict = $rootScope.subDistrict;
        }).finally(function () {
            deferred.resolve();
        });

        return deferred.promise;
    }
    $scope.getMarketType = function (item1, item2) {
        var deferred = $q.defer();

        radasoft.getMarketType({}).then(function (response) {
            $rootScope.marketType = response.data;
            $scope.marketType = $rootScope.marketType;
        }).finally(function () {
            deferred.resolve();
        });

        return deferred.promise;
    }
    //$scope.getMarketTemplateType = function () {
    //    var deferred = $q.defer();

    //    radasoft.getMarketTemplateType({}).then(function (response) {
    //        $rootScope.marketTemplateType = response.data;
    //        $scope.marketTemplateType = $rootScope.marketTemplateType;
    //    }).finally(function () {
    //        deferred.resolve();
    //    });

    //    return deferred.promise;
    //}
    $scope.getHeadColSubType = function (headColType) {
        var deferred = $q.defer();
        $scope.formData.HEAD_COL_SUB_TYPE = null;
        radasoft.getHeadColSubType({ MAIN_CODE: headColType != undefined ? headColType.VALUE : '' }).then(function (response) {
            $scope.headColSubType = response.data;
        }).finally(function () {
            deferred.resolve();
        });

        return deferred.promise;
    }
    $scope.onProvinceChange = function (data) {
        $scope.district = [];
        $scope.subDistrict = [];
        $scope.formData.ADD_CITY = null;
        $scope.formData.ADD_DISTRICT = null;

        $scope.getDistrict(data);
    }
    $scope.onDistrictChange = function (data) {
        $scope.subDistrict = [];
        $scope.formData.ADD_DISTRICT = null;

        $scope.getSubDistrict($scope.formData.ADD_PROVINCE, data);
    }
    $scope.getRoadType = function () {
        var deferred = $q.defer();
        radasoft.getRoadType({}).then(function (response) {
            $rootScope.roadType = response.data;
            $scope.roadType = $rootScope.roadType;
        }).finally(function () {
            deferred.resolve();
        });

        return deferred.promise;
    }

    $scope.upload = function () {
        return radasoft.upload({
            config: 'upload/photomarket',
            id1: $scope.formData.JMP_RUNNING_ID,
            imageFilter: true,
            limit: 1
        });
    }

    $scope.uploadPicture = function () {
        $scope.upload().result.then(function (data) {
            if (data[0]) {
                $scope.random = Math.random().toString().replace('.', '');
                $scope.formData.PICTURE = data[0];
            }
        });
    }

    $scope.uploadPictureSign = function () {
        $scope.upload().result.then(function (data) {
            if (data[0]) {
                $scope.random = Math.random().toString().replace('.', '');
                $scope.formData.PICTURE_SIGN = data[0];
            }
        });
    }

    $scope.getPriceMarketDetail = function () {
        var deferred = $q.defer();

        if ($scope.dataMode == 0) {
            radasoft.getPriceMarketDetail({ MARKETSTOCK_RUNNING_ID: params.formData.MARKETSTOCK_RUNNING_ID }).then(function (response) {
                if (response.data == null) {
                    $scope.formData = params.formData;
                } else {
                    $scope.formData = response.data;
                }

                if ($scope.formData.JMP_RUNNING_ID == 0) {
                    //$scope.formData.TEMPLATE_TYPE = undefined;
                }
                $scope.random = Math.random().toString().replace('.', '');
                deferred.resolve(response.data);
            });
        } else if ($scope.dataMode == 1) {
            radasoft.getJobMarketPriceDetail({ JMP_RUNNING_ID: params.formData.JMP_RUNNING_ID }).then(function (response) {
                if (response.data == null) {
                    $scope.formData = params.formData;
                } else {
                    $scope.formData = response.data;
                }

                if ($scope.formData.JMP_RUNNING_ID == 0) {
                    //$scope.formData.TEMPLATE_TYPE = undefined;
                }
                $scope.random = Math.random().toString().replace('.', '');
                deferred.resolve(response.data);
            });
        } else {
            deferred.resolve();
        }


        return deferred.promise;
    }

    $scope.init = function () {
        $scope.getPriceMarketDetail().then(function () {
            $scope.getHeadColType().then(function () {
                $scope.getColCertType().then(function () {
                    $scope.getColUsage().then(function () {
                        $scope.getPropEvironment().then(function () {
                            $scope.getPropShape().then(function () {
                                $scope.getLandScape().then(function () {
                                    $scope.getInteriorLevel().then(function () {
                                        $scope.getMaintainLevel().then(function () {
                                            $scope.getLandColor().then(function () {
                                                $scope.getMarketSell().then(function () {
                                                    $scope.getMarketStatus().then(function () {
                                                        $scope.getMarketInfo().then(function () {
                                                            $scope.getMarketType().then(function () {
                                                                $scope.getProvince().then(function () {
                                                                    $scope.getDistrict($scope.formData.ADD_PROVINCE || {}).then(function () {
                                                                        $scope.getSubDistrict($scope.formData.ADD_PROVINCE, $scope.formData.ADD_CITY).then(function () {
                                                                            $scope.getHeadColSubType($scope.formData.HEAD_COL_TYPE_ID).then(function () {
                                                                                $scope.getRoadType().then(function () {
                                                                                    $scope.getCountry();
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

    $scope.init();
}]);

app.controller('marketPriceSelectionDialogController', ['$scope', '$rootScope', '$state', 'toaster', '$modal', '$translate', 'SweetAlert', '$modalInstance', 'radasoft', 'params', '$q', function ($scope, $rootScope, $state, toaster, $modal, $translate, SweetAlert, $modalInstance, radasoft, params, $q) {
    $scope.includeUrl = params.includeUrl;
    $scope.title = $translate.instant('MARKETPRICE');
    $scope.params = params;

    $scope.$on('closeDialog', function (args) {
        $modalInstance.close(args);
    });

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

app.controller('marketPriceSelectionController', ['$scope', '$rootScope', '$state', 'toaster', '$modal', '$translate', 'SweetAlert', 'radasoft', '$q', function ($scope, $rootScope, $state, toaster, $modal, $translate, SweetAlert, radasoft, $q) {

    $scope.btnDisabled = false;
    $scope.btnSubmitDisabled = false;

    $scope.totalRecords = 0;
    $scope.currentPageNumber = 1;

    $scope.marketprices = [];

    $scope.headColType = [];
    $scope.headColSubType = [];

    $scope.myFilter = {
        TEMPLATE_TYPE: $scope.$parent.params.data.TEMPLATE_TYPE.CONDITION2,
        HEAD_COL_TYPE: {},
        SUB_COL_TYPE: {},
        FROM_AGE: 0,
        THRU_AGE: 0,
        PROVINCE: {},
        DISTRICT: {},
        SUBDISTRICT: {}
    };

    $scope.onResetSearch = function () {
        $scope.myFilter = {
            TEMPLATE_TYPE: $scope.$parent.params.data.TEMPLATE_TYPE.CONDITION2,
            HEAD_COL_TYPE: {},
            SUB_COL_TYPE: {},
            FROM_AGE: 0,
            THRU_AGE: 0,
            PROVINCE: {},
            DISTRICT: {},
            SUBDISTRICT: {}
        };
    }

    $scope.onSearchClick = function () {
        $scope.getMarketPriceSelection();
    }

    $scope.getProvince = function () {
        var deffered = $q.defer();
        radasoft.getProvince({}).then(function (response) {
            $scope.selectProvince = response.data;
            deffered.resolve();
        });
        return deffered.promise;
    }
    $scope.getDistrict = function (item) {
        var deffered = $q.defer();

        $scope.myFilter.DISTRICT = {};
        $scope.selectDistrict = [];
        $scope.myFilter.SUBDISTRICT = {};
        $scope.selectSubDistrict = [];

        radasoft.getDistrict({ PROVINCE_ID: item.PROV_ID }).then(function (response) {
            $scope.selectDistrict = response.data;

            deffered.resolve();
        });
        return deffered.promise;
    }
    $scope.getSubDistrict = function (item) {
        var deffered = $q.defer();

        $scope.myFilter.SUBDISTRICT = {};
        $scope.selectSubDistrict = [];

        radasoft.getSubDistrict({ PROVINCE_ID: item.PROVINCE_ID, DISTRICT_ID: item.CITY_ID }).then(function (response) {
            $scope.selectSubDistrict = response.data;
        });
        return deffered.promise;
    }

    $scope.onHeadColTypeChange = function (item) {
        $scope.myFilter.SUB_COL_TYPE = {};
        $scope.getHeadColSubType(item);
    }
    $scope.getHeadColType = function () {
        var deferred = $q.defer();

        radasoft.getHeadColType({}).then(function (response) {
            $scope.headColType = response.data;
        }).finally(function () {
            deferred.resolve();
        });

        return deferred.promise;
    }

    $scope.getHeadColSubType = function (headColType) {
        var deferred = $q.defer();
        radasoft.getHeadColSubType({ MAIN_CODE: headColType.VALUE }).then(function (response) {
            $scope.headColSubType = response.data;
        }).finally(function () {
            deferred.resolve();
        });

        return deferred.promise;
    }

    $scope.getMarketPriceSelection = function () {
        radasoft.getPriceMarketStocklist({
            limit: $rootScope.app.itemsPerPage,
            page: $scope.currentPageNumber,
            filters: [
                { NAME: 'TEMPLATE_TYPE', VALUE: $scope.$parent.params.data.TEMPLATE_TYPE.CONDITION2 },
                { NAME: 'HEAD_COL_TYPE', VALUE: $scope.myFilter.HEAD_COL_TYPE.VALUE || '' },
                { NAME: 'SUB_COL_TYPE', VALUE: $scope.myFilter.SUB_COL_TYPE.VALUE || '' },
                { NAME: 'FROM_AGE', VALUE: $scope.myFilter.FROM_AGE || 0 },
                { NAME: 'THRU_AGE', VALUE: $scope.myFilter.THRU_AGE || 0 },
                { NAME: 'PROVINCE', VALUE: $scope.myFilter.PROVINCE.PROV_ID || '' },
                { NAME: 'DISTRICT', VALUE: $scope.myFilter.DISTRICT.CITY_ID || '' },
                { NAME: 'SUBDISTRICT', VALUE: $scope.myFilter.SUBDISTRICT.CODE || '' }
            ]
        }).then(function (response) {
            $scope.marketprices = response.data.data;
            $scope.totalRecords = response.data.totals;

            if (response.data.data.length == 0) {
                radasoft.alert($translate.instant('NO_DATA_FOUND'));
            }
        });
    }

    $scope.close = function (item) {
        $scope.$emit('closeDialog', item);
    }

    $scope.selectMarketPrice = function (item) {
        radasoft.confirmAndSave($translate.instant('CONFIRM.SET_JOB_MARKETPRICE'), $translate.instant('CONFIRM.SET_JOB_MARKETPRICE_WRN'), function (isconfirmed) {
            if (isconfirmed) {

                $scope.$parent.params.data.MARKETSTOCK_RUNNING_ID = item.MARKETSTOCK_RUNNING_ID;

                radasoft.setPriceMarketStockToJobMarketPrice($scope.$parent.params.data).then(function (response) {
                    radasoft.success();
                    //$modalInstance.close(response.data);
                    $scope.close(response.data);
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
                    radasoft.setMarketPrice($scope.formData).then(function (response) {
                        radasoft.success();
                        //$modalInstance.close(false);
                        $scope.close(false);
                    });
                }
            });
        }
    };

    $scope.delete = function () {
        radasoft.confirmAndSave($translate.instant('CONFIRM.DELETE'), '', function (isconfirmed) {
            if (isconfirmed) {
                radasoft.deleteMarketPrice($scope.formData).then(function (response) {
                    radasoft.success();
                    $modalInstance.close(true);
                });
            }
        });
    }

    $scope.init = function () {
        $scope.getHeadColType().then(function () {
            $scope.getProvince();
        });
    }

    $scope.init();
}]);

//priceCompareController
app.controller('priceCompareController', ['$scope', '$state', '$stateParams', 'radasoft', '$modal', '$translate', 'FileUploader', '$filter', function ($scope, $state, $stateParams, radasoft, $modal, $translate, FileUploader, $filter) {
    $scope.random = Math.random().toString().replace('.', '');
    $scope.ldloading = {};
    $scope.btnDisabled = false;
    //$scope.headCol = params.headCol;
    //$scope.colAct = params.colAct;

    $scope.compareUrl = '/app/views/setting/marketprice/priceCompare2_' + $scope.params.TEMPLATE_TYPE.CONDITION1 + '.html';

    $scope.title2 = $scope.params.TEMPLATE_TYPE.CODE_MINOR_NAME;

    $scope.jobMarketPrice = [];

    $scope.showDataSet1 = true;
    $scope.showDataSet2 = true;
    $scope.showDataSet3 = true;
    $scope.showDataSet4 = true;
    $scope.showDataSet5 = true;

    $scope.dataSetCol = "col-md-2";

    $scope.subColToJobMarketPrice = function () {
        radasoft.confirmAndSave('กรุณายืนยันการ '+$translate.instant('SUBCOLTOJOBMARKETPRICE'), '', function (isconfirmed) {
            if (isconfirmed) {
                radasoft.subColToJobMarketPrice({
                    HEAD_COL_RUNNING_ID: $scope.params.HEAD_COL_RUNNING_ID,
                    TEMPLATE_TYPE: $scope.params.TEMPLATE_TYPE.CONDITION2
                }).then(function () {
                    radasoft.success();
                    $scope.getJobMarketPrice();
                });
            }
        });
    }

    $scope.upload = function ($index, attach) {
        $modal.open({
            backdrop: 'static',
            keyboard: false,
            templateUrl: '/app/views/tools/uploader.html',
            controller: 'uploaderController',
            size: 'lg',
            resolve: {
                params: function () {
                    return {
                        limit: 0,
                        config: 'upload/photomarket',
                        id1: ''
                    };
                }
            }
        }).result.then(function (data) {
            angular.forEach(data, function (item) {
                $scope.random = Math.random().toString().replace('.', '');
                attach.ATTACH_DOC.push({
                    DOC_PATH: item.file,
                    DOC_NAME: item.name,
                    JOB_RUNNING_ID: $scope.params.JOB_RUNNING_ID
                });
            });
        });
    }

    $scope.getJobMarketPrice = function () {
        radasoft.getJobMarketPrice({
            HEAD_COL_RUNNING_ID: $scope.params.HEAD_COL_RUNNING_ID,
            TEMPLATE_TYPE: $scope.params.TEMPLATE_TYPE.CONDITION2
        }).then(function (response) {
            $scope.random = Math.random().toString().replace('.', '');

            $scope.jobMarketPrice = response.data;

            angular.forEach($scope.jobMarketPrice, function (item) {
                item.DISPLAY = true;
            });

            //$scope.displayChange();
            $scope.changeMarketCompair();
        });
    }

    $scope.changeMarketCompair = function () {

        $scope.displayChange();

        if ($scope.params.MARKET_COMPAIR == 4) {
            $scope.jobMarketPrice[4].DISPLAY = false;
        } else if ($scope.params.MARKET_COMPAIR == 5) {
            $scope.jobMarketPrice[4].DISPLAY = true;
        }

        if ($scope.dataMode == 1) {
            radasoft.setMarketCompairNumber($scope.params).then(function () {
                $scope.params.headCol.MARKET_COMPAIR = $scope.params.MARKET_COMPAIR;
            });
        }
    }

    $scope.displayChange = function () {
        var count = 0;

        angular.forEach($scope.jobMarketPrice, function (item) {
            if (item.DISPLAY) {
                count++;
            }
        });

        $scope.dataSetCol = "col-md-" + Math.ceil(10 / count);
    }

    $scope.selectMarketPrice = function ($index, $item) {
        radasoft.openDialog({
            controller: 'marketPriceSelectionDialogController',
            //templateUrl: '/app/views/setting/marketprice/marketPriceSelectionList.html',
            windowClass: 'app-modal-window-80',
            resolve: {
                params: function () {
                    return {
                        includeUrl: '/app/views/setting/marketprice/marketPriceSelectionList.html',
                        headCol: $scope.params,
                        data: $item
                    };
                }
            }
        }).result.then(function (data) {
            $scope.getJobMarketPrice();
        });
    }

    $scope.deleteJobMarketPrice = function ($index, market) {
        radasoft.confirmAndSave($translate.instant('CONFIRM.DELETE'), '', function (isconfirmed) {
            if (isconfirmed) {
                radasoft.deleteJobMarketPrice(market).then(function () {
                    radasoft.success();
                    $scope.getJobMarketPrice();
                });
            }
        });
    }

    $scope.editJobMarketPrice = function ($index, data) {
        data.MARKETSTOCK_RUNNING_ID = 0;
        $scope.openJobMarketPriceDialog(data);
    }

    $scope.openJobMarketPriceDialog = function (data) {
        radasoft.openDialog({
            controller: 'jobMarketPriceDetailCtrl',
            resolve: {
                params: function () {
                    return {
                        includeUrl: '/app/views/setting/marketprice/jobMarketPriceDetail.html',
                        formData: data,
                        dataMode: 1// 0 : AAG_M_PRICEMARKETSTOCK,1 : AAG_JOBMARKETPRICE
                    };
                }
            }
        }).result.then(function (reload) {
            $scope.getJobMarketPrice();
        });
    }

    $scope.openMarketPriceDialog = function (data) {
        radasoft.openDialog({
            controller: 'marketPriceDetailController',
            resolve: {
                params: function () {
                    return {
                        includeUrl: '/app/views/setting/marketprice/marketPriceDetail2.html',
                        formData: data,
                        dataMode: 1// 0 : AAG_M_PRICEMARKETSTOCK,1 : AAG_JOBMARKETPRICE
                    };
                }
            }
        }).result.then(function (reload) {
            $scope.getJobMarketPrice();
        });
    }

    $scope.submit = function () {
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.init = function () {
        $scope.getJobMarketPrice();
    }

    $scope.init();
}]);