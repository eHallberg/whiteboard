angular.module('whiteboard')
	.factory('formatDesc', function() {
		var text;
		return {
			format: function(input) {
				text = input.replace(/\r?\n/g, '<li>');
				return text;
			}
		};
	});