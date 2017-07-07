angular.module('starter.controllers')
  .controller('CameraCtrl', function($scope, $rootScope, $http, $state, $ionicLoading, $cordovaCamera, $ionicActionSheet, $cordovaGeolocation) {

    $scope.description;

    if ($rootScope.isLogin == false || $rootScope.isLogin == undefined) {
      alert("please login to see more");
      $state.go('tab.account')
    } else {
      $scope.images = [];
      $scope.imgCount = 0;


      var options = {
        timeout: 10000,
        enableHighAccuracy: true
      };

      $scope.loading = $ionicLoading.show({
        template: 'getting geolocation'
      });

      $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
          $ionicLoading.hide();
          console.log("getCurrentPosition");
          $scope.pictures = {
            "user_id": $rootScope.user.id,
            "lat": position.coords.latitude,
            "lon": position.coords.longitude,
            "images": []
          };

          $scope.addImage = function() {
            // Show the action sheet
            // var hideSheet = $ionicActionSheet.show({
            // 	buttons: [{
            //   	text: 'take picture'
            // 	}, {
            //   	text: 'choose from album'
            // 	}],
            // 	titleText: 'choose type',
            // 	cancelText: 'cancel',
            // 	cancel: function() {
            //   	console.log("cancel");
            // 	},
            // 	buttonClicked: function(index) {
            //   	if (index === 0) {
            // new picture
            var options = {
              quality: 100,
              destinationType: Camera.DestinationType.DATA_URL,
              sourceType: Camera.PictureSourceType.CAMERA,
              // allowEdit: true,
              encodingType: Camera.EncodingType.JPEG,
              // popoverOptions: CameraPopoverOptions,
              saveToPhotoAlbum: false,
              correctOrientation: true,
              targetWidth: 1200,
              targetHeight: 2000,
            };

            // } else {
            // 	// ablum
            // 	var options = {
            //   	quality: 100,
            //   	// allowEdit: true,
            //   	destinationType: navigator.camera.DestinationType.DATA_URL,
            //   	sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
            //   	correctOrientation: true,
            //   	// targetWidth: 428,
            //   	// targetHeight: 700,
            // 	};

            // }
            console.log('camera options: ' + JSON.stringify(options));
            $cordovaCamera.getPicture(options)
              .then(function(data) {


                console.log("after getPicture");
                //console.log(data);
                //console.log('camera data: ' + angular.toJson(data));

                var id = $scope.imgCount;
                var imageData = "data:image/jpeg;base64," + data;
                $scope.images.push({
                  'id': id,
                  'value': imageData
                })
                $scope.imgCount++;
              }, function(error) {
                console.log('camera error: ' + angular.toJson(error));
              });
            // return true;
            // }
            // });
          };

          $scope.deleteImg = function(id) {
            var i;
            for (i = 0; i < $scope.images.length; i++) {
              if ($scope.images[i].id = id) {
                $scope.images.splice(i, 1);
                break;
              }
            }
          }

          $scope.history = function() {
            $state.go('tab.history');
          }


          $scope.submit = function(text) {
            $scope.pictures.images = $scope.images;
            $scope.pictures.description = text;
            // console.log($scope.pictures);
            var request = $http({
              method: "post",
              url: 'http://sciencetap.us/tao/app/submitPictureNoSite.php',
              data: $scope.pictures
            })
            //show loading
            $scope.loading = $ionicLoading.show({
              template: 'submit pictures'
            });
            request.success(function(response) {
              console.log("submit pictures");
              console.log(response)
              if (response.success) {
                console.log("submit pictures success");
                $ionicLoading.hide();
                alert("submit success, now go to Manage page");
                $state.go('tab.manage');
              } else {
                console.log("submit fail");
                $ionicLoading.hide();
                alert("submit fail");
                //stay here
              }
            })
          };

        },
        function(error) {
          $ionicLoading.hide();
          alert("Could not get location");
          console.log("Could not get location");
        });
    }
  })

  .controller('HistoryCtrl', function($scope, $stateParams, $http, $state,$rootScope) {

    var data = {
      "user_id": $rootScope.user.id
    }
    var request = $http({
      method: "post",
      url: 'http://sciencetap.us/tao/app/getPictureHistory.php',
      data: data
    })

    request.success(function(data) {
      $scope.pictureHistory = data.data;
      console.log($scope.pictureHistory);
    })

    //!!//return without site -666


    $scope.historyDetial = function(id) {
      //var test = 1234567;
      var identity = {
        "submission_id": id
      }
      $state.go('tab.historyDetail', {
        data: identity
      });
    }


  })


  .controller('HistoryDetailCtrl', function($scope, $rootScope, $state, $stateParams, $http) {


    var submission_id = $stateParams.data.submission_id[0];
    console.log(submission_id);

    $scope.submission_data = {};

    var data = {
      "submission_id": submission_id
    }

    var request = $http({
      method: "post",
      url: 'http://sciencetap.us/tao/app/getSubmitData.php',
      data: data
    })

    request.success(function(data) {
      $scope.submission_data = data.data;
      $scope.photo = data.photo;
      if($scope.photo.length != 0){
        $scope.lat = data.photo[0].lat;
        $scope.lon = data.photo[0].lon;

      }

      console.log($scope.submission_data);
      console.log($scope.photo);
    })
  })
