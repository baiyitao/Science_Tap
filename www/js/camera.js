angular.module('starter.controllers')
  .controller('CameraCtrl', function($scope, $stateParams, $http,$state, $ionicLoading,$cordovaCamera,$ionicActionSheet) {

    $scope.images = [];
    $scope.imgCount = 0;

    var form = null;
    //$stateParams need more attributes  "user_id" : 1,   "project_id": 1,     "site_id": 1,
    // var form_id = $stateParams.data.form_id;
    // var user_id = $stateParams.data.user_id;
    // var project_id = $stateParams.data.project_id;
    // var site_id = $stateParams.data.site_id;
    // console.log(form_id);
    //
    // var data = {
    //   form_id: form_id
    // };

    var request = $http({
      method: "post",
      url: 'http://sciencetap.us/tao/app/getFm.php',
      // data: data
    })
    request.success(function(data) {
      //when get form success
      //console.log(data)
      var form = data.data
      //console.log(form)

      $scope.date = form.date;
      $scope.name = form.name;
      $scope.number = form.number;
      $scope.text = form.text;
      $scope.time = form.time;
      $scope.selectSingle = form.selectSingle;
      $scope.selectMulti = form.selectMulti;


      $scope.test = [];


      $scope.form = {
        "form_name": $scope.name,
        "user_id": user_id,
        "project_id": project_id,
        "site_id": site_id,
        "form_id": form_id,
        "date": [],
        "text": [],
        "number": [],
        "time": [],
        "images": []
      };

      $scope.reset = function() {
        $scope.form = {
          "form_name": $scope.name,
          "user_id": user_id,
          "project_id": project_id,
          "site_id": site_id,
          "form_id": form_id,
          "date": [],
          "text": [],
          "number": [],
          "time": [],
          "images": []
        };
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
                  $scope.images.push({'id':id,'value':imageData})
                  $scope.imgCount++;
              	}, function(error) {
                	console.log('camera error: ' + angular.toJson(error));
              	});
                  // return true;
            // }
        	// });
      	};

        $scope.deleteImg = function(id){
          var i;
          for(i=0; i<$scope.images.length; i++){
            if($scope.images[i].id = id){
              $scope.images.splice(i,1);
              break;
            }
          }
        }

      $scope.submit = function(form) {




        select = [];

        var i, count = 0;
        for (i = 0; i < Object.keys(form.selectSingle).length; i++) {
          select[i] = {};
          select[i].name = form.selectSingle[i].name;
          select[i].value = [];
          select[i].value[0] = form.selectSingle[i].value;
          count++;
        }

        for (i = 0; i < Object.keys(form.selectMulti).length; i++) {
          select[count] = form.selectMulti[i];
          count++;
        }


        delete form.selectMulti;
        delete form.selectSingle;

        form.select = select;

                console.log(form);

        form.images = $scope.images;



        var request = $http({
          method: "post",
          url: 'http://sciencetap.us/tao/app/submitFormData.php',
          data: form
        })
        //show loading

        $scope.loading = $ionicLoading.show({
          content: 'submitting form data',
          showBackdrop: false
        });

        request.success(function(response) {
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

      };


    })

  })
