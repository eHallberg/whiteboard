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

		$scope.putUpdate = function(newTitle, newDesc, itemId) {

			console.log(newTitle);
			console.log(newDesc);
			console.log(itemId);
			$http({
				method: 'get',
				url: url + itemId
			}).
			success(function(data) {
				if (newTitle !== undefined && newDesc !== undefined) {
					data.title = newTitle;
					data.description = formatDesc.format(newDesc);
					$http.put(url + itemId, data).
					success(function(data) {
						$scope.getItems();
					}).error(function(data) {
						console.log('failed PUT');
					});
					console.log('Both changed');
				} else if (newTitle !== undefined) {
					data.title = newTitle;
					$http.put(url + itemId, data).
					success(function(data) {
						$scope.getItems();
					}).error(function(data) {
						console.log('failed PUT');
					});
					console.log('Title changed');
					$scope.getItems();
				} else if (newDesc !== undefined) {
					data.description = formatDesc.format(newDesc);
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