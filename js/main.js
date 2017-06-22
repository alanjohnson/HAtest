var PropCard = function() {
  var topPos = 0;
  var page_state = window.history || null;
  var inTransit;
  var activeGallery = $('figure.image');
  var imageArray = $('figure.image').data('media');
  var current = $('figure.image').data('current');
  var Favoritepaths = Snap.set(   Snap.select('#favorite')   );

  function updateImage() {
    activeGallery.data('current', current);
    activeGallery.find('.image2').one("load", function() {
      $(this).fadeIn('fast', function(){
        activeGallery.find('.image1').attr("src", imageArray[current]);
        $(this).hide();
      });
    }).attr("src", imageArray[current]);
  }
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
        AnimateSvg.enterAnim(e, this, Favoritepaths, 250, 4, '#0E6FD8');
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
          AnimateSvg.exitAnim(e, this, Favoritepaths, 250, 4, '#000000');
        }
        $(selected).next().find('.count').html(
          $(selected).next().find('.count').html().replace(/\((\d+)\)/, function(match, number) {
            return "(" + (number - 1) + ")";
          })
        );
      }
    },
    moveWithMouse: function(e, container, target){
      $(target).css({'transform-origin': ((e.pageX - $(container).offset().left) / $(container).width()) * 100 + '% ' + ((e.pageY - $(container).offset().top) / $(container).height()) * 100 +'%'});
    },
   prev: function(){
     current = (current === 0) ? (imageArray.length - 1) : (current -= 1);
     updateImage();
   },
   next: function() {
     current = (current < (imageArray.length - 1)) ? ( current += 1 ) : (current = 0);
     updateImage();
   },
    addListeners: function(e) {
      $('.icon.favorite').on('click', function(e){ PropCard.toggleForm(e); });
      $('#favorites_box input:checkbox').on('change', function(e){
        PropCard.addFavorite(e, this);
        clearTimeout(inTransit);
        inTransit = setTimeout( function() { PropCard.toggleForm(e); }, 1500);
      });
      $("#favorites_box").on("transitionend MSTransitionEnd webkitTransitionEnd oTransitionEnd", function(e){
        if ( !$(this).hasClass('active') ) { $(this).css('top','100%'); }
      });
      $('.image')
        .on('mouseover', function(){
          $(this).find('img').css({'transform': 'scale(1.01)'});
        })
        .on('mouseout', function(){
          $(this).find('img').css({'transform': 'scale(1)'});
        }).on('mousemove', function(e){
          PropCard.moveWithMouse(e, $(this), $(this).find('img') );
        });
        activeGallery.find('.prev').on('click', function(){ console.log('clicky'); PropCard.prev(); });
        activeGallery.find('.next').on('click', function(){ PropCard.next(); });
    },
    init: function() {
      PropCard.addListeners();
      if ( $('#favorites_box input:checkbox:checked').length ) {
        $('.icon.favorite').addClass('active');
      }
    }
  };
}();









