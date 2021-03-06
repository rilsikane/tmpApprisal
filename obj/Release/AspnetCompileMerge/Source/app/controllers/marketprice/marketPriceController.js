﻿app.controller('marketPriceController', ['$scope', '$rootScope', '$state', '$stateParams', 'radasoft', '$modal', '$translate', function ($scope, $rootScope, $state, $stateParams, radasoft, $modal, $translate) {
    $scope.marketprices = [];
    $scope.marketPriceTotalItems = 0;
    $scope.marketPriceCurrentPage = 1;

    $scope.getMarketPrice = function () {
        radasoft.getMarketPrice({
            limit: $rootScope.app.itemsPerPage,
            page: $scope.marketPriceCurrentPage,
            filters: []
        }).then(function (response) {
            $scope.marketprices = response.data.data;
            $scope.marketPriceTotalItems = response.data.totals;
        });
    }

    $scope.openMarketPriceDialog = function (data) {
        radasoft.openDialog({
            controller: 'marketPriceDetailController',
            resolve: {
                params: function () {
                    return {
                        includeUrl: 'app/views/setting/marketprice/marketPriceDetail.html',
                        formData: data,
                        dataMode: 0,//editable
                        showBtnDelete: true
                    };
                }
            }
        }).result.then(function (reload) {
            if (reload) {
                $scope.getMarketPrice();
            }
        });
    }

    $scope.editMarketPrice = function (data) {
        $scope.openMarketPriceDialog(data);
    }

    $scope.addMarketPrice = function () {
        $scope.openMarketPriceDialog({});
    }

    $scope.init = function () {
        $scope.getMarketPrice();
    }

    $scope.init();

}]);

