angular.module('starter.controllers', [])

.controller('TabSwitchCtrl', function($scope,$state) {
  $scope.switchMap = function(){
    console.log("in TabSwitchCtrl switchMap");
   $state.go('tab.map',{reload: true});
 };
})


.controller('DashCtrl', function($scope) {})





.controller('FormSelectCtrl', function($scope, $stateParams, $http) {

})



.controller('CollectCtrl', function($scope) {})

.controller('FormCtrl', function($scope) {})

.controller('SearchCtrl', function($scope) {})




.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.directive('validPasswordC', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue, $scope) {
                var noMatch = viewValue != scope.myForm.password.$viewValue
                ctrl.$setValidity('noMatch', !noMatch)
            })
        }
    }
});
