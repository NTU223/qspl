var jsCode = function() {
  var html = document.getElementsByTagName('html')[0];


  // Disable blur event handler on `window` object.
  (function() {
    var origAddEventListenerFunc = window.addEventListener;
    window.addEventListener = function(eventName, handler) {
      if (eventName == 'blur') return;
      return origAddEventListenerFunc.call(window, eventName, handler);
    };
  })();


  // Fetch the most important 4 keys and use pressing spacebar to simulate
  // keydown/keyup them.
  (function() {
    var down = {q: null, s: null, p: null, l: null};
    var up = {q: null, s: null, p: null, l: null};

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
      if (c === ' ') {
        var evts = pressed ? up : down;
        for (var key in evts) {
          html.dispatchEvent(evts[key]);
        }
        pressed = !pressed;
      }
    });
  })();


  // Handles events on the progress bar for seeking.
  (function() {
    var progressBar = undefined;
    var setup = function() {
      var p = document.getElementsByClassName('progressBar')[0];
      if (p && p !== progressBar) {
        progressBar = p;
        progressBar.addEventListener('click', function(evt) {
          console.log(evt);
          seekToPercent(evt.clientX / progressBar.clientWidth);
        });
      }
      window.setTimeout(setup, 500);
    };
    setup();
  })();


  // Handles keyboard events for jumping foreword or backword.
  (function() {
    html.addEventListener('keydown', function(evt) {
      if (evt.keyCode == 39) {
        offsetSecond(5 + (evt.shitfKey ? 10 : 0));
      } else if (evt.keyCode == 37) {
        offsetSecond(-5 - (evt.shitfKey ? 10 : 0));
      }
    });
  })();


  var seekToPercent = function(p) {
    window.jwplayer().seek(window.jwplayer().getDuration() * p);
  };


  var offsetSecond = function(s) {
    console.log(window.jwplayer().getPosition());
    console.log(window.jwplayer().getPosition() + s);
    window.jwplayer().seek(window.jwplayer().getPosition() + s);
  };
};


var extension = extension || {};  //!< namespace extension


/*!
 * @function Extension's entry point.
 */
extension.main = function() {
  extension._insertJS('(' + jsCode.toString() + ')()');
};


/*!
 * @function Inserts a peace of javascript code tag.
 *
 * @param [in] code The code.
 */
extension._insertJS = function(code) {
  if (typeof document == 'undefined') {
    console.log(code);
    return;
  }

  var script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.innerHTML = code;

  var htmls = document.getElementsByTagName('html');
  htmls[htmls.length - 1].appendChild(script);
};


extension.main();  //!< Go!!