app.controller('marketPriceDetailController', ['$scope', '$rootScope', '$state', 'toaster', '$modal', '$translate', 'SweetAlert', '$modalInstance', 'radasoft', 'params', '$q', function ($scope, $rootScope, $state, toaster, $modal, $translate, SweetAlert, $modalInstance, radasoft, params, $q) {

    $scope.btnDisabled = false;
    $scope.btnSubmitDisabled = false;
    $scope.dataMode = params.dataMode;
    $scope.formData = params.formData;
    $scope.includeUrl = params.includeUrl;
    $scope.title = $translate.instant('MARKETPRICE');
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

    $scope.potential = [{ VALUE: 'G', NAME: $translate.instant('HEIGHT') }, { VALUE: 'M', NAME: $translate.instant('MEDIUM') }, { VALUE: 'L', NAME: $translate.instant('LOW') }];

    if ($scope.formData.JMP_RUNNING_ID == 0) {
        $scope.formData.TEMPLATE_TYPE = undefined;
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
            ADD_PROVINCE: MARKETSTOCK_ID == '' ? {} : ADD_PROVINCE,
            ADD_CITY: MARKETSTOCK_ID == '' ? {} : ADD_CITY,
            ADD_DISTRICT: MARKETSTOCK_ID == '' ? {} : ADD_DISTRICT
        }, function (args) {
            $scope.mapReturnArgs = args;
            $scope.formData.LATITUDE = args.location.lat;
            $scope.formData.LONGITUDE = args.location.lon;
        });
    }

    $scope.save = function (form) {
        radasoft.debug(form);
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
    $scope.getMarketTemplateType = function () {
        var deferred = $q.defer();

        radasoft.getMarketTemplateType({}).then(function (response) {
            $rootScope.marketTemplateType = response.data;
            $scope.marketTemplateType = $rootScope.marketTemplateType;
        }).finally(function () {
            deferred.resolve();
        });

        return deferred.promise;
    }
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
        radasoft.upload({}).result.then(function (data) {
            //console.log(data);
            if (data[0]) {
                $scope.formData.PICTURE = data[0];
                $scope.formData.PICTURE_DATE_TEXT = $scope.formData.PICTURE.PHOTO_DATE_TAKEN;
            }
        });
    }

    $scope.init = function () {
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
                                                            $scope.getMarketTemplateType().then(function () {
                                                                $scope.getProvince().then(function () {
                                                                    $scope.getDistrict($scope.formData.ADD_PROVINCE).then(function () {
                                                                        $scope.getSubDistrict($scope.formData.ADD_PROVINCE, $scope.formData.ADD_CITY).then(function () {
                                                                            $scope.getHeadColSubType($scope.formData.HEAD_COL_TYPE_ID).then(function () {
                                                                                $scope.getRoadType();
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

app.controller('marketPriceSelectionController', ['$scope', '$rootScope', '$state', 'toaster', '$modal', '$translate', 'SweetAlert', '$modalInstance', 'radasoft', 'params', '$q', function ($scope, $rootScope, $state, toaster, $modal, $translate, SweetAlert, $modalInstance, radasoft, params, $q) {

    $scope.btnDisabled = false;
    $scope.btnSubmitDisabled = false;

    //$scope.formData = params.formData;
    $scope.includeUrl = params.includeUrl;
    $scope.title = $translate.instant('MARKETPRICE');

    $scope.marketprices = [];
    $scope.marketPriceTotalItems = 0;
    $scope.marketPriceCurrentPage = 1;

    $scope.getMarketPrice = function () {
        radasoft.getMarketPrice({
            limit: $rootScope.app.itemsPerPage,
            page: $scope.marketPriceCurrentPage,
            filters: []
        }).then(function (response) {
            $scope.marketprices = response.data.data;
            $scope.marketPriceTotalItems = response.data.totals;
        });
    }

    $scope.selectMarketPrice = function (item) {
        radasoft.confirmAndSave($translate.instant('CONFIRM.SET_JOB_MARKETPRICE'), $translate.instant('CONFIRM.SET_JOB_MARKETPRICE_WRN'), function (isconfirmed) {
            if (isconfirmed) {

                params.data.MARKETSTOCK_RUNNING_ID = item.MARKETSTOCK_RUNNING_ID;

                radasoft.setJobMarketPrice(params.data).then(function (response) {
                    radasoft.success();
                    $modalInstance.close(response.data);
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
                        $modalInstance.close(false);
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

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.init = function () {
        $scope.getMarketPrice();
    }

    $scope.init();
}]);

//priceCompareController
app.controller('priceCompareController', ['$scope', '$state', '$stateParams', 'radasoft', '$modal', '$translate', 'FileUploader', '$filter', function ($scope, $state, $stateParams, radasoft, $modal, $translate, FileUploader, $filter) {
    //$scope.title = $stateParams.STATE_NAME;
    $scope.ldloading = {};
    $scope.btnDisabled = false;
    //$scope.headCol = params.headCol;
    //$scope.colAct = params.colAct;

    $scope.jobMarketPrice = [];

    $scope.showDataSet1 = true;
    $scope.showDataSet2 = true;
    $scope.showDataSet3 = true;
    $scope.showDataSet4 = true;
    $scope.showDataSet5 = true;

    $scope.dataSetCol = "col-md-2";

    //$scope.formData = { MARKET_COMPAIR: 4 };

    $scope.upload = function ($index, attach) {
        $modal.open({
            backdrop: 'static',
            keyboard: false,
            templateUrl: 'app/views/tools/uploader.html',
            controller: 'uploaderController',
            size: 'lg',
            resolve: {
                params: function () {
                    return {
                        limit: 0
                    };
                }
            }
        }).result.then(function (data) {
            angular.forEach(data, function (item) {
                attach.ATTACH_DOC.push({
                    DOC_PATH: item.file,
                    DOC_NAME: item.name,
                    JOB_RUNNING_ID: $scope.headCol.JOB_RUNNING_ID
                });
            });
        });
    }

    $scope.getJobMarketPrice = function () {
        radasoft.getJobMarketPrice({ HEAD_COL_RUNNING_ID: $scope.headCol.HEAD_COL_RUNNING_ID }).then(function (response) {
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

        if ($scope.headCol.MARKET_COMPAIR == 4) {
            $scope.jobMarketPrice[4].DISPLAY = false;
        } else if ($scope.headCol.MARKET_COMPAIR == 5) {
            $scope.jobMarketPrice[4].DISPLAY = true;
        }

        if ($scope.dataMode == 1) {
            radasoft.setMarketCompairNumber($scope.headCol).then(function () {

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
            controller: 'marketPriceSelectionController',

            resolve: {
                params: function () {
                    return {
                        includeUrl: 'app/views/setting/marketprice/marketPriceSelectionList.html',
                        headCol: $scope.headCol,
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
        $scope.openMarketPriceDialog(data);
    }

    $scope.openMarketPriceDialog = function (data) {
        radasoft.openDialog({
            controller: 'marketPriceDetailController',
            resolve: {
                params: function () {
                    return {
                        includeUrl: 'app/views/setting/marketprice/marketPriceDetail.html',
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