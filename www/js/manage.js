angular.module('starter.controllers')
    .controller('ManageCtrl', function($scope, $rootScope, $state, $http,$localStorage) {

        if ($rootScope.isLogin == false || $rootScope.isLogin == undefined) {
            alert("please login to see more");
            $state.go('tab.account')
        } else {
            var data = {
                "user_id": $rootScope.user.id
            }
            var request = $http({
                method: "post",
                url: 'http://sciencetap.us/API/app/getSubmission.php',
                data: data
            })

            request.success(function(data) {
                $scope.submission = data.data;
                //console.log($scope.submission);
            })


            $scope.saveForm = $localStorage.saveForm;
            console.log($scope.saveForm);

            //!!//return without site -666

        }
        $scope.gotoSubmission = function(id) {
            //var test = 1234567;
            var identity = {
                "submission_id": id
            }
            $state.go('tab.manage-form', {
                data: identity
            });
        }


        $scope.temp = function(index) {
          var identity = {
              "index": index
          }
          $state.go('tab.saveForm', {
              data: identity
          });
        }


    })

    .controller('ManageFormCtrl', function($scope, $rootScope, $state, $stateParams, $http) {

        $scope.form = {
            "id": 1
        }

        var submission_id = $stateParams.data.submission_id[0];
        console.log(submission_id);

        $scope.submission_data = {};

        var data = {
            "submission_id": submission_id
        }

        var request = $http({
            method: "post",
            url: 'http://sciencetap.us/API/app/getSubmitData.php',
            data: data
        })

        request.success(function(data) {
            $scope.showSub = true;
            $scope.submission_data = data.data;
            $scope.photo = data.photo;
            $scope.site_id = data.site_id;
            console.log($scope.submission_data);
            console.log($scope.photo);
            console.log($scope.site_id);
        })

    })

    .controller('ManageSaveFormCtrl', function($scope, $rootScope, $state, $stateParams, $cordovaCamera,$http,$localStorage,$ionicActionSheet,$ionicPopup, $ionicLoading,$timeout) {
      $scope.images = [];
      $scope.imgCount = 0;
      var index = $stateParams.data.index[0];
      $scope.saveform = $localStorage.saveForm[index];

      for(var i =0; i<$scope.saveform.date.length; i++){
        if($scope.saveform.date[i].value != undefined)
          $scope.saveform.date[i].value = new Date($scope.saveform.date[i].value);
      }
      console.log($scope.saveform);

      // $scope.yoyoyo  = function(form) {
      //     console.log(form);
      // }


      $scope.addImage = function() {

        var options = {
            quality: 75,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 1200,
            targetHeight: 1200,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };

        console.log('camera options: ' + JSON.stringify(options));

        $cordovaCamera.getPicture(options)
          .then(function(data) {
            hideSheet();

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
          if ($scope.images[i].id == id) {
            $scope.images.splice(i, 1);
            break;
          }
        }
      }

      $scope.save = function(form){

        var confirmPopup = $ionicPopup.confirm({
          title: 'save?',
        });

        confirmPopup.then(function(res) {
          if (res) {

            $localStorage.saveForm[index] = form;
            $state.go('tab.manage');
          }
        })
      };

      $scope.delete = function(form){
        // var index = "i"+form.user_id+form.project_id+form.site_id+form.form_id;

        var confirmPopup = $ionicPopup.confirm({
          title: 'delete?',
        });

        confirmPopup.then(function(res) {
          if (res) {
            $localStorage.saveForm.splice(index, 1);
            $state.go('tab.manage');
          }
        })


      };



      $scope.submit = function(form) {

        var confirmPopup = $ionicPopup.confirm({
          title: 'submit?',
        });

        confirmPopup.then(function(res) {
          if (res) {
            select = [];

            var i, count = 0;
            if (form.selectSingle != undefined) {
              for (i = 0; i < Object.keys(form.selectSingle).length; i++) {
                select[i] = {};
                select[i].name = form.selectSingle[i].name;

                if(form.selectSingle[i].value == undefined){
                  select[i].value = [];
                  select[i].value[0] = "null";
                }else{
                  select[i].value = [];
                  select[i].value[0] = form.selectSingle[i].value;
                }

                count++;
              }
              delete form.selectSingle;
            }

            if (form.selectMulti != undefined) {
              for (i = 0; i < Object.keys(form.selectMulti).length; i++) {
                select[count] = form.selectMulti[i];

                if(form.selectMulti[i].value == undefined){
                  select[count].value = [];
                  select[count].value[0] = "null";
                }

                count++;
              }
              delete form.selectMulti;
            }

            form.select = select;

            console.log(form);

            form.images = $scope.images;

            var request = $http({
              method: "post",
              url: 'http://sciencetap.us/API/app/submitFormData.php',
              data: form
            })
            //show loading

            $scope.loading = $ionicLoading.show({
              template: 'submitting form data'
            });
            request.success(function(response) {
              $localStorage.saveForm.splice(index, 1);
              console.log("submitFormData");
              console.log(response)
              if (response.success) {
                console.log("submit form success");
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
          } else {

          }
        });



      };


    })
