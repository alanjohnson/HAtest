var PropCard = function() {
  var topPos = 0;
  var page_state = window.history || null;
  var inTransit;

  return {
    toggleForm: function(e) {
      if ( $('#favorites_box').hasClass('active') ) {
        $('#favorites_box').removeClass('active');
      } else {
        $('#favorites_box').addClass('active');
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
    },
    init: function() {
      PropCard.addListeners();
      if ( $('#favorites_box input:checkbox:checked').length ) {
        $('.icon.favorite').addClass('active');
      }
    }
  };
}();

$(function() {
  PropCard.init();
});
