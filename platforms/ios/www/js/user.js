angular.module('starter.controllers')
  .controller('UserCtrl', function($scope, $rootScope, $state,$http,$localStorage) {

    if($rootScope.isLogin == undefined){
      $rootScope.isLogin = false;
    }

    $scope.userInfo = {};

    $scope.login = function(userInfo) {
      console.log("login!");
      console.log(userInfo);

      //here call api, post user name and password、
      $http({
        method: "post",
         url: 'http://sciencetap.us/tao/app/login.php',
        data: userInfo
      }).then(function(response) {

        if(response.data.success == true){
          $rootScope.isLogin = true;
          $rootScope.user = {};
          $rootScope.user.firstname = response.data.data.firstname;
          $rootScope.user.lastname = response.data.data.lastname;
          $rootScope.user.id = response.data.data.id;
          $rootScope.user.email = userInfo.email;
          //if return yes, do/ show associate project-site(later)

          $localStorage.user = $rootScope.user;
          $localStorage.isLogin = true;



        } else {
          $scope.error = response.data.error;
          alert("login fail");
        }


      }, function(response) {
        //else alert user
        $scope.data = response.data || 'Request failed';
        $scope.status = response.status;
      });



    }

    $scope.logout = function() {
      console.log("logout!");

      $rootScope.user = {}
      $rootScope.isLogin = false;

      $localStorage.user = {};
      $localStorage.isLogin = false;

    }

    $scope.register = function() {
      $state.go('tab.register');
    }

  })

  .controller('ForgetPasswordCtrl', function($scope, $rootScope) {

  })


  .controller('RegisterCtrl', function($scope, $rootScope,$http,$state) {

    $scope.formData = {};
    $rootScope.user = {};
    $scope.register = function(registerInfo) {
      console.log("register!");
      console.log(registerInfo);

      if(registerInfo.password != registerInfo.password_c){
        alert("password did not match");
      } else {

        $http({
          method: "post",
           url: 'http://sciencetap.us/tao/app/registerUser.php',
          data: registerInfo
        }).then(function(response) {

          if(response.data.success == true){
            alert("register success")
            $rootScope.isLogin = true;
            $rootScope.user.firstname = response.data.data.firstname;
            $rootScope.user.lastname = response.data.data.lastname;
            $rootScope.user.id = response.data.data.id;
            $rootScope.user.email = registerInfo.email;
            $state.go('tab.account');
            //if return yes, do/ show associate project-site(later)
          } else {
            $scope.error = response.data.error;
            alert("register fail");
          }


        }, function(response) {
          //else alert user
          alert("register fail");
          $scope.data = response.data || 'Request failed';
          $scope.status = response.status;
        });
        // here call api, post user name and password. register
        // if return yes,
        //   //auto login
        //
        // if no, stay here, tell user error
      }


    }
  });
