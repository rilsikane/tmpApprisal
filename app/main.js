var app = angular.module('AppraisalWebApp', ['Application']);

app.run(['$rootScope', '$state', '$stateParams', '$http', 'radasoft', 'datepickerPopupConfig', '$templateCache', '$filter', '$document', function ($rootScope, $state, $stateParams, $http, radasoft, datepickerPopupConfig, $templateCache, $filter, $document) {
    //$templateCache.removeAll();
    // Attach Fastclick for eliminating the 300ms delay between a physical tap and the firing of a click event on mobile browsers
    FastClick.attach(document.body);

    $document.on('keydown', function (e) {
        if (e.which === 8 && (e.target.nodeName !== "INPUT" && e.target.nodeName !== "SELECT" && e.target.nodeName !== "TEXTAREA")) { // you can add others here inside brackets.
            e.preventDefault();
        }
    });

    // Set some reference to access them from any scope
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    // GLOBAL APP SCOPE
    // set below basic information
    //$rootScope.$on('$locationChangeStart', function (event, newUrl, oldUrl) {
    //    if (true /* inject your logic here */) {
    //        event.preventDefault();
    //    }
    //});
    $rootScope.app = {
        name: 'GSB Appraisal', // name of your project
        author: 'บริษัท จีไอเอส จำกัด', // author's name or company name
        description: 'โครงการข้อมูลสารสนเทศภูมิศาสตร์เพื่อการบริหารจัดการ', // brief description
        customer: 'Government Savings Bank',
        tokenKey: 'accessToken',
        COUNT_MYDOC: 0,
        COUNT_INBOX: 0,
        COUNT_HISTORY: 0,
        itemsPerPage: 10,
        menuItems: [],
        version: '1.0', // current version
        year: ((new Date()).getFullYear()), // automatic current year (for copyright information)
        isMobile: (function () {// true if the browser is a mobile device
            var check = false;
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                check = true;
            };
            return check;
        })(),
        layout: {
            isNavbarFixed: true, //true if you want to initialize the template with fixed header
            isSidebarFixed: true, // true if you want to initialize the template with fixed sidebar
            isSidebarClosed: false, // true if you want to initialize the template with closed sidebar
            isFooterFixed: false, // true if you want to initialize the template with fixed footer
            theme: 'theme-1', // indicate the theme chosen for your project
            logo: '/assets/images/login_logo_gsb.png', // relative path of the project logo
        }
    };

    radasoft.initApp().then(function () {
        $state.go('app.inbox');
    }, function () {
        $state.go('login.signin');
    });
}]);
// translate config
app.config(['$translateProvider', '$httpProvider', '$templateRequestProvider', function ($translateProvider, $httpProvider, $templateRequestProvider) {
    $httpProvider.interceptors.push(function ($q, SweetAlert) {
        return {
            'responseError': function (rejection) {

                if (rejection.status == 0) {
                    SweetAlert.swal('การเชื่อมต่อเครือข่ายไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
                }

                return $q.reject(rejection);
            }
        };
    });
    // prefix and suffix information  is required to specify a pattern
    // You can simply use the static-files loader with this pattern:
    $translateProvider.useStaticFilesLoader({
        prefix: '/app/i18n/',
        suffix: '.json'
    });

    $translateProvider.preferredLanguage('th');

}]);
// Angular-Loading-Bar
// configuration
app.config(['cfpLoadingBarProvider',
function (cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeBar = true;
    cfpLoadingBarProvider.includeSpinner = false;
}]);

//app.config(['calendarConfig', function (calendarConfig) {
//    console.log(calendarConfig);
//}]);

app.controller('paramgatewayController', ['$scope', '$stateParams', 'radasoft', function ($scope, $stateParams, radasoft) {
    radasoft.debug($stateParams);
}]);

app.controller('boundaryController', ['$scope', 'radasoft', function ($scope, radasoft) {
    $scope.selectProvince = [];
    $scope.selectDistrict = [];
    $scope.selectSubDistrict = [];

    $scope.getProvince = function () {
        radasoft.getProvince({}).then(function (response) {
            $scope.selectProvince = response.data;
        });
    }

    $scope.getDistrict = function (item, model) {
        $scope.selectDistrict = [];
        $scope.selectSubDistrict = [];
        $scope.formData.DISTRICT = {};
        $scope.formData.SUBDISTRICT = {};
        radasoft.getDistrict({ PROVINCE_ID: item.PROV_ID }).then(function (response) {
            $scope.selectDistrict = response.data;
        });
    }

    $scope.getSubDistrict = function ($item, $model) {
        $scope.selectSubDistrict = [];
        $scope.formData.SUBDISTRICT = {};
        radasoft.getSubDistrict({ PROVINCE_ID: $item.PROVINCE_ID, DISTRICT_ID: $item.CITY_ID }).then(function (response) {
            $scope.selectSubDistrict = response.data;
        });
    }

    $scope.getProvince();
}]);

app.controller('selectRoleController', ['$scope', 'params', '$modalInstance', function ($scope, params, $modalInstance) {
    $scope.formData = {};
    $scope.roles = params.roles;

    $scope.submit = function () {
        if (typeof ($scope.formData.ROLE) != 'undefined') {
            $modalInstance.close($scope.formData.ROLE);
        }
    }

    $scope.selectRole = function (role) {
        $modalInstance.close(role);
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    }
}]);

app.controller('loginController', ['$rootScope', '$scope', '$state', 'radasoft', '$aside', 'SweetAlert', '$modal', '$filter', function ($rootScope, $scope, $state, radasoft, $aside, SweetAlert, $modal, $filter) {
    $scope.formData = {};
    $scope.ldloading = {};
    $scope.btnDisabled = false;
    $scope.style = 'expand-left';


    $scope.selectRole = function (roles) {
        return $modal.open({
            templateUrl: '/app/views/test/selectRoles.html',
            controller: 'selectRoleController',
            backdrop: 'static',
            keyboard: false,
            //size: action.ACT_TYPE == 'history' ? 'lg' : 'md',
            resolve: {
                params: function () {
                    return {
                        roles: roles
                    };
                }
            }
        });
    };
    $scope.loginKeydown = function ($event) {
        if ($event && $event.keyCode == 13) {
            $scope.login();
        }
    }
    $scope.login = function () {
        $scope.btnDisabled = true;
        $scope.ldloading[$scope.style.replace('-', '_')] = true;
        radasoft.login($scope.formData).then(function () {
            radasoft.getRoles().then(function (response) {
                sessionStorage.setItem('roles', angular.toJson(response.data));

                if (response.data.length == 1) {
                    sessionStorage.setItem('role', angular.toJson(response.data[0]));

                    radasoft.initApp().then(function (response) {
                        var defaultMenuItem = $filter('filter')($rootScope.app.menuItems, function (value, index, array) { return value.MENU_LEVEL == 2 })[0];

                        if (defaultMenuItem != undefined) {
                            $state.go(defaultMenuItem.URL);
                        }
                    }, function () {
                        $state.go('login.signin');
                    });
                }
                else if (response.data.length > 1) {
                    $scope.selectRole(response.data).result.then(function (data) {
                        sessionStorage.setItem('role', angular.toJson(data));

                        radasoft.initApp().then(function (response) {
                            var defaultMenuItem = $filter('filter')($rootScope.app.menuItems, function (value, index, array) { return value.MENU_LEVEL == 2 })[0];

                            if (defaultMenuItem != undefined) {
                                $state.go(defaultMenuItem.URL);
                            }
                        }, function () {
                            $state.go('login.signin');
                        });
                    });
                } else {
                    radasoft.alert('ROLE NOT SPECIFIC');
                }
            });

        }, function (response) {
            radasoft.error(response.data.error, response.data.error_description);
        }).finally(function () {
            $scope.btnDisabled = false;
            $scope.ldloading[$scope.style.replace('-', '_')] = false;
        });
    }

    $scope.testMap = function () {
        radasoft.openMap({}, function (args) {
            console.log($scope);
            console.log(args);
        });
    }

    $scope.devMode = function () {
        var position = 'right';
        $aside.open({
            template: '<ul ng-repeat="item in users"><li><a ng-click="login(item)">{{item.USER_NAME}}-{{item.EMP_NAME}}-{{item.OU_NAME}}</a></li></ul>',
            placement: position,
            size: 'lg',
            backdrop: true,
            controller: function ($scope, $modalInstance) {
                $scope.users = [];
                $scope.login = function (item) {
                    $modalInstance.close(item);
                }
                $scope.getAllUser = function () {
                    radasoft.getAllUser().then(function (response) {
                        $scope.users = response.data.data;
                    });
                }
                $scope.ok = function (e) {
                    $modalInstance.close();
                    e.stopPropagation();
                };
                $scope.cancel = function (e) {
                    $modalInstance.dismiss();
                    e.stopPropagation();
                };

                $scope.getAllUser();
            }
        }).result.then(function (user) {
            $scope.formData.username = user.USER_NAME;
            $scope.formData.password = 'gsb123';
            $scope.login();
        });
    }
}]);