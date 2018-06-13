//jQuery code
jQuery(function($) { 

  'use strict';

  $(document).ready(function () {
    initPlaceholder();
  });

});

function initPlaceholder () {

  function submitHandler() {
    e.returnValue = false;
    return false;
  }

  if ( form.addEventListener ) {
    form.addEventListener('submit', submitHandler);
  } else if ( form.attachEvent ) {
    form.attachEvent('onsubmit', submitHandler);
  }

}