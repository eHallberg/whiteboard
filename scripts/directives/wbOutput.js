angular.module('whiteboard')
	.directive('wbOutput', function() {
		return {

			template: '<div class="postit" id="{{color}}">' +
				'<ul>' +
				'<div class="innerDiv" ng-hide="editorEnabled">' +
				'<h2>{{title}}</h2>' +
				'<li ng-bind-html="desc | unsafe"></li>' +
				'<div class="buttons">' +
				'<button class="btn btn-xs" ng-click="editorEnabled=!editorEnabled">Edit</button>' +
				'<button class="btn btn-xs" ng-click="actionDelItem()">DEL</button>' +
				'</div>' +
				'</div>' +
				'<div ng-show="editorEnabled">' +
				'<input ng-model="newTitle" placeholder="Title">' +
				'<textarea id="textarea" ng-model="newDesc" placeholder="Description"></textarea>' +
				'<div>' +
				'<select ng-model="newColor" ng-init="newColor=\'postit-blue\'">' +
				'<option value="postit-blue">Blue</option>' +
				'<option value="postit-yellow">Yellow</option>' +
				'<option value="postit-red">Red</option>' +
				'<option value="postit-green">Green</option>' +
				'</select>' +
				'<button class="btn btn-default" ng-click="actionPutUpdate(); editorEnabled=!editorEnabled">Save</button>' +
				'</div>' +
				'</div>' +
				'</ul>' +
				'</div>',
			scope: {
				actionDelItem: '&',
				actionPutUpdate: '&',
				title: '=',
				desc: '=',
				color: '=',
				id: '=',
				newTitle: '=',
				newDesc: '='

			},
			restrict: 'E'
		};
	});