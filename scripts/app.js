'use strict';
angular.module('whiteboard', ['ngRoute', 'filters'])
	.config(function($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: '../index.html',
				controller: 'todoCtrl'
			});
	});