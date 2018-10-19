/**
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	/**
	 * Switch field
	 */
	Zemit.app.directive('zmField', ['$compile', function($compile) {
		return {
			restrict: 'E',
			transclude: true,
			replace: true,
			templateUrl: 'core/directives/field/default/default.html',
			link: function ($s, $e, attrs) {
				
				$e.addClass('zm-field');
			}
		}
	}]);
})();