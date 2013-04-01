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
    transform(iphone, calibrated);
    // rotate(iphone, calibrated);
    // translate(iphone, calibrated);
    // scale(iphone, calibrated);
  }
  socket.emit('angle', calibrated);
};

/**
 * on angle
 */

socket.on('angle', function(a) {
  a = a | 0;
  el.innerHTML = a + '°';
  transform(iphone, a);
});

document.ontouchend = function(e) {
  offset = angle;
  iphone.style['-webkit-transform'] = 'rotateY(0) scale(1)';
  iphone.style['left'] = '0px';
}


/**
 * Transform
 */

function transform(el, a) {
  out = [];

  // rotate
  out.push('rotateY(' + a + 'deg)');

  // translate (% -> pixel)
  var t = ((a + 90) % 360) / 180,
      width = (el.parentNode.clientWidth * t) | 0;
  el.style['left'] = width + 'px';

  var s = a;
  if(a > 180) s = 360 - a;
  s = (s / 180) + .5;

  out.push('scale(' + s + ')');
  el.style['-webkit-transform'] = out.join(' ');
};
