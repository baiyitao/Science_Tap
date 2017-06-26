angular.module('starter.controllers')
    .controller('MapCtrl', function($scope, $state, $rootScope, $cordovaGeolocation, $compile, $http, $timeout, $ionicLoading) {

        if ($rootScope.isLogin == false || $rootScope.isLogin == undefined) {
            alert("please login to see more");
            $state.go('tab.account')
        } else {

            $scope.gotoManagement = function(site_id) {
                var identity = {
                    "site_id": site_id,
                    "user_id": $rootScope.user.id
                }
                $state.go('tab.project-select', {
                    data: identity
                });
            }

            function initialize() {
                var options = {
                    timeout: 10000,
                    enableHighAccuracy: true
                };
                $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
                        console.log("getCurrentPosition");

                        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

                        var mapOptions = {
                            center: new google.maps.LatLng(39.980441, -75.156498),
                            //new google.maps.LatLng(41.850033, -87.6500523),
                            latLng,
                            zoom: 11,
                            mapTypeId: google.maps.MapTypeId.ROADMAP
                        };


                        console.log("google.maps.Map");

                        $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

                        var map = $scope.map;

                        layer = new google.maps.FusionTablesLayer({
                            query: {
                                select: 'geometry',
                                from: '1_kb24whPAZttu2FPYLAFPUAUb8f6PNnSUL48TzX7'
                            },
                            options: {
                                styleId: 3,
                                templateId: 4,
                                strokeWeight: 3
                            }
                        });

                        layer.setMap(map);

                        var image = 'img/drops.png';

                        $scope.markers = [];

                        var createMarker = function(info) {
                            var marker = new google.maps.Marker({
                                map: $scope.map,
                                position: new google.maps.LatLng(info.lat, info.lon),
                                icon: image,
                                title: info.name + " (" + info.lat + " , " + info.lon + ") ",
                                site_id: info.site_id
                            });

                            marker.content = "<div>";
                            marker.content += "<h4>" + info.name + "</h4>" + " (" + info.lat + " , " + info.lon + ") ";
                            marker.content += "<div>";
                            marker.content += "<button  ng-click='gotoManagement(" + info.site_id + ")'>Go to Manage Page</button>";
                            marker.content += "</div>";
                            marker.content += "</div>";
                            var compiled = $compile(marker.content)($scope);

                            var infoWindow = new google.maps.InfoWindow({
                                content: compiled[0]
                            });

                            google.maps.event.addListener(marker, 'click', function() {
                                // var request = $http({
                                //   method: "post",
                                //   url: 'http://sciencetap.us/tao/app/getProjectInfo.php',
                                //   data: {
                                //     user_id: 1,
                                //     site_id: 2
                                //   }
                                // });
                                //
                                // request.success(function(data) {
                                //   $scope.data = data;
                                // });
                                infoWindow.open($scope.map, marker);
                            });

                            $scope.markers.push(marker);

                        };

                        if ($rootScope.isLogin == false || $rootScope.isLogin == undefined) {
                            alert("please login to see more");
                        } else {
                            var request = $http({
                                method: "post",
                                url: 'http://sciencetap.us/tao/app/getSiteName.php',
                                data: {
                                    "user_id": $rootScope.user.id
                                }
                            });
                            request.success(function(data) {
                                var markers = data.data
                                for (i = 0; i < markers.length; i++) {
                                    createMarker(markers[i]);
                                }
                            });
                        }

                    },
                    function(error) {
                        alert("Could not get location");
                        console.log("Could not get location");
                    });
            }

            $timeout(function() {
                initialize();
            });

            $scope.centerOnMe = function() {
                if (!$scope.map) {
                    return;
                }

                $scope.loading = $ionicLoading.show({
                    content: 'Getting current location...',
                    showBackdrop: false
                });

                navigator.geolocation.getCurrentPosition(function(pos) {
                    $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
                    $ionicLoading.hide();
                }, function(error) {
                    alert('Unable to get location: ' + error.message);
                });
            };

        }
    })
