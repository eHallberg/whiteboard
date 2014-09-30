'use strict';
angular.module('whiteboard')
	.controller('todoCtrl', function($scope, $http, formatDesc, $filter) {
		$scope.items = [{}];

		var url = 'http://localhost:14782/1/';
		var webSocket =
			new WebSocket('ws://localhost:8080/ws-first-example/shout');

		webSocket.onerror = function(event) {
			onError(event)
		};

		webSocket.onopen = function(event) {
			onOpen(event)
		};

		webSocket.onmessage = function(event) {
			var msg = JSON.parse(event.data);
			onMessage(msg);
		};

		function onMessage(event) {
			$scope.$apply(function() {
				console.log(event);
				console.log(JSON.stringify(event.length));
				if (1 <= event.length) {
					$scope.items = [{}];
					$scope.items = event;
					console.log("new array: " + JSON.stringify($scope.items));
				} else {
					console.log('array pre push' + JSON.stringify($scope.items));
					if (event.id) {
						$scope.items.push(event);
						console.log("pushed update: " + JSON.stringify($scope.items));
					} else {
						$scope.items = [];
						console.log('no push: ' + JSON.stringify(event));
					}
				}
			});
		}

		function onOpen(event) {
			document.getElementById('messages').innerHTML = 'Connection established';
		}

		function onError(event) {
			alert(event.data);
		}

		function updatePostit(title, desc, color, itemId) {
			for (var i = 0; i < $scope.items.length; i++) {
				if ($scope.items[i].id === itemId) {
					if (title !== undefined && desc !== undefined && color !== undefined) {
						$scope.items[i].title = title;
						$scope.items[i].description = desc;
						$scope.items[i].color = color;
						webSocket.send(JSON.stringify($scope.items));
						console.log("Updated all");
					} else if (title !== undefined) {
						$scope.items[i].title = title;
						webSocket.send(JSON.stringify($scope.items));
						console.log("Updated title");
					} else if (desc !== undefined) {
						$scope.items[i].description = desc;
						webSocket.send(JSON.stringify($scope.items));
						console.log("Updated desc");
					} else {
						$scope.items[i].color = color;
						webSocket.send(JSON.stringify($scope.items));
						console.log("Updated color");
					}
				}
			};

		}

		$scope.addItem = function(title, desc, color) {
			if (title && desc) {
				console.log(desc);
				var newItem = {
					title: title,
					description: formatDesc.format(desc),
					color: color,
					done: false
				};
				$http.post(url, newItem).
				success(function(data) {
					webSocket.send(JSON.stringify(data));
				}).error(function() {
					console.log('Failed to post!');
				});
			} else {
				alert('Please fill in the form!');
			}
		}

		$scope.putUpdate = function(newTitle, newDesc, color, itemId) {
			console.log(newItem);
			var newItem = {
				title: newTitle,
				description: newDesc,
				color: color,
				id: itemId,
				done: false
			};
			for (var i = 0; i < $scope.items.length; i++) {

				if (newTitle !== undefined && newDesc !== undefined && color !== undefined) {
					updatePostit(newTitle, newDesc, color, itemId);
					newItem.title = newTitle;
					newItem.description = formatDesc.format(newDesc);
					newItem.color = color;
					$http.put(url + itemId, newItem);
				} else if (newTitle !== undefined && newTitle.length !== 0) {
					updatePostit(newTitle, newDesc, color, itemId);
					newItem.title = newTitle;
					newItem.description = $scope.items[i].description;
					newItem.color = $scope.items[i].color;
					$http.put(url + itemId, newItem).
					success(function(data) {

					}).error(function(data) {
						console.log('failed PUT');
					});
					console.log('Title changed');
				} else if (newDesc !== undefined && newDesc.length !== 0) {
					updatePostit(newTitle, formatDesc.format(newDesc), color, itemId);
					newItem.title = $scope.items[i].title;
					newItem.description = formatDesc.format(newDesc); // updated
					newItem.color = $scope.items[i].color;
					$http.put(url + itemId, newItem).
					success(function(data) {

					}).error(function(newItem) {
						console.log('failed PUT');
					});
					console.log('Desc changed');

				} else if (color !== undefined) {
					updatePostit(newTitle, newDesc, color, itemId);
					newItem.color = color;
					$http.put(url + itemId, newItem).
					success(function(newItem) {

					}).error(function(newItem) {
						console.log('failed PUT');
					});
					console.log('Color changed to: ' + color);

				} else {
					console.log('something went wrong');

				}
			}
			$scope.editForm.$setPristine();
		};

		$scope.getItems = function() {
			$http({
				method: 'GET',
				url: url
			}).
			success(function(data, status, headers, config) {
				$scope.items = data;
				console.log('updated items array');
			}).error(function(data, status, headers, config) {
				console.log('fail getItems');
			});
		};

		$scope.delItem = function(itemId) {
			$http({
				method: 'DELETE',
				url: url + itemId
			}).
			success(function(data, status, headers, config) {
				console.log('deleted');
			}).error(function(data, status, headers, config) {
				console.log('fail');
			});

			for (var i = 0; i < $scope.items.length; i++) {
				if ($scope.items[i].id === itemId) {
					console.log(JSON.stringify($scope.items));
					$scope.items.splice(i, 1);
					console.log('rad 163' + JSON.stringify($scope.items));
					webSocket.send(JSON.stringify($scope.items));
				}
			};
		};
		$scope.getItems();
	});