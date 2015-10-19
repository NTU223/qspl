(function() {
  var down = {q: null, s: null, p: null, l: null};
  var up = {q: null, s: null, p: null, l: null};

  var html = document.getElementsByTagName('html')[0];

  var fetcher = function(evt) {
    var c = String.fromCharCode(evt.keyCode).toLowerCase();
    if (c in this && this[c] === null) {
      this[c] = evt;
    }
  };

  html.addEventListener('keydown', fetcher.bind(down));
  html.addEventListener('keyup', fetcher.bind(up));

  var pressed = false;
  html.addEventListener('keydown', function(evt) {
    var c = String.fromCharCode(evt.keyCode).toLowerCase();
    if (c == 'g') {
      var evts = pressed ? up : down;
      for (var key in evts) {
        html.dispatchEvent(evts[key]);
      }
      pressed = !pressed;
    }
  });
})();
