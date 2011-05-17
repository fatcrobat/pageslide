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
						$newWrapper = $('<div class="ps-sliding"><h1>'+$this.text()+'</h1></div>');
						animation[direction]();
					}
				});
			},
			helper = {
				getCurrentMenuIndex : function(){
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
					if(current < pos){
						// next element has been clicked
						direction = 'forward';
					}
					else if(current > pos){
						// previous element has been clicked
						direction = 'backwards';
					}
					else{
						// current element has been clicked
					}
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
					// show the new div
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
					// show the new div
				},
				allDone : function(){
					$currentWrapper.remove();
					$newWrapper.attr('class', 'ps-current');
				}
			};
			callbackTrack = function(d){
				callbackTrack.queue = callbackTrack.queue || [false];
				if (d === 'done'){
					if(callbackTrack.queue.shift() && callbackTrack.queue.length == 1) animation.allDone();
					return;
				}
				callbackTrack.queue.push(true);
				return function(){ callbackTrack('done'); }
			};
		init();
	}
	
	
	$.fn.pageslide.defaults = {
		menu : '#menu',
		currentDiv : 'ps-current' // current div element class
	}
	
	$('#ps-wrapper').pageslide({
		menu : '#menu'
	});
	
})(jQuery)