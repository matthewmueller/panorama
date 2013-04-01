/**
 * Module Dependencies
 */

var io = require('io'),
    el = document.querySelector('.degrees'),
    iphone = document.querySelector('.iphone');

/**
 * Offset
 */

var offset = 0,
    angle = 0;

/**
 * Connect socket
 */

socket = io('http://ws.mat.io:80/panorama');

/**
 * On device orientation
 */

window.ondeviceorientation = function(e) {
  angle = e.webkitCompassHeading || e.angle;
  var calibrated = angle - offset;
  calibrated = (calibrated + 360) % 360;

  if(angle) {
    el.innerHTML = (calibrated | 0) + '°';
    transform(calibrated);
  }

  socket.emit('angle', calibrated);
};

/**
 * Listen for angle events
 */

socket.on('angle', function(a) {
  a = a | 0;
  el.innerHTML = a + '°';
  transform(a);
});

/**
 * Reset when you touch the phone
 */

document.ontouchend = function(e) {
  offset = angle;
  iphone.style['-webkit-transform'] = 'rotateY(0) scale(1)';
  iphone.style['left'] = '0px';
}

/**
 * Transform
 */

function transform(a) {
  out = [];

  // scale
  var s = a;
  if(a > 180) s = 360 - a;
  s = (s / 180) + .5;

  // translate
  var t = ((a + 90) % 360) / 180;
  t = (t * 100) | 0;

  iphone.style['-webkit-transform'] = 'rotateY(' + a + 'deg) scale(' + s + ')';
  iphone.style['left'] = t + '%';
};
