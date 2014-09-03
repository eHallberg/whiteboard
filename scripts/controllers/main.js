'use strict';
angular.module('whiteboard')
	.controller('todoCtrl', function($scope, $http, formatDesc) {
		$scope.items = [{}];
		var url = 'http://83.226.178.70:14782/1/';
		$scope.addItem = function(title, desc, color) {

			if (title !== undefined && desc !== undefined) {
				console.log(desc);
				var newItem = {
					title: title,
					description: formatDesc.format(desc),
					color: color,
					done: false
				};
				$http.post(url, newItem).
				success(function(data) {
					$scope.getItems();
				}).error(function() {
					console.log('Failed to post!');
				});

			} else {
				alert('Please fill in the form!');
			}

		};

		$scope.putUpdate = function(itemId) {
			console.log($scope.newtitle);
			console.log($scope.newdesc);
			$http({
				method: 'get',
				url: url + itemId
			}).
			success(function(data) {
				if ($scope.newtitle !== undefined && $scope.newdesc !== undefined) {
					data.title = $scope.newtitle;
					data.description = formatDesc.format($scope.newdesc);
					$http.put(url + itemId, data).
					success(function(data) {
						$scope.getItems();
					}).error(function(data) {
						console.log('failed PUT');
					});
					console.log('Both changed');
				} else if ($scope.newtitle !== undefined) {
					data.title = $scope.newtitle;
					$http.put(url + itemId, data).
					success(function(data) {
						$scope.getItems();
					}).error(function(data) {
						console.log('failed PUT');
					});
					console.log('Title changed');
					$scope.getItems();
				} else if ($scope.newdesc !== undefined) {
					data.description = $scope.formatDesc($scope.newdesc);
					$http.put(url + itemId, data).
					success(function(data) {
						$scope.getItems();
					}).error(function(data) {
						console.log('failed PUT');
					});
					console.log('Desc changed');
					$scope.getItems();
				} else {
					console.log('something went wrong');
					$scope.getItems();
				}
			}).error(function(data) {
				console.log("Something went wrong with update");
				$scope.getItems();
			});
		};

		$scope.getItems = function() {
			$http({
				method: 'GET',
				url: url
			}).
			success(function(data, status, headers, config) {
				$scope.items = data;
			}).error(function(data, status, headers, config) {
				console.log("fail getItems");
			});
		};
		$scope.delItem = function(itemId) {
			$http({
				method: 'DELETE',
				url: url + itemId
			}).
			success(function(data, status, headers, config) {
				console.log('deleted');
				$scope.getItems();
			}).error(function(data, status, headers, config) {
				console.log('fail');
			});
		};
		$scope.getItems();
	});