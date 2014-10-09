'use strict';
angular.module('whiteboard')
	.controller('todoCtrl', function($scope, $http, formatDesc, $filter) {
		$scope.items = [{}];

		var ip = 'localhost';

		var url = 'http://' + ip + ':14782/1/';
		var webSocket =
			new WebSocket('ws://' + ip + ':8080/ws-first-example/shout');

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
				if (1 <= event.length) { // Check if message is more then 1 array. If yes then replace old array with event.
					$scope.items = [{}];
					$scope.items = event;
				} else {
					if (event.id) { // Check if event has id, if yes then add to items
						$scope.items.push(event);
					} else { // Event is empty, no items on whiteboard
						$scope.items = [];
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
					if (title && desc && color) {
						$scope.items[i].title = title;
						$scope.items[i].description = desc;
						$scope.items[i].color = color;
						webSocket.send(JSON.stringify($scope.items));
					} else if (title) {
						$scope.items[i].title = title;
						webSocket.send(JSON.stringify($scope.items));
					} else if (desc) {
						$scope.items[i].description = desc;
						webSocket.send(JSON.stringify($scope.items));
					} else {
						$scope.items[i].color = color;
						webSocket.send(JSON.stringify($scope.items));
					}
				}
			};

		}

		$scope.addItem = function(title, desc, color) {
			if (title && desc) {
				var newItem = {
					title: title,
					description: formatDesc.format(desc),
					color: color,
					done: false
				};
				console.log(JSON.stringify(newItem));
				console.log(newItem);
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
			var newItem = {
				title: newTitle,
				description: newDesc,
				color: color,
				done: false
			};
			for (var i = 0; i < $scope.items.length; i++) {
				if (newTitle && newDesc) {
					updatePostit(newTitle, formatDesc.format(newDesc), color, itemId);
					newItem.title = newTitle;
					newItem.description = formatDesc.format(newDesc);
					newItem.color = color;
					$http.put(url + itemId, newItem);
				} else if (newTitle) {
					newItem.title = newTitle;
					newItem.description = $scope.items[i].description;
					newItem.color = $scope.items[i].color;
					updatePostit(newTitle, $scope.items[i].description, color, itemId);
					$http.put(url + itemId, newItem).
					success(function(data) {

					}).error(function(data) {
						console.log('failed PUT');
					});
					console.log('Title changed');
				} else if (newDesc) {
					newItem.title = $scope.items[i].title;
					newItem.description = formatDesc.format(newDesc);
					newItem.color = $scope.items[i].color;
					updatePostit(newItem.title, formatDesc.format(newDesc), color, itemId);
					$http.put(url + itemId, newItem).
					success(function(data) {

					}).error(function(newItem) {
						console.log('failed PUT');
					});
					console.log('Desc changed');

				} else if (color) {
					updatePostit(newTitle, newDesc, color, itemId);
					newItem.color = color;
					$http.put(url + itemId, newItem).
					success(function(newItem) {

					}).error(function(newItem) {
						console.log('failed PUT');
					});

				} else {
					console.log('something went wrong');

				}
			}
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
					$scope.items.splice(i, 1);
					webSocket.send(JSON.stringify($scope.items));
				}
			};
		};
		$scope.getItems();
	});