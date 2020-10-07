window.oncontextmenu = function(event) {
     event.preventDefault();
     event.stopPropagation();
     return false;
};

var keyDownHandler = function(evt) {
  if (evt.key === 'AudioVolumeDown') {
    alert('volume down');
  } else if (evt.key === 'AudioVolumeUp') {
    alert('volume uo');
  }
  evt.preventDefault(); // to stop system app from processing keydown event
};

window.addEventListener('keydown', keyDownHandler);