var AnimateSvg = function() {
  return {
    enterAnim: function(e, control, paths, speed, steps, fill) {
      paths.forEach( function( el ) {
        var pathConfig = {
            from : el.attr( 'data-path-base' ),
            step1 : el.attr( 'data-path-step1' ),
            step2 : el.attr( 'data-path-step2' ),
            to : el.attr( 'data-path-to' )
          };
          if (steps === 2) {
            $(control).addClass('tweening');
            el.animate( { 'path' : pathConfig.to, fill: fill }, speed/2, mina.easein, function(){ $(control).addClass('end_state').removeClass('tweening'); });
          } else if (steps === 3) {
            el.animate( { 'path' : pathConfig.step1, fill: fill }, speed, mina.easeout, function(){
              //addTweeningClass(control);
              $(control).addClass('tweening');
              el.animate( { 'path' : pathConfig.to }, speed/2, mina.easein, function(){ $(control).addClass('end_state').removeClass('tweening'); });
            } );
          } else if (steps === 4) {
            el.animate( { 'path' : pathConfig.step1, fill: fill }, speed, mina.easeout, function(){
              //addTweeningClass(control);
              $(control).addClass('tweening');
              el.animate( { 'path' : pathConfig.step2 }, speed/2, mina.easein, function(){
                el.animate( { 'path' : pathConfig.to }, speed/2, mina.easein, function(){
                  $(control).addClass('end_state').removeClass('tweening');
                });
              });
            } );
          }
      } );
    },
    exitAnim: function(e, control, paths, speed, steps, fill) {
      paths.forEach( function( el ) {
        var pathConfig = {
            to : el.attr( 'data-path-base' ),
            step1 : el.attr( 'data-path-step1' ),
            step2 : el.attr( 'data-path-step2' ),
            from : el.attr( 'data-path-to' )
          };
          if (steps === 2) {
            $(control).removeClass('end_state').addClass('tweening');
            el.animate( { 'path' : pathConfig.to, fill: fill }, speed, mina.easein, function(){ $(control).removeClass('tweening'); });
          } else if (steps === 3) {
            el.animate( { 'path' : pathConfig.step1, fill: fill }, speed/2, mina.easeout, function(){
              //addTweeningClass(control);
              $(control).removeClass('end_state').addClass('tweening');
              el.animate( { 'path' : pathConfig.to }, speed, mina.easein, function(){ $(control).removeClass('tweening'); });
            } );
          } else if (steps === 4) {
            el.animate( { 'path' : pathConfig.step1, fill: fill }, speed/2, mina.easeout, function(){
              //addTweeningClass(control);
              $(control).removeClass('end_state').addClass('tweening');
              el.animate( { 'path' : pathConfig.step2 }, speed, mina.easein, function(){
                el.animate( { 'path' : pathConfig.to }, speed, mina.easein, function(){
                  $(control).removeClass('tweening');
                });
              });
            } );
          }
      } );
    },
    addListeners: function(e) {
      //grabLink.hover(colorPathRectangles, resumePathRectangles);
      var Menupaths = Snap.set(   Snap.select('#menuTop'),Snap.select('#menuMid'),Snap.select('#menuBtm')   );
      $( '.close' ).on( 'mouseenter', function(e) {
        AnimateSvg.enterAnim(e, this, Menupaths, 250, 3, '#4d4d4d');
      } ).on( 'mouseleave', function(e) {
        AnimateSvg.exitAnim(e, this, Menupaths, 250, 3, '#2a92d7');
      } );

      var Magnifypaths = Snap.set(   Snap.select('#magnifyHandle'),Snap.select('#magnifyLens')   );
      $( '.magnify' ).on( 'mouseenter', function(e) {
        AnimateSvg.enterAnim(e, this, Magnifypaths, 250, 3, '#4d4d4d');
      } ).on( 'mouseleave', function(e) {
        AnimateSvg.exitAnim(e, this, Magnifypaths, 250, 3, '#2a92d7');
      } );

      var Prevpaths = Snap.set( Snap.select('#controlPrev' )  );
      $( '.property_card .control.prev' ).on( 'click', function(e) {
        AnimateSvg.enterAnim(e, this, Prevpaths, 250, 3, '#4d4d4d');
        AnimateSvg.exitAnim(e, this, Prevpaths, 250, 3, '#2a92d7');
      } );
      var Nextpaths = Snap.set( Snap.select('#controlNext' )  );
      $( '.property_card .control.next' ).on( 'click', function(e) {
        AnimateSvg.enterAnim(e, this, Nextpaths, 250, 3, '#4d4d4d');
        AnimateSvg.exitAnim(e, this, Nextpaths, 250, 3, '#2a92d7');

      } );


    },
    init: function() {
      AnimateSvg.addListeners();
    }
  };
}();

$(function() {
  PropCard.init();
  AnimateSvg.init();
});
