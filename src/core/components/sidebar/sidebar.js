(function() {
	Zemit.app.directive('zmSidebar', ['$session', '$device', '$sessionWorkspace', '$timeout', '$hook', function($session, $device, $sessionWorkspace, $timeout, $hook) {
		return {
			restrict: 'E',
			replace: true,
			scope: true,
			templateUrl: 'core/components/sidebar/sidebar.html',
			link: function ($s, $e, attrs) {
				
				$s.sidebar = $s;
				
				var settings = $session.get('settings');
				$session.prepare('settings', {
					sidebar: {
						tabs: {
							workspace: {
								visible: $device.isLargeEnough()
							},
							// advanced: {
							// 	visible: false
							// },
							widgets: {
								visible: false
							},
							media: {
								visible: false
							},
							debug: {
								visible: false
							}
						}
					}
				});
				
				var autoFocus = function() {
					
					if($device.isPrecise()) {
						$timeout(() => {
							let autofocus = $e.find('.zm-sidebar-tab > :visible [autofocus]');
							if(autofocus.length > 0) {
								autofocus.focus();
							}
						});
					}
				};
				
				$hook.add('onContextChange', (newContext, oldContext) => {
					if(oldContext === 'preview') {
						autoFocus();
					}
				});
				
				$s.toggleDebug = () => {
					
					if(settings.debug.activated && settings.sidebar.tabs.debug.visible) {
						$s.tabs.toggle('debug');
					}
					
					settings.debug.activated = !settings.debug.activated;
				};
				
				$s.tabs = {
					
					showContent: false,
					
					init: function() {
						this.updateShowContent();
					},
					
					hideAll: function() {
						
						if(this.showContent) {
							$s.container.getScope().showContent = false;
						}
						
						this.hidden = true;
					},
					
					unhideAll: function() {
						
						if(this.showContent) {
							$s.container.getScope().showContent = true;
						}
						
						this.hidden = false;
					},
					
					closeAll: function() {
						
						angular.forEach(settings.sidebar.tabs, function(tab, key) {
							tab.visible = false;
						});
						
						this.updateShowContent();
					},
					
					updateShowContent: function() {
						
						var show = false;
						
						angular.forEach(settings.sidebar.tabs, function(tab) {
							if(tab.visible) {
								show = true;
							}
						});
						
						show ? this.show() : this.hide();
						
						if(show) {
							this.unhideAll();
						}
					},
					
					show: function() {
						
						this.showContent = true;
						$s.container.getScope().showContent = true;
					},
					
					hide: function() {
						
						this.showContent = false;
						$s.container.getScope().showContent = false;
					},
					
					toggle: function(name) {
						
						angular.forEach(settings.sidebar.tabs, function(tab, key) {
							if(key !== name) {
								tab.visible = false;
							}
						});
						
						settings.sidebar.tabs[name].visible = !settings.sidebar.tabs[name].visible;
						this.updateShowContent();
						
						autoFocus();
					}
				};
				
				$s.tooltip = {
					options: {
						direction: 'left',
						parent: '.zm-sidebar-tabs-inner:eq(0)'
					}
				};
				
				$s.tabs.init();
				$s.sidebar.tabs = $s.tabs;
				$s.$session = $session;
				$s.settings = settings;
				$s.$sessionWorkspace = $sessionWorkspace;
			}
		};
	}]);
})();