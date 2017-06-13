'use strict';

/**
 * Config for the router
 */
app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$ocLazyLoadProvider', 'JS_REQUIRES', function ($stateProvider, $urlRouterProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $ocLazyLoadProvider, jsRequires, radasoft) {

    app.controller = $controllerProvider.register;
    app.directive = $compileProvider.directive;
    app.filter = $filterProvider.register;
    app.factory = $provide.factory;
    app.service = $provide.service;
    app.constant = $provide.constant;
    app.value = $provide.value;

    // LAZY MODULES

    $ocLazyLoadProvider.config({
        debug: false,
        events: true,
        modules: jsRequires.modules
    });

    // APPLICATION ROUTES
    // -----------------------------------
    // For any unmatched url, redirect to /app/dashboard
    //$urlRouterProvider.otherwise("/app/inbox");
    //$urlRouterProvider.otherwise("/login");
    // Set up the states
    $stateProvider.state('app', {
        url: "/app",
        templateUrl: "/app/views/main.html",
        resolve: loadSequence(
            'modernizr',
            'moment',
            'angularMoment',
            'uiSwitch',
            'perfect-scrollbar-plugin',
            'perfect_scrollbar',
            'toaster',
            'ngAside',
            'vAccordion',
            'sweet-alert',
            'chartjs',
            'tc.chartjs',
            'oitozero.ngSweetAlert',
            'chatCtrl',
            'spin',
            'ladda',
            'angular-ladda',
            'ui.select',
            'ui.mask',
            'monospaced.elastic',
            'touchspin-plugin',
            'angular-bootstrap-touchspin',
            'angularFileUpload',
            'mwl.calendar',
            'ckeditor-plugin',
            'ckeditor',
            'uploaderController',
            'qnrController',
            'wqsFactorListCtrl'),
        abstract: true
    }).state('app.acquire', { url: '/acquire', templateUrl: '/app/views/setting/parameters/acquire.html', resolve: loadSequence('parameterController') })
        .state('app.apprbuild', { url: '/apprbuild', templateUrl: '/app/views/setting/parameters/appr_build_eva_list.html', resolve: loadSequence('parameterController') })
        .state('app.brandname', { url: '/brandname', templateUrl: '/app/views/setting/parameters/brand_name.html', resolve: loadSequence('parameterController') })
        .state('app.contactresult', { url: '/contactresult', templateUrl: '/app/views/setting/parameters/contact_result.html', resolve: loadSequence('parameterController') })
        .state('app.insuredcode', { url: '/insuredcode', templateUrl: '/app/views/setting/parameters/insured_code.html', resolve: loadSequence('parameterController') })
        .state('app.marketinfo', { url: '/marketinfo', templateUrl: '/app/views/setting/parameters/market_info.html', resolve: loadSequence('parameterController') })
        .state('app.photoarea', { url: '/photoarea', templateUrl: '/app/views/setting/parameters/photo_area.html', resolve: loadSequence('parameterController') })
        .state('app.photopoint', { url: '/photopoint', templateUrl: '/app/views/setting/parameters/photo_point.html', resolve: loadSequence('parameterController') })
        .state('app.apprpurpose', { url: '/apprpurpose', templateUrl: '/app/views/setting/lookmst/appr_purpose.html', resolve: loadSequence('parameterController') })
        .state('app.req_type', { url: '/req_type', templateUrl: '/app/views/setting/parameters/req_type.html', resolve: loadSequence('parameterController') })
        .state('app.debttype', { url: '/debttype', templateUrl: '/app/views/setting/debttype/parameter.html', resolve: loadSequence('parameterController') })
        .state('app.riskcde', { url: '/riskcde', templateUrl: '/app/views/setting/lookmst/riskcde.html', resolve: loadSequence('parameterController') })
        .state('app.userLogout', { url: '/u', templateUrl: '/app/views/tools/logout.html', resolve: loadSequence('logoutCtrl') })
        .state('app.contact_result', { url: '/contact_result', templateUrl: '/app/views/setting/parameters/contact_result.html', resolve: loadSequence('parameterController') })
        .state('app.calendar', {
            url: '/calendar',
            templateUrl: '/app/views/test/subform0600.html'
        }).state('app.samplevalidation', {
            url: '/samplevalidation',
            templateUrl: '/app/views/samples/formValidation.html',
            resolve: loadSequence('sampleValidationCtrl')
        }).state('app.enquiryRequest', {
            url: '/enqr',
            templateUrl: '/app/views/enquiry/request.html',
            resolve: loadSequence('enquiry')
        }).state('app.enquiryReport1', {
            url: '/enqr1',
            templateUrl: '/app/views/enquiry/report1.html',
            resolve: loadSequence('enquiryReport')
        }).state('app.enquiryReport2', {
            url: '/enqr2',
            templateUrl: '/app/views/enquiry/report2.html',
            resolve: loadSequence('enquiryReport')
        }).state('app.enquiryReport3', {
            url: '/enqr3',
            templateUrl: '/app/views/enquiry/report3.html',
            resolve: loadSequence('enquiryReport')
        }).state('app.diag', {
            url: '/diag',
            templateUrl: '/app/views/diagnostic/crystalReport.html',
            resolve: loadSequence('diagCrystalReport')
        }).state('app.orgrole', {
            url: '/orgrole',
            templateUrl: '/app/views/setting/orgRole.html',
            resolve: loadSequence('orgRoleController')
        }).state('app.qnr', {
            url: '/questionnaire',
            templateUrl: '/app/views/qnr/questionnaire.html',
            resolve: loadSequence('qnrController')
        }).state('app.marketprice', {
            url: '/marketprice',
            templateUrl: '/app/views/setting/marketprice/marketPriceList.html',
            resolve: loadSequence('marketPriceController')
        }).state('app.geobound', {
            url: '/geobound',
            templateUrl: '/app/views/setting/geobound/geoBound.html',
            resolve: loadSequence('geoBoundController')
        }).state('app.org', {
            url: '/org',
            templateUrl: '/app/views/org/ou.html'
        }).state('app.dam', {
            url: '/dam',
            templateUrl: '/app/views/project/completedProject.html',
            resolve: loadSequence('completedProjectController')
        }).state('app.home', {
            url: '/home',
            templateUrl: '/app/views/home.html'
        }).state('app.docs', {
            url: '/docs',
            templateUrl: '/app/views/bpm/docs.html',
            resolve: loadSequence('docsController'),
        }).state('app.testlist', {
            url: '/testlist',
            templateUrl: '/app/views/test/list.html',
            resolve: loadSequence('form1Ctrl')
        }).state('app.mydocs', {
            url: '/mydocs',
            templateUrl: '/app/views/bpm/mydocs.html',
            resolve: loadSequence('mydocsController')
        }).state('app.inbox', {
            url: '/inbox',
            templateUrl: '/app/views/bpm/inbox.html',
            resolve: loadSequence('inboxController')
        }).state('app.inboxhist', {
            url: '/inboxhistory',
            templateUrl: '/app/views/bpm/inboxhist.html',
            resolve: loadSequence('inboxHistController')
        }).state('app.testform', {
            url: '/a/:ACT_HIST_ID/:H/:S',
            templateUrl: '/app/views/test/form.html',
            resolve: loadSequence(
                'chartjs',
                'tc.chartjs',
                'formController',
                'subform0100Controller',
                'headColCtrl',
                'headColEditorCtrl',
                'subColEditorCtrl',
                'subform0203Controller',
                'subform0205Controller',
                'subform0206Controller',
                'subform0207Controller',
                'subform0208Controller',
                'subform0209Controller',
                'subform0210Controller',
                'subform0211Controller',
                'subform0300Controller',
                'subform0400Controller',
                'subform0500Controller',
                'subform9500Controller',
                'subform1000Controller',
                'uploaderController',
                'projectController',
                'completedProjectController',
                'marketPriceController')
        }).state('app.settinguser', {
            url: '/user',
            templateUrl: '/app/views/setting/user.html',
            resolve: loadSequence('userController'),
        }).state('app.loan', {
            url: '/loan',
            templateUrl: '/app/views/setting/loan/parameter.html',
            resolve: loadSequence('loanMstCtrl'),
        }).state('app.download', {
            url: '/download',
            templateUrl: '/app/views/test/subform1100.html'
        }).state('login', {
            url: '/login',
            template: '<div ui-view class="fade-in-right-big smooth"></div>',
            abstract: true,
            resolve: loadSequence(
                'spin',
                'ladda',
                'angular-ladda',
                'ui.select',
                'ui.mask',
                'monospaced.elastic',
                'touchspin-plugin',
                'angular-bootstrap-touchspin',
                'ngAside',
                'sweet-alert',
                'oitozero.ngSweetAlert',
                'angularFileUpload',
                'uploaderController',
                'subform0207Controller')
        }).state('login.signin', {
            url: '/signin',
            templateUrl: "/assets/views/login_login.html"
        }).state('calendar', {
            url: '/calendar/:JOB_RUNNING_ID',
            templateUrl: '/app/views/test/subform0600.html',
            resolve: loadSequence('modernizr', 'moment', 'angularMoment', 'uiSwitch', 'perfect-scrollbar-plugin', 'perfect_scrollbar', 'toaster', 'ngAside', 'vAccordion', 'sweet-alert', 'chartjs', 'tc.chartjs', 'oitozero.ngSweetAlert', 'chatCtrl', 'mwl.calendar')
        });

    // Generates a resolve object previously configured in constant.JS_REQUIRES (config.constant.js)
    function loadSequence() {
        var _args = arguments;
        return {
            deps: ['$ocLazyLoad', '$q',
			function ($ocLL, $q) {
			    var promise = $q.when(1);
			    for (var i = 0, len = _args.length; i < len; i++) {
			        promise = promiseThen(_args[i]);
			    }
			    return promise;

			    function promiseThen(_arg) {
			        if (typeof _arg == 'function')
			            return promise.then(_arg);
			        else
			            return promise.then(function () {
			                var nowLoad = requiredData(_arg);
			                if (!nowLoad)
			                    return $.error('Route resolve: Bad resource name [' + _arg + ']');
			                return $ocLL.load(nowLoad);
			            });
			    }

			    function requiredData(name) {
			        if (jsRequires.modules)
			            for (var m in jsRequires.modules)
			                if (jsRequires.modules[m].name && jsRequires.modules[m].name === name)
			                    return jsRequires.modules[m];
			        return jsRequires.scripts && jsRequires.scripts[name];
			    }
			}]
        };
    }
}]);