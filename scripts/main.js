window.oncontextmenu = function(event) {
   event.preventDefault();
   event.stopPropagation();
   return false;
};

function isScrolledIntoView(elem) {
  if (!$(elem) || !$(elem).offset()) return;
  var docViewTop = $(window).scrollTop();
  var docViewBottom = docViewTop + $(window).height();
  var elemTop = $(elem).offset().top;
  var elemBottom = elemTop + $(elem).height();
  return ((elemBottom >= docViewTop) && (elemTop <= docViewBottom) && (elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}



