angular.module('starter.controllers')
    .controller('ManageCtrl', function($scope, $rootScope, $state, $http) {

        if ($rootScope.isLogin == false || $rootScope.isLogin == undefined) {
            alert("please login to see more");
            $state.go('tab.account')
        } else {
            var data = {
                "user_id": $rootScope.user.id
            }
            var request = $http({
                method: "post",
                url: 'http://sciencetap.us/tao/app/getSubmission.php',
                data: data
            })

            request.success(function(data) {
                $scope.submission = data.data;
                console.log($scope.submission);
            })

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
            url: 'http://sciencetap.us/tao/app/getSubmitData.php',
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
