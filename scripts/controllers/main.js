'use strict';
angular.module('whiteboard')
	.controller('todoCtrl', function($scope, $http, formatDesc, $filter) {
		$scope.items = [{}];
		var url = 'http://83.226.178.70:14782/1/';
		var webSocket =
			new WebSocket('ws://83.226.178.70:8080/ws-first-example/shout');

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
			$scope.items.push(event);
			//$scope.$apply();
		}

		function onOpen(event) {
			document.getElementById('messages').innerHTML = 'Connection established';
		}

		function onError(event) {
			alert(event.data);
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
		};

		$scope.putUpdate = function(newTitle, newDesc, color, itemId) {

			console.log(newTitle);
			console.log(newDesc);
			console.log(itemId);
			$http({
				method: 'get',
				url: url + itemId
			}).
			success(function(data) {
				if (newTitle !== undefined && newDesc !== undefined && color !== undefined) {
					data.title = newTitle;
					data.description = formatDesc.format(newDesc);
					data.color = color;
					$http.put(url + itemId, data).
					success(function(data) {
						webSocket.send(JSON.stringify(data));
					}).error(function(data) {
						console.log('failed PUT');
					});
					console.log('Everything updated');
				} else if (newTitle !== undefined) {
					data.title = newTitle;
					$http.put(url + itemId, data).
					success(function(data) {
						webSocket.send(JSON.stringify(data));
					}).error(function(data) {
						console.log('failed PUT');
					});
					console.log('Title changed');
					webSocket.send(JSON.stringify(data));
				} else if (newDesc !== undefined) {
					data.description = formatDesc.format(newDesc);
					$http.put(url + itemId, data).
					success(function(data) {
						webSocket.send(JSON.stringify(data));
					}).error(function(data) {
						console.log('failed PUT');
					});
					console.log('Desc changed');
					webSocket.send(JSON.stringify(data));
				} else if (color !== undefined) {
					data.color = color;
					$http.put(url + itemId, data).
					success(function(data) {
						webSocket.send(JSON.stringify(data));
					}).error(function(data) {
						console.log('failed PUT');
					});
					console.log('Color changed to: ' + color);
					webSocket.send(JSON.stringify(data));
				} else {
					console.log('something went wrong');
					webSocket.send(JSON.stringify(data));
				}
			}).error(function(data) {
				console.log('Something went wrong with update');
				webSocket.send(JSON.stringify(data));
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
		};

		$scope.getItems();

	});