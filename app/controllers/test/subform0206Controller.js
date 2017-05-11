app.controller('subform0206Controller', ['$scope', '$state', '$stateParams', 'radasoft', '$modal', '$translate', 'FileUploader', 'params', '$modalInstance', '$filter', function ($scope, $state, $stateParams, radasoft, $modal, $translate, FileUploader, params, $modalInstance, $filter) {

    $scope.ldloading = {};
    $scope.btnDisabled = false;
    //$scope.headCol = params.headCol;
    //$scope.colAct = params.colAct;
    $scope.JOB_RUNNING_ID = params.JOB_RUNNING_ID;
    $scope.HEAD_COL_RUNNING_ID = params.HEAD_COL_RUNNING_ID;
    $scope.HEAD_COL_TYPE_ID = params.HEAD_COL_TYPE_ID;
    $scope.MARKET_COMPAIR = params.MARKET_COMPAIR;
    $scope.RSQ = 0;

    $scope.RSQ_WARNING = 90;

    $scope.colAct = {
        COL_ACT_NAME: $translate.instant('WQS')
    };

    //$scope.includeUrl = params.includeUrl || '';
    $scope.includeUrl = '/app/views/test/subform0206.html';
    //$scope.showButtonSave = params.showButtonSave || false;
    $scope.showButtonSave = true;
    $scope.showButtonDelete = true;

    $scope.tdValue = { width: '120px' };
    $scope.inputStyle = { fontSize: '12px' };

    $scope.WQS = {};

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
                        limit: 0
                    };
                }
            }
        }).result.then(function (data) {
            angular.forEach(data, function (item) {
                attach.ATTACH_DOC.push({
                    DOC_PATH: item.file,
                    DOC_NAME: item.name,
                    JOB_RUNNING_ID: $scope.JOB_RUNNING_ID
                });
            });
        });
    }

    $scope.linearRegression = function (y, x) {

        var lr = {};
        var n = y.length;
        var sum_x = 0;
        var sum_y = 0;
        var sum_xy = 0;
        var sum_xx = 0;
        var sum_yy = 0;

        for (var i = 0; i < y.length; i++) {

            sum_x += x[i];
            sum_y += y[i];
            sum_xy += (x[i] * y[i]);
            sum_xx += (x[i] * x[i]);
            sum_yy += (y[i] * y[i]);
        }

        lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x);
        lr['intercept'] = (sum_y - lr.slope * sum_x) / n;
        lr['r2'] = Math.pow((n * sum_xy - sum_x * sum_y) / Math.sqrt((n * sum_xx - sum_x * sum_x) * (n * sum_yy - sum_y * sum_y)), 2);

        return lr;
    }

    $scope.cal = function () {

        var sum = $filter('filter')($scope.WQS.WQS_FACTOR, -1, true, 'WQS_FACTOR_ID')[0];
        var sumWeight = 0;
        var sumScore1 = 0;
        var sumScore2 = 0;
        var sumScore3 = 0;
        var sumScore4 = 0;
        var sumScore5 = 0;
        var sumScore0 = 0;
        angular.forEach($scope.WQS.WQS_FACTOR, function (item, $index) {
            if (item.WQS_FACTOR_ID != sum.WQS_FACTOR_ID) {
                sumWeight += item.FACTOR_WEIGHT;
                sumScore0 += item.COL_SCORE * item.FACTOR_WEIGHT;
                sumScore1 += item.MKT1_SCORE * item.FACTOR_WEIGHT;
                sumScore2 += item.MKT2_SCORE * item.FACTOR_WEIGHT;
                sumScore3 += item.MKT3_SCORE * item.FACTOR_WEIGHT;
                sumScore4 += item.MKT4_SCORE * item.FACTOR_WEIGHT;
                sumScore5 += $scope.MARKET_COMPAIR == 4 ? 0 : item.MKT5_SCORE * item.FACTOR_WEIGHT;
            }
        });
        sum.FACTOR_WEIGHT = sumWeight;
        sum.MKT1_SCORE = sumScore1;
        sum.MKT2_SCORE = sumScore2;
        sum.MKT3_SCORE = sumScore3;
        sum.MKT4_SCORE = sumScore4;
        sum.MKT5_SCORE = $scope.MARKET_COMPAIR == 4 ? 0 : sumScore5;
        sum.COL_SCORE = sumScore0;

        var offerPrice = $filter('filter')($scope.WQS.WQS_SUMMARY, -1, true, 'WQS_FACTOR_ID')[0];
        var adjustPrice = $filter('filter')($scope.WQS.WQS_SUMMARY, -2, true, 'WQS_FACTOR_ID')[0];
        var netPrice = $filter('filter')($scope.WQS.WQS_SUMMARY, -3, true, 'WQS_FACTOR_ID')[0];
        var wqs = $filter('filter')($scope.WQS.WQS_SUMMARY, -4, true, 'WQS_FACTOR_ID')[0];
        var adjustRatio = $filter('filter')($scope.WQS.WQS_SUMMARY, -5, true, 'WQS_FACTOR_ID')[0];
        var indicatedValue = $filter('filter')($scope.WQS.WQS_SUMMARY, -6, true, 'WQS_FACTOR_ID')[0];
        var compare = $filter('filter')($scope.WQS.WQS_SUMMARY, -7, true, 'WQS_FACTOR_ID')[0];
        var percent = $filter('filter')($scope.WQS.WQS_SUMMARY, -8, true, 'WQS_FACTOR_ID')[0];
        var similar = $filter('filter')($scope.WQS.WQS_SUMMARY, -9, true, 'WQS_FACTOR_ID')[0];
        var comparability = $filter('filter')($scope.WQS.WQS_SUMMARY, -10, true, 'WQS_FACTOR_ID')[0];
        var comparabilityValue = $filter('filter')($scope.WQS.WQS_SUMMARY, -11, true, 'WQS_FACTOR_ID')[0];
        var summary = $filter('filter')($scope.WQS.WQS_SUMMARY, -14, true, 'WQS_FACTOR_ID')[0];

        adjustPrice.MKT1_VALUE = (1 - (netPrice.MKT1_VALUE / offerPrice.MKT1_VALUE)) * 100;
        adjustPrice.MKT2_VALUE = (1 - (netPrice.MKT2_VALUE / offerPrice.MKT2_VALUE)) * 100;
        adjustPrice.MKT3_VALUE = (1 - (netPrice.MKT3_VALUE / offerPrice.MKT3_VALUE)) * 100;
        adjustPrice.MKT4_VALUE = (1 - (netPrice.MKT4_VALUE / offerPrice.MKT4_VALUE)) * 100;
        adjustPrice.MKT5_VALUE = $scope.MARKET_COMPAIR == 4 ? 0 : (1 - (netPrice.MKT5_VALUE / offerPrice.MKT5_VALUE)) * 100;

        wqs.MKT1_VALUE = sum.MKT1_SCORE;
        wqs.MKT2_VALUE = sum.MKT2_SCORE;
        wqs.MKT3_VALUE = sum.MKT3_SCORE;
        wqs.MKT4_VALUE = sum.MKT4_SCORE;
        wqs.MKT5_VALUE = $scope.MARKET_COMPAIR == 4 ? 0 : sum.MKT5_SCORE;
        wqs.COL_VALUE = sum.COL_SCORE;

        adjustRatio.MKT1_VALUE = wqs.COL_VALUE / wqs.MKT1_VALUE;
        adjustRatio.MKT2_VALUE = wqs.COL_VALUE / wqs.MKT2_VALUE;
        adjustRatio.MKT3_VALUE = wqs.COL_VALUE / wqs.MKT3_VALUE;
        adjustRatio.MKT4_VALUE = wqs.COL_VALUE / wqs.MKT4_VALUE;
        adjustRatio.MKT5_VALUE = $scope.MARKET_COMPAIR == 4 ? 0 : wqs.COL_VALUE / wqs.MKT5_VALUE;

        indicatedValue.MKT1_VALUE = netPrice.MKT1_VALUE * adjustRatio.MKT1_VALUE;
        indicatedValue.MKT2_VALUE = netPrice.MKT2_VALUE * adjustRatio.MKT2_VALUE;
        indicatedValue.MKT3_VALUE = netPrice.MKT3_VALUE * adjustRatio.MKT3_VALUE;
        indicatedValue.MKT4_VALUE = netPrice.MKT4_VALUE * adjustRatio.MKT4_VALUE;
        indicatedValue.MKT5_VALUE = $scope.MARKET_COMPAIR == 4 ? 0 : netPrice.MKT5_VALUE * adjustRatio.MKT5_VALUE;

        compare.MKT1_VALUE = Math.max(1, Math.abs(sum.MKT1_SCORE - sum.COL_SCORE));
        compare.MKT2_VALUE = Math.max(1, Math.abs(sum.MKT2_SCORE - sum.COL_SCORE));
        compare.MKT3_VALUE = Math.max(1, Math.abs(sum.MKT3_SCORE - sum.COL_SCORE));
        compare.MKT4_VALUE = Math.max(1, Math.abs(sum.MKT4_SCORE - sum.COL_SCORE));
        compare.MKT5_VALUE = $scope.MARKET_COMPAIR == 4 ? 0 : Math.max(1, Math.abs(sum.MKT5_SCORE - sum.COL_SCORE));
        compare.COL_VALUE = (compare.MKT1_VALUE + compare.MKT2_VALUE + compare.MKT3_VALUE + compare.MKT4_VALUE + compare.MKT5_VALUE);

        percent.MKT1_VALUE = (compare.MKT1_VALUE / compare.COL_VALUE);
        percent.MKT2_VALUE = (compare.MKT2_VALUE / compare.COL_VALUE);
        percent.MKT3_VALUE = (compare.MKT3_VALUE / compare.COL_VALUE);
        percent.MKT4_VALUE = (compare.MKT4_VALUE / compare.COL_VALUE);
        percent.MKT5_VALUE = $scope.MARKET_COMPAIR == 4 ? 0 : (compare.MKT5_VALUE / compare.COL_VALUE);
        percent.COL_VALUE = (percent.MKT1_VALUE + percent.MKT2_VALUE + percent.MKT3_VALUE + percent.MKT4_VALUE + percent.MKT5_VALUE);

        similar.MKT1_VALUE = (percent.COL_VALUE / percent.MKT1_VALUE);
        similar.MKT2_VALUE = (percent.COL_VALUE / percent.MKT2_VALUE);
        similar.MKT3_VALUE = (percent.COL_VALUE / percent.MKT3_VALUE);
        similar.MKT4_VALUE = (percent.COL_VALUE / percent.MKT4_VALUE);
        similar.MKT5_VALUE = $scope.MARKET_COMPAIR == 4 ? 0 : (percent.COL_VALUE / percent.MKT5_VALUE);
        similar.COL_VALUE = (similar.MKT1_VALUE + similar.MKT2_VALUE + similar.MKT3_VALUE + similar.MKT4_VALUE + similar.MKT5_VALUE);

        comparability.MKT1_VALUE = (similar.MKT1_VALUE / similar.COL_VALUE);
        comparability.MKT2_VALUE = (similar.MKT2_VALUE / similar.COL_VALUE);
        comparability.MKT3_VALUE = (similar.MKT3_VALUE / similar.COL_VALUE);
        comparability.MKT4_VALUE = (similar.MKT4_VALUE / similar.COL_VALUE);
        comparability.MKT5_VALUE = $scope.MARKET_COMPAIR == 4 ? 0 : (similar.MKT5_VALUE / similar.COL_VALUE);
        comparability.COL_VALUE = (comparability.MKT1_VALUE + comparability.MKT2_VALUE + comparability.MKT3_VALUE + comparability.MKT4_VALUE + comparability.MKT5_VALUE);

        comparabilityValue.MKT1_VALUE = (comparability.MKT1_VALUE * indicatedValue.MKT1_VALUE);
        comparabilityValue.MKT2_VALUE = (comparability.MKT2_VALUE * indicatedValue.MKT2_VALUE);
        comparabilityValue.MKT3_VALUE = (comparability.MKT3_VALUE * indicatedValue.MKT3_VALUE);
        comparabilityValue.MKT4_VALUE = (comparability.MKT4_VALUE * indicatedValue.MKT4_VALUE);
        comparabilityValue.MKT5_VALUE = $scope.MARKET_COMPAIR == 4 ? 0 : (comparability.MKT5_VALUE * indicatedValue.MKT5_VALUE);
        comparabilityValue.COL_VALUE = (comparabilityValue.MKT1_VALUE + comparabilityValue.MKT2_VALUE + comparabilityValue.MKT3_VALUE + comparabilityValue.MKT4_VALUE + comparabilityValue.MKT5_VALUE);

        summary.COL_VALUE = Math.round(comparabilityValue.COL_VALUE);

        var x = [sumScore1, sumScore2, sumScore3, sumScore4];
        var y = [netPrice.MKT1_VALUE, netPrice.MKT2_VALUE, netPrice.MKT3_VALUE, netPrice.MKT4_VALUE];

        if ($scope.MARKET_COMPAIR == 5) {
            x.push(sumScore5);
            y.push(netPrice.MKT5_VALUE);
        }

        $scope.WQS.RSQ = parseInt($scope.linearRegression(x, y).intercept) || 0;
    }

    $scope.setWqs = function () {
        var warningMsg = $scope.WQS.RSQ < $scope.RSQ_WARNING ? 'RSQ น้อยกว่า ' + $scope.RSQ_WARNING : '';
        radasoft.confirmAndSave($translate.instant('CONFIRM.SAVE'), warningMsg, function (isconfirmed) {
            if (isconfirmed) {
                radasoft.setWqs($scope.WQS).then(function (response) {
                    $scope.WQS = response.data;
                    radasoft.success();
                });
            }
        });
    }

    $scope.getWqs = function () {
        radasoft.getWqs({
            HEAD_COL_RUNNING_ID: $scope.HEAD_COL_RUNNING_ID,
            HEAD_COL_TYPE_ID: $scope.HEAD_COL_TYPE_ID
        }).then(function (response) {
            $scope.WQS = response.data;

            $scope.colAct.COL_ACT_NAME = $translate.instant('WQS') + ' (' + $scope.WQS.WQS_TYPE_NAME + ')';
        });
    }

    $scope.submit = function (form) {
        if (form.$invalid) {
            var field = null, firstError = null;
            form.$dirty = true;
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
        }
        else {
            $scope.setWqs();
        }
    }

    $scope.delete = function () {
        radasoft.confirmAndSave($translate.instant('CONFIRM.DELETE'), '', function (isconfirmed) {
            if (isconfirmed) {
                radasoft.deleteHeadColWqs({ HEAD_COL_RUNNING_ID: $scope.HEAD_COL_RUNNING_ID }).then(function () {
                    $modalInstance.close();
                });
            }
        });
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.init = function () {
        $scope.getWqs();
    }

    $scope.init();
}]);