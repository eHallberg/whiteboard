angular.module('whiteboard')
	.directive('wbInput', function() {
		return {
			template: '<div class="input-form-example">' +
				'<div class="input-group">' +
				'<span class="input-group-addon">Title</span>' +
				'<input type="text" name="title" class="form-control" ng-model="title" placeholder="Title" maxlength="14"></div>' +
				'<div class="input-group">' +
				'<span class="input-group-addon">Desc</span>' +
				'<textarea class="form-control" name="desc" id="textarea" ng-model="desc" placeholder="Tasks"></textarea>' +
				'</div>' +
				'<select ng-model="color" name="color" ng-init="color=\'postit-green\'">' +
				'<option value="postit-blue">Blue</option>' +
				'<option value="postit-yellow">Yellow</option>' +
				'<option value="postit-red">Red</option>' +
				'<option value="postit-green">Green</option>' +
				'</select>' +
				'<button class="btn btn-default" ng-click="actionAddItem()">Add</button>' +
				'</div>',
			scope: {
				actionAddItem: '&',
				title: '=',
				desc: '=',
				color: '='


			},
			restrict: 'E'
		};
	});