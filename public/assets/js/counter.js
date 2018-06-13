//http://codepen.io/joshua_ward/pen/jrNaOb
jQuery(function($) { 

  'use strict';

  $.fn.counter = function(options) {
    var settings = $.extend({
      start: 0,
      end: 0,
      easing: 'swing',
      duration: 7000,
      complete: ''
    }, options);

    var thisElement = $(this);

    $({
      count: settings.start
    }).animate({
      count: settings.end
    }, {
      duration: settings.duration,
      easing: settings.easing,
      step: function() {
        var mathCount = Math.ceil(this.count);
        thisElement.text(mathCount);
      },
      complete: settings.complete
    });
  };

  $('#score-counter').counter({
    start: 0,
    end: 38500, // Amount
    duration: 7000 // Counter speed
  });

  $('.score-graph').each(function() {
    $(this).find('.score-graph-bar').animate({
      width: $(this).attr('data-percent')
    }, 7000); // Graph speed
  });
});