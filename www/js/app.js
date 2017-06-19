// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','ngCordova','ionic-modal-select'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html',
    controller: 'TabSwitchCtrl'
  })

  // Each tab has its own nav history stack:

  .state('tab.map', {
    url: '/map',
    views: {
      'tab-map': {
        templateUrl: 'templates/map/tab-map.html',
        controller: 'MapCtrl'
      }
    }
  })

  .state('tab.manage', {
    url: '/manage',
    views: {
      'tab-manage': {
        templateUrl: 'templates/manage/tab-manage.html',
        controller: 'ManageCtrl'
      }
    }
  })

  .state('tab.manage-form', {
    url: '/manage-form',
    params: {data: null},
    views: {
      'tab-manage': {
        templateUrl: 'templates/manage/tab-manage-form.html',
        controller: 'ManageFormCtrl'
      }
    }
  })


  .state('tab.form', {
    url: '/form',
    views: {
      'tab-form': {
        templateUrl: 'templates/tab-form.html',
        controller: 'FormCtrl'
      }
    }
  })


    .state('tab.project-select', {
        cache: false,
        url: '/projectselect',
        params: {data: null},
        views: {
            'tab-map': {
                templateUrl: 'templates/map/project-select.html',
                controller: 'ProjectSelectCtrl'
            }
        }
    })

    .state('tab.map-form', {
        cache: false,
        url: '/mapform',
        params: { data: null },
        views: {
            'tab-map': {
                templateUrl: 'templates/map/showForm.html',
                controller: 'ShowFormCtrl'
            }
        }
    })

    .state('tab.forgetPassword', {
        url: '/forgetPassword',
        params: { data: null },
        views: {
            'tab-account': {
                templateUrl: 'templates/account/forgetPassword.html',
                controller: 'ForgetPasswordCtrl'
            }
        }
    })

    .state('tab.register', {
        url: '/register',
        params: { data: null },
        views: {
            'tab-account': {
                templateUrl: 'templates/account/register.html',
                controller: 'RegisterCtrl'
            }
        }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/account/tab-account.html',
        controller: 'UserCtrl'
      }
    }
  });



  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/account');

})
