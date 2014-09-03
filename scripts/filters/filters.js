angular.module('filters', []).
filter('unsafe', function($sce) {
	return function(input) {
		return $sce.trustAsHtml(input);
	};
});