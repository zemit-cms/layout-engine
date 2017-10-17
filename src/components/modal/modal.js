/**
 * Modal: With this directive, you can instantiate modals containing anything
 * you need.
 * 
 * @author <contact@dannycoulombe.com>
 */
(function() {
	
	Zemit.app.factory('$modal', ['$compile', '$rootScope', function($compile, $rs) {
		
		var factory = {
			
			instances: {},
			
			/**
			 * Create a new modal instance
			 */
			create: function(id, params) {
				
				params = params || {};
				
				var $modal = angular.element('<zm-modal></zm-modal>');
				$modal.attr('id', id || $s.$root.zm.s4());
				
				if(params.title) {
					var $modalHeader = angular.element('<modal-header></modal-header>');
					$modalHeader.html(params.title);
					$modal.append($modalHeader);
				}
				
				if(params.content) {
					var $modalBody = angular.element('<modal-body></modal-body>');
					$modalBody.html(params.content);
					$modal.append($modalBody);
				}
				
				if(params.buttons) {
					var $modalFooter = angular.element('<modal-footer></modal-footer>');
					$modal.append($modalFooter);
				}
				
				var $s = $rs.$new();
				var transcludeFn = $compile($modal)($s, function(clonedElement, scope) {
					
					factory.instances[id] = {
						get: function() {
							return scope.$$childHead.modal;
						}
					};
					
					// Move modal element to body
					angular.element('body').append(clonedElement);
				});
			},
			
			/**
			 * Open an existing modal instance
			 */
			open: function(id, params) {
				
				params = params || {};
				
				var modal = factory.instances[id].get();
				modal.open(params);
			}
		};
		
		return factory;
	}]);
	
	/**
	 * Modal directive
	 */
	Zemit.app.directive('zmModal', [function() {
		return {
			restrict: 'E',
			replace: true,
			terminal: true,
			transclude: {
				header: '?modalHeader',
				body: '?modalBody',
				footer: '?modalFooter'
			},
			templateUrl: 'components/modal/modal.html',
			link: function($s, $e, attrs) {
				
				/**
				 * Modal functionalities
				 */
				$s.modal = {
					
					// Set default values
					id: attrs.id,
					visible: false,
					
					/**
					 * Toggle modal visibility
					 */
					toggleVisibility: function() {
						
						$s.modal.visible = !$s.modal.visible;
					},
					
					/**
					 * Open the modal
					 */
					open: function(params) {
						
						$s.modal.visible = true;
						
						var $inner = $e.children('.zm-modal-inner');
						var $dragHandler = $inner.children('.zm-modal-header');
						
						var height = $inner.innerHeight();
						var width = $inner.innerWidth();
						var pos = {};
						
						var restraintPosition = function(pos, size) {
							
							var maxY = window.innerHeight - size.height;
							var maxX = window.innerWidth - size.width;
							pos.y = pos.y > maxY ? maxY : pos.y < 0 ? 0 : pos.y;
							pos.x = pos.x > maxX ? maxX : pos.x < 0 ? 0 : pos.x;
						};
						
						$inner.css('top', '');
						$inner.css('left', '');
						
						// Set data
						this.data = params.data || {};
						
						if(params.openFrom) {
							
							var $from = angular.element(params.openFrom);
							var fromOffset = $from.offset();
							
							var fromOuterHeight = $from[0].offsetHeight;
							var fromOuterWidth = $from[0].offsetWidth;
							
							pos.y = (fromOffset.top + (fromOuterHeight / 2)) - parseInt(height / 2);
							pos.x = (fromOffset.left + (fromOuterWidth / 2)) - parseInt(width / 2);
							
							var scaledPos = angular.copy(pos);
							//scaledPos.y /= 1.075;
							//scaledPos.x /= 1.075;
							
							var oriScaledPos = angular.copy(scaledPos);
							restraintPosition(scaledPos, {
								height: $inner[0].offsetHeight,
								width: $inner[0].offsetWidth
							});
							
							pos.y = scaledPos.y !== oriScaledPos.y ? scaledPos.y : pos.y;
							pos.x = scaledPos.x !== oriScaledPos.x ? scaledPos.x : pos.x;
						}
						else {
							
							pos.y = (window.innerHeight / 2) - parseInt(height / 2);
							pos.x = (window.innerWidth / 2) - parseInt(width / 2);
						}
						
						// Set modal position
						$inner.css({'top': pos.y + 'px'});
						$inner.css({'left': pos.x + 'px'});
						
						// Reset previous position
						$inner[0].setAttribute('data-x', pos.x);
						$inner[0].setAttribute('data-y', pos.y);
						
						// Make modal draggable
						interact($inner[0]).allowFrom($dragHandler[0]).draggable({
							autoScroll: true,
							onstart: function(event) {
								
								angular.element('html:eq(0)').addClass('zm-cursor-drag-all');
							},
							onmove: function(event) {
								
								var target = event.target,
									// keep the dragged position in the data-x/data-y attributes
									x = (parseFloat($inner[0].getAttribute('data-x')) || 0) + event.dx,
									y = (parseFloat($inner[0].getAttribute('data-y')) || 0) + event.dy;
							
								// update the posiion attributes
								$inner.css('top', y + 'px');
								$inner.css('left', x + 'px');
								$inner[0].setAttribute('data-x', x);
								$inner[0].setAttribute('data-y', y);
							},
							onend: function(event) {
								
								var pos = {
									y: parseFloat($inner.css('top')),
									x: parseFloat($inner.css('left'))
								};
								
								angular.element('html:eq(0)').removeClass('zm-cursor-drag-all');
								
								// Make sure the modal is within the restricted area
								restraintPosition(pos, {
									height: $inner.outerHeight(),
									width: $inner.outerWidth()
								});
								$inner.css('top', pos.y + 'px');
								$inner.css('left', pos.x + 'px');
								$inner[0].setAttribute('data-x', pos.x);
								$inner[0].setAttribute('data-y', pos.y);
							}
						}).styleCursor(false);
					},
					
					/**
					 * Close the modal
					 */
					close: function() {
						
						$s.modal.visible = false;
					}
				};
			}
		};
	}]);
})();