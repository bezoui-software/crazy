window.oncontextmenu = function(event) {
     event.preventDefault();
     event.stopPropagation();
     return false;
};

var keyDownHandler = function(evt) {
  if (evt.key === 'VolumeDown') {
    alert('volume down');
  } else if (evt.key === 'VolumeUp') {
    alert('volume uo');
  }
  evt.preventDefault(); // to stop system app from processing keydown event
};

window.addEventListener('keydown', keyDownHandler);
