'use strict';

/**
 * Config constant
 */
app.constant('APP_MEDIAQUERY', {
    'desktopXL': 1200,
    'desktop': 992,
    'tablet': 768,
    'mobile': 480
});
app.constant('JS_REQUIRES', {
    //*** Scripts
    scripts: {
        //*** Javascript Plugins
        'modernizr': ['/vendor/modernizr/modernizr.js'],
        'moment': ['/vendor/moment/moment.min.js'],
        'spin': '/vendor/ladda/spin.min.js',

        //*** jQuery Plugins
        'perfect-scrollbar-plugin': ['/vendor/perfect-scrollbar/perfect-scrollbar.min.js', '/vendor/perfect-scrollbar/perfect-scrollbar.min.css'],
        'ladda': ['/vendor/ladda/spin.min.js', '/vendor/ladda/ladda.min.js', '/vendor/ladda/ladda-themeless.min.css'],
        //'sweet-alert': ['/vendor/sweet-alert/sweet-alert.min.js', '/vendor/sweet-alert/sweet-alert.css'],
        'sweet-alert': ['/vendor/sweet-alert/sweetalert.min.js', '/vendor/sweet-alert/sweetalert.css'],
        'chartjs': '/vendor/chartjs/Chart.min.js',
        'jquery-sparkline': '/vendor/sparkline/jquery.sparkline.min.js',
        'ckeditor-plugin': '/vendor/ckeditor/ckeditor.js',
        'jquery-nestable-plugin': ['/vendor/ng-nestable/jquery.nestable.js', '/vendor/ng-nestable/jquery.nestable.css'],
        'touchspin-plugin': '/vendor/bootstrap-touchspin/jquery.bootstrap-touchspin.min.js',

        //*** Controllers
        'dashboardCtrl': '/assets/js/controllers/dashboardCtrl.js',
        'iconsCtrl': '/assets/js/controllers/iconsCtrl.js',
        'vAccordionCtrl': '/assets/js/controllers/vAccordionCtrl.js',
        'ckeditorCtrl': '/assets/js/controllers/ckeditorCtrl.js',
        'laddaCtrl': '/assets/js/controllers/laddaCtrl.js',
        'ngTableCtrl': '/assets/js/controllers/ngTableCtrl.js',
        'cropCtrl': '/assets/js/controllers/cropCtrl.js',
        'asideCtrl': '/assets/js/controllers/asideCtrl.js',
        'toasterCtrl': '/assets/js/controllers/toasterCtrl.js',
        'sweetAlertCtrl': '/assets/js/controllers/sweetAlertCtrl.js',
        'mapsCtrl': '/assets/js/controllers/mapsCtrl.js',
        'chartsCtrl': '/assets/js/controllers/chartsCtrl.js',
        'calendarCtrl': '/assets/js/controllers/calendarCtrl.js',
        'nestableCtrl': '/assets/js/controllers/nestableCtrl.js',
        'validationCtrl': ['/assets/js/controllers/validationCtrl.js'],
        'userCtrl': ['/assets/js/controllers/userCtrl.js'],
        'selectCtrl': '/assets/js/controllers/selectCtrl.js',
        'wizardCtrl': '/assets/js/controllers/wizardCtrl.js',
        'uploadCtrl': '/assets/js/controllers/uploadCtrl.js',
        'treeCtrl': '/assets/js/controllers/treeCtrl.js',
        'inboxCtrl': '/assets/js/controllers/inboxCtrl.js',
        'xeditableCtrl': '/assets/js/controllers/xeditableCtrl.js',
        'chatCtrl': '/assets/js/controllers/chatCtrl.js',

        //*** Filters
        'htmlToPlaintext': '/assets/js/filters/htmlToPlaintext.js',

        'inboxController': '/app/controllers/bpm/inboxController.js',
        'inboxHistController': '/app/controllers/bpm/inboxHistController.js',
        'docsController': '/app/controllers/bpm/docsController.js',
        'form1Ctrl': '/app/controllers/forms/appraisal/form1Controller.js',
        'formController': '/app/controllers/test/formController.js',
        'subform0100Controller': '/app/controllers/test/subform0100Controller.js',
        'headColCtrl': '/app/controllers/test/headColCtrl.js',
        'headColEditorCtrl': '/app/controllers/test/headColEditorCtrl.js',
        'subColEditorCtrl': '/app/controllers/test/subform0200Controller.js',
        'subform0203Controller': '/app/controllers/test/subform0203Controller.js',
        'subform0205Controller': '/app/controllers/test/subform0205Controller.js',
        'subform0206Controller': '/app/controllers/test/subform0206Controller.js',
        'subform0207Controller': '/app/controllers/test/subform0207Controller.js',
        'subform0208Controller': '/app/controllers/test/subform0208Controller.js',
        'subform0209Controller': '/app/controllers/test/subform0209Controller.js',
        'subform0210Controller': '/app/controllers/test/subform0210Controller.js',
        'subform0211Controller': '/app/controllers/test/subform0211Controller.js',
        'subform0300Controller': '/app/controllers/test/subform0300Controller.js',
        'subform0400Controller': '/app/controllers/test/subform0400Controller.js',
        'subform0500Controller': '/app/controllers/test/subform0500Controller.js',
        'subform9500Controller': '/app/controllers/test/subform9500Controller.js',
        'subform1000Controller': '/app/controllers/test/subform1000Controller.js',
        'col01Controller': '/app/controllers/forms/appraisal/col01Controller.js',

        'userController': '/app/controllers/setting/userController.js',
        'damController': '/app/controllers/dam/damController.js',
        'mydocsController': '/app/controllers/bpm/mydocsController.js',

        'formtemplateController': '/app/controllers/templates/formtemplateController.js',
        'uploaderController': '/app/controllers/tools/uploader.js',

        'projectController': '/app/controllers/setting/projectController.js',
        'geoBoundController': '/app/controllers/setting/geoBoundController.js',
        'completedProjectController': '/app/controllers/project/completedProjectController.js',
        'marketPriceController': '/app/controllers/marketprice/marketPriceController.js',
        'qnrController': '/app/controllers/qnr/qnrController.js',
        'diagCrystalReport': '/app/controllers/diagnostic/crystalReport.js',
        'orgRoleController': '/app/controllers/setting/orgRoleController.js',
        'parameterController': '/app/controllers/setting/parameterController.js',
        'sampleValidationCtrl': '/app/controllers/samples/sampleValidationCtrl.js',
        'wqsFactorListCtrl': '/app/controllers/test/wqsFactorListCtrl.js',
        'enquiry': '/app/controllers/enquiry/enquiryCtrl.js',
        'enquiryReport': '/app/controllers/enquiry/enquiryReportCtrl.js',
        'logoutCtrl': '/app/controllers/tools/logoutCtrl.js',
        'loanMstCtrl': '/app/controllers/setting/loan/loanMstCtrl.js'
    },
    //*** angularJS Modules
    modules: [{
        name: 'angularMoment',
        files: ['/vendor/moment/angular-moment.min.js']
    }, {
        name: 'perfect_scrollbar',
        files: ['/vendor/perfect-scrollbar/angular-perfect-scrollbar.js']
    }, {
        name: 'toaster',
        files: ['/vendor/toaster/toaster.js', '/vendor/toaster/toaster.css']
    }, {
        name: 'angularBootstrapNavTree',
        files: ['/vendor/angular-bootstrap-nav-tree/abn_tree_directive.js', '/vendor/angular-bootstrap-nav-tree/abn_tree.css']
    }, {
        name: 'angular-ladda',
        files: ['/vendor/ladda/angular-ladda.min.js']
    }, {
        name: 'ngTable',
        files: ['/vendor/ng-table/ng-table.min.js', '/vendor/ng-table/ng-table.min.css']
    }, {
        name: 'ui.select',
        files: [
            '/vendor/ui-select/select.min.js'
            , '/vendor/ui-select/select.css'
            //, '/vendor/ui-select/select2.css'
            //, '/vendor/ui-select/select2-bootstrap.css'
            , '/vendor/ui-select/selectize.bootstrap3.css'
        ]
    }, {
        name: 'ui.mask',
        files: ['/vendor/ui-utils/mask/mask.js']
    }, {
        name: 'angular-bootstrap-touchspin',
        files: ['/vendor/bootstrap-touchspin/angular.bootstrap-touchspin.js', '/vendor/bootstrap-touchspin/jquery.bootstrap-touchspin.min.css']
    }, {
        name: 'ngImgCrop',
        files: ['/vendor/ngImgCrop/ng-img-crop.js', '/vendor/ngImgCrop/ng-img-crop.css']
    }, {
        name: 'angularFileUpload',
        files: ['/vendor/angular-file-upload/angular-file-upload.min.js', '/vendor/angular-file-upload/directives.js']
    }, {
        name: 'ngAside',
        files: ['/vendor/angular-aside/angular-aside.min.js', '/vendor/angular-aside/angular-aside.min.css']
    }, {
        name: 'truncate',
        files: ['/vendor/angular-truncate/truncate.js']
    }, {
        name: 'oitozero.ngSweetAlert',
        files: ['/vendor/sweet-alert/ngSweetAlert.min.js']
    }, {
        name: 'monospaced.elastic',
        files: ['/vendor/angular-elastic/elastic.js']
    }, {
        name: 'ngMap',
        files: ['/vendor/angular-google-maps/ng-map.min.js']
    }, {
        name: 'tc.chartjs',
        files: ['/vendor/chartjs/tc-angular-chartjs.min.js']
    }, {
        name: 'sparkline',
        files: ['/vendor/sparkline/angular-sparkline.js']
    }, {
        name: 'flow',
        files: ['/vendor/ng-flow/ng-flow-standalone.min.js']
    }, {
        name: 'uiSwitch',
        files: ['/vendor/angular-ui-switch/angular-ui-switch.min.js', '/vendor/angular-ui-switch/angular-ui-switch.min.css']
    }, {
        name: 'ckeditor',
        files: ['/vendor/ckeditor/angular-ckeditor.min.js']
    }, {
        name: 'mwl.calendar',
        files: ['/vendor/angular-bootstrap-calendar/angular-bootstrap-calendar.js', '/vendor/angular-bootstrap-calendar/angular-bootstrap-calendar-tpls.js', '/vendor/angular-bootstrap-calendar/angular-bootstrap-calendar.min.css']
    }, {
        name: 'ng-nestable',
        files: ['/vendor/ng-nestable/angular-nestable.js']
    }, {
        name: 'vAccordion',
        files: ['/vendor/v-accordion/v-accordion.min.js', '/vendor/v-accordion/v-accordion.min.css']
    }, {
        name: 'xeditable',
        files: ['/vendor/angular-xeditable/xeditable.min.js', '/vendor/angular-xeditable/xeditable.css']
    }, {
        name: 'config-xeditable',
        files: ['/vendor/angular-xeditable/config-xeditable.js']
    }, {
        name: 'checklist-model',
        files: ['/vendor/checklist-model/checklist-model.js']
    }]
});
