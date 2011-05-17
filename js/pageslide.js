(function($){

	$.fn.pageslide = function(settings){
		
		var c = $.extend({},$.fn.pageslide.defaults, settings),
			$slide=$(this),
			$li,$menu,$links,

			init = function(){
				collect();
				slide();
			},
			
			collect = function(){
				$menu = $(c.menu),
				$li = $menu.find('li'),
				$links = $menu.find('a');
			},
			
			slide = function(){
				$menu.delegate('a', 'click', function(e){
					e.preventDefault();
					if($slide.find('.ps-sliding').length === 0){
						$this = $(this),
						direction = helper.getDirection(helper.getClickedMenuIndex($this)),
						$currentWrapper = $slide.find('.ps-current'),
						// replace the div content with ajax data
						$newWrapper = $('<div class="ps-sliding"><h1>'+$this.text()+'</h1></div>');
						// run our animation
						animation[direction]();
						// highlight menu item -- TODO: store in helper function
						$links.removeClass('active');
						$this.addClass('active');
					}
				});
			},
			
			helper = {
				getCurrentMenuIndex : function(){
					// TODO: -1 should be replaced by the active link class in the menu
					return $menu.data('pos') !== undefined ? $menu.data('pos') : -1;
				},
				getClickedMenuIndex : function(link){
					return $links.index(link);
				},
				setMenuIndex : function(pos){
					$menu.data('pos', pos);
				},
				getDirection : function(pos){
					var direction, current = helper.getCurrentMenuIndex();
					// next element has been clicked
					if(current < pos) direction = 'forward';
					// previous element has been clicked
					else if(current > pos) direction = 'backwards';
					
					helper.setMenuIndex(pos);
					return direction;
				}
			},
			
			animation = {
				forward : function(){
					// forward animation
					$newWrapper.prependTo($slide).addClass('ps-'+direction).animate({
						top : '0%',
						height: 'toggle'
					},callbackTrack());
					
					// hide the current div
					$currentWrapper.animate({
						top : '-100%'
					},callbackTrack());
				},
				backwards : function(){
					// backwards animation
					$newWrapper.appendTo($slide).addClass('ps-'+direction).animate({
						top : '0%',
						height: 'toggle'
					},callbackTrack());
					
					// hide the current div
					$currentWrapper.animate({
						top : '+100%'
					},callbackTrack());
				},
				done : function(){
					// remove the old div
					$currentWrapper.remove();
					// make new div to current 
					$newWrapper.attr('class', 'ps-current');
				}
			},
			callbackTrack = function(d){
				callbackTrack.queue = callbackTrack.queue || [false];
				if (d === 'done'){
					if(callbackTrack.queue.shift() && callbackTrack.queue.length == 1) animation.done();
					return;
				}
				callbackTrack.queue.push(true);
				return function(){ callbackTrack('done'); }
			};
		init();
	}
	
	// pageslide options
	$.fn.pageslide.defaults = {
		menu : '#menu',
		currentDiv : 'ps-current' // current div element class
	}
	
	// example call
	$(document).ready(function(){
		$('#ps-wrapper').pageslide({
			menu : '#menu'
		});
	})
	
})(jQuery)
