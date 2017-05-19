var PropCard = function() {
  var topPos = 0;
  var page_state = window.history || null;
  var inTransit;

  return {
    toggleForm: function(e) {
      if ( $('#favorites_box').hasClass('active') ) {
        $('#favorites_box').removeClass('active');
      } else {
        $('#favorites_box').css('top','0').addClass('active');
      }
    },
    addFavorite: function(e, selected) {
      if ( selected.checked ) {
        console.log('added to ' + selected.name + ' list');
        $('.icon.favorite').addClass('active');
        $(selected).next().find('.count').html(
          $(selected).next().find('.count').html().replace(/\((\d+)\)/, function(match, number) {
            return "(" + (+number + 1) + ")";
          })
        );
      } else {
        console.log('removed from ' + selected.name + ' list');
        if ( !$('#favorites_box input:checkbox:checked').length ) {
          $('.icon.favorite').removeClass('active');
        }
        $(selected).next().find('.count').html(
          $(selected).next().find('.count').html().replace(/\((\d+)\)/, function(match, number) {
            return "(" + (number - 1) + ")";
          })
        );
      }
    },
    addListeners: function(e) {
      $('.icon.favorite').on('click', function(e){ PropCard.toggleForm(e); });
      $('#favorites_box input:checkbox').on('change', function(e){
        PropCard.addFavorite(e, this);
        clearTimeout(inTransit);
        inTransit = setTimeout( function() { PropCard.toggleForm(e); }, 1000);
      });
      $("#favorites_box").on("transitionend MSTransitionEnd webkitTransitionEnd oTransitionEnd", function(e){
        if ( !$(this).hasClass('active') ) { $(this).css('top','100%'); }
      });
    },
    init: function() {
      PropCard.addListeners();
      if ( $('#favorites_box input:checkbox:checked').length ) {
        $('.icon.favorite').addClass('active');
      }

      // SnapSVG
      var speed = 250;
  		var easing = mina.easeinout;
  		[].slice.call ( document.querySelectorAll( '.property_card .control' ) ).forEach( function( el ) {
  			var s = Snap( el.querySelector( 'svg' ) ), path = s.select( 'path' ),
  				pathConfig = {
  					from : path.attr( 'd' ),
            midpoint : el.getAttribute( 'data-path-midpoint' ),
  					to : el.getAttribute( 'data-path-to' )
  				};
  			el.addEventListener( 'click', function() {
  				path.animate( { 'path' : pathConfig.midpoint }, speed, easing, function(){
            $(el).addClass('moveit');
            path.animate( { 'path' : pathConfig.from }, speed, easing, function(){ $(el).removeClass('moveit'); });
          } );
  			} );
  		} );
     // END SnapSVG

    }
  };
}();

$(function() {
  PropCard.init();
});
