(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var traj = require('voxel-trajectory');
var tic = require('tic')();

function Sky(opts) {
  var self = this;
  if (opts.THREE) opts = {game:opts};
  this.game   = opts.game;
  this.time   = opts.time  || 0;
  this.size   = opts.size  || this.game.worldWidth() * 2;
  this._color = opts.color || new this.game.THREE.Color(0, 0, 0); //
  this._speed = opts.speed || 0.1;
}

window.Sky = function(opts) {
  var sky = new Sky(opts || {});
  sky.createBox();
  sky.createLights();
  return function(fn) {
    if (typeof fn === 'function') sky.fn = fn;
    else if (typeof fn === 'number') {
      // move to the specific time of day
      sky.time = fn;

      for (var i = 0; i <= 2400; i += sky._speed) {
        sky.tick.call(sky);
      }
    }
    return sky.tick.bind(sky);
  }
};
module.exports.Sky = Sky;

Sky.prototype.tick = function(dt) {
  tic.tick(dt);
  this.fn.call(this, this.time);
  var pos = this.game.cameraPosition();
  var vec = new this.game.THREE.Vector3(1, 1, 1);
  this.outer.position.copy(vec);
  this.inner.position.copy(vec);
  this.ambient.position.copy(vec);
  this.time += this._speed;
  // this._speed = game.speed/100;
  // this.time += this._speed;
  // if(this.time%100 === 0 ) this.time = game.time*100;
  if (this.time > 2400) this.time = 0;
  return this;
};

Sky.prototype.createBox = function() {
  var game = this.game;
  var size = this.size;

  var mat = new game.THREE.MeshBasicMaterial({
    side: game.THREE.BackSide,
    fog: false,
  });
  this.outer = new game.THREE.Mesh(
    new game.THREE.CubeGeometry(size, size, size),
    new game.THREE.MeshFaceMaterial([
      mat, mat, mat, mat, mat, mat
    ])
  );
  game.scene.add(this.outer);

  var materials = [];
  for (var i = 0; i < 6; i++) {
    materials.push(this.createCanvas());
  }
  this.inner = new game.THREE.Mesh(
    new game.THREE.CubeGeometry(size-10, size-10, size-10),
    new game.THREE.MeshFaceMaterial(materials)
  );
  game.scene.add(this.inner);
};

Sky.prototype.createLights = function() {
  var game = this.game;
  this.ambient = new game.THREE.HemisphereLight(0x408CFF, 0xFFC880, 0.6);
  game.scene.add(this.ambient);
  this.sunlight = new game.THREE.DirectionalLight(0xffffff, 0.5);
  game.scene.add(this.sunlight);
};

Sky.prototype.color = function(end, time) {
  var self = this;
  if (self._colorInterval) self._colorInterval();
  var i = 0;
  var start = self._color.clone().getHSL();
  var color = self._color.clone().getHSL();
  self._colorInterval = tic.interval(function() {
    var dt = i / time;
    for (var p in color) color[p] = start[p] + (end[p] - start[p]) * dt;
    self._color.setHSL(color.h, color.s, color.l);
    self.outer.material.materials.forEach(function(mat) {
      mat.color.setHSL(color.h, color.s, color.l);
    });
    self.ambient.color.setHSL(color.h, color.s, color.l);
    if (self.game.scene.fog) self.game.scene.fog.color.setHSL(color.h, color.s, color.l);
    if (dt === 1) self._colorInterval();
    i += self._speed;
  }, self._speed);
};

Sky.prototype.speed = function(speed) {
  if (speed != null) this._speed = speed;
  return this._speed;
};

Sky.prototype.paint = function(faces, fn) {
  var self = this;
  var args = Array.prototype.slice.call(arguments, 2);
  var index = ['back', 'front', 'top', 'bottom', 'left', 'right'];
  if (faces === 'all') faces = index;
  if (faces === 'sides') faces = ['back', 'front', 'left', 'right'];
  if (!isArray(faces)) faces = [faces];
  faces.forEach(function(face) {
    if (typeof face === 'string') {
      face = index.indexOf(String(face).toLowerCase());
      if (face === -1) return;
    }
    self.material = self.inner.material.materials[face];
    self.canvas = self.material.map.image;
    self.context = self.canvas.getContext('2d');
    fn.apply(self, args);
    self.inner.material.materials[face].map.needsUpdate = true;
  });
  self.material = self.canvas = self.context = false;
};

Sky.prototype.sun   = require('./lib/sun.js');
Sky.prototype.moon  = require('./lib/moon.js');
Sky.prototype.stars = require('./lib/stars.js');

Sky.prototype.createCanvas = function() {
  var game = this.game;

  var canvas = document.createElement('canvas');
  canvas.height = canvas.width = 512;
  var context = canvas.getContext('2d');

  var material = new game.THREE.MeshBasicMaterial({
    side: game.THREE.BackSide,
    map: new game.THREE.Texture(canvas),
    transparent: true,
    fog: false,
  });
  material.magFilter = game.THREE.NearestFilter;
  material.minFilter = game.THREE.LinearMipMapLinearFilter;
  material.wrapS = material.wrapT = game.THREE.RepeatWrapping;
  material.map.needsUpdate = true;

  return material;
};

Sky.prototype.spin = function(r, axis) {
  axis = axis || 'z';
  this.inner.rotation[axis] = this.outer.rotation[axis] = r;
  this.ambient.rotation[axis] = r + Math.PI;
  var t = traj(this.size/2, this.ambient.rotation);
  this.sunlight.position.set(t[0], t[1], t[2]);
  this.sunlight.lookAt(0, 0, 0);
};

Sky.prototype.clear = function() {
  if (!this.canvas) return false;
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

// default sky
Sky.prototype._default = {
  hours: {
       0: {color: {h: 230/360, s: 0.3, l: 0}},
     400: {color: {h: 26/360, s: 0.3, l: 0.5}},
     600: {color: {h: 230/360, s: 0.3, l: 0.7}},
    1600: {color: {h: 26/360, s: 0.3, l: 0.5}},
    1800: {color: {h: 230/360, s: 0.3, l: 0}}
  },
  init: function() {
    // add a sun on the bottom
    this.paint('bottom', this.sun);
    // add some stars
    this.paint(['top', 'left', 'right', 'front', 'back'], this.stars, 500);
    // add full moon to the top
    this.paint('top', this.moon, 0);
    // no sunlight at startup
    this.sunlight.intensity = 0;
  },
  day: 0,
  moonCycle: 29.5305882,
  until: false,
  last: 0
};

// default sky fn
Sky.prototype.fn = function(time) {
  var my = this._default;
  var hour = Math.round(time / 100) * 100;
  var speed = Math.abs(my.last - time);
  my.last = time;

  // run initialization once
  if (my.init) { my.init.call(this); delete my.init; }

  // switch color based on time of day
  // maybe make this next part into a helper function
  if (my.hours[hour]) {
    if (!my.until) {
      this.color(my.hours[hour].color, speed > 9 ? 100 : 1000);
      my.until = hour + 100;
    }
  }
  if (my.until === hour) my.until = false;
  // if(time%100 ===0) console.log("it is " + time); //for debugging

  // change moon phase
  if (time === 1200) {
    this.paint('top', this.clear);
    this.paint('top', this.moon, Math.floor(my.day % my.moonCycle) / my.moonCycle);
    this.paint('top', this.stars, 500);
  }

  // fade stars in and out
  if (time === 500) {
    this.paint(['top', 'left', 'right', 'front', 'back'], function() {
      this.material.transparent = true;
      var i = tic.interval(function(mat) {
        mat.opacity -= 0.1;
        if (mat.opacity <= 0) i();
      }, 100, this.material);
    });
  }
  if (time === 1800) {
    this.paint(['top', 'left', 'right', 'front', 'back'], function() {
      this.material.transparent = true;
      var i = tic.interval(function(mat) {
        mat.opacity += 0.1;
        if (mat.opacity >= 1) i();
      }, 100, this.material);
    });
  }

  // turn on sunlight
  if (time === 500) {
    (function(sunlight) {
      var i = tic.interval(function() {
        sunlight.intensity += 0.1;
        if (sunlight.intensity <= 1) i();
      }, 100);
    }(this.sunlight));
  }

  // turn off sunlight
  if (time === 1800) {
    (function(sunlight) {
      var i = tic.interval(function() {
        sunlight.intensity -= 0.1;
        if (sunlight.intensity <= 0) i();
      }, 100);
    }(this.sunlight));
  }

  // spin the sky 1 revolution per day
  this.spin(Math.PI * 2 * (time / 2400));

  // keep track of days
  if (time === 2400) my.day++;
};

Sky.prototype.rgba = function(c, o) {
  if (arguments.length === 4) {
    c = {r: arguments[0], g: arguments[1], b: arguments[2]};
    o = arguments[3];
  }
  return 'rgba(' + (c.r*255) + ', ' + (c.g*255) + ', ' + (c.b*255) + ', ' + o + ')';
};

function isArray(ar) {
  return Array.isArray(ar)
    || (typeof ar === 'object' && Object.prototype.toString.call(ar) === '[object Array]');
}

},{"./lib/moon.js":2,"./lib/stars.js":3,"./lib/sun.js":4,"tic":5,"voxel-trajectory":6}],2:[function(require,module,exports){
module.exports = function(phase, r, color) {
  if (!this.canvas) return false;
  r = r || 20;
  color = color || new this.game.THREE.Color(0xE6E2D1);
  var x = this.canvas.width / 2;
  var y = this.canvas.height / 2;

  // bg glow
  this.context.beginPath();
  var grd = this.context.createRadialGradient(x+r/2, y+r/2, 1, x+r/2, y+r/2, r * 2);
  grd.addColorStop(0, this.rgba(1, 1, 1, 0.3));
  grd.addColorStop(1, this.rgba(1, 1, 1, 0));
  this.context.arc(x+r/2, y+r/2, r * 2, 0, 2 * Math.PI, false);
  this.context.fillStyle = grd;
  this.context.fill();
  this.context.closePath();

  // clipping region
  this.context.save();
  this.context.beginPath();
  this.context.rect(x, y, r, r);
  this.context.clip();

  // moon bg
  this.context.beginPath();
  this.context.rect(x, y, r, r);
  this.context.fillStyle = this.rgba(color, 1);
  this.context.fill();

  this.context.translate(x, y);

  // lighter inside
  this.context.beginPath();
  this.context.rect(4, 4, r-8, r-8);
  this.context.fillStyle = this.rgba(1, 1, 1, 0.8);
  this.context.fill();

  // moon phase
  var px = (phase * r * 2) - r;
  this.context.beginPath();
  this.context.rect(px, 0, r, r);
  this.context.fillStyle = this.rgba(0, 0, 0, 0.8);
  this.context.fill();
  this.context.beginPath();
  this.context.rect(2 + px, 2, r-4, r-4);
  this.context.fillStyle = this.rgba(0, 0, 0, 0.9);
  this.context.fill();

  this.context.restore();
};

},{}],3:[function(require,module,exports){
module.exports = function(amt) {
  if (!this.canvas) return false;
  var colors = [
    '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF',
    '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF',
    '#8589FF', '#FF8585'
  ];
  var alpha = this.context.globalAlpha;
  for (var i = 0; i < amt; i++) {
    this.context.globalAlpha = Math.random() * 1 + 0.5;
    this.context.beginPath();
    this.context.arc(
      Math.random() * this.canvas.width,
      Math.random() * this.canvas.height,
      Math.random() * 0.5,
      0, 2 * Math.PI, false
    );
    this.context.fillStyle = colors[Math.floor(Math.random() * colors.length)];
    this.context.fill();
  }
  this.context.globalAlpha = alpha;
};
},{}],4:[function(require,module,exports){
module.exports = function(r, color) {
  if (!this.canvas) return false;
  r = r || 50;
  color = color || new this.game.THREE.Color(0xF8FFB5);

  this.context.save();

  // bg glow
  this.context.beginPath();
  x = (this.canvas.width/2);
  y = (this.canvas.height/2);
  var grd = this.context.createRadialGradient(x, y, 1, x, y, r * 2);
  grd.addColorStop(0, this.rgba(1, 1, 1, 0.3));
  grd.addColorStop(1, this.rgba(1, 1, 1, 0));
  this.context.arc(x, y, r * 2, 0, 2 * Math.PI, false);
  this.context.fillStyle = grd;
  this.context.fill();
  this.context.closePath();

  // outer sun
  this.context.beginPath();
  x = (this.canvas.width / 2) - (r / 2);
  y = (this.canvas.height / 2) - (r / 2);
  this.context.rect(x, y, r, r);
  this.context.fillStyle = this.rgba(color, 1);
  this.context.fill();
  this.context.closePath();

  // inner sun
  this.context.beginPath();
  r /= 1.6;
  x = (this.canvas.width / 2) - (r / 2);
  y = (this.canvas.height / 2) - (r / 2);
  this.context.rect(x, y, r, r);
  this.context.fillStyle = this.rgba(1, 1, 1, 0.5);
  this.context.fill();
  this.context.closePath();

  this.context.restore();
};
},{}],5:[function(require,module,exports){
/*
 * tic
 * https://github.com/shama/tic
 *
 * Copyright (c) 2013 Kyle Robinson Young
 * Licensed under the MIT license.
 */

function Tic() { this._things = []; }
module.exports = function() { return new Tic(); };

Tic.prototype._stack = function(thing) {
  var self = this;
  self._things.push(thing);
  var i = self._things.length - 1;
  return function() { delete self._things[i]; }
};

Tic.prototype.interval = Tic.prototype.setInterval = function(fn, at) {
  return this._stack({
    fn: fn, at: at, args: Array.prototype.slice.call(arguments, 2),
    elapsed: 0, once: false
  });
};

Tic.prototype.timeout = Tic.prototype.setTimeout = function(fn, at) {
  return this._stack({
    fn: fn, at: at, args: Array.prototype.slice.call(arguments, 2),
    elapsed: 0, once: true
  });
};

Tic.prototype.tick = function(dt) {
  var self = this;
  self._things.forEach(function(thing, i) {
    thing.elapsed += dt;
    if (thing.elapsed > thing.at) {
      thing.elapsed -= thing.at;
      thing.fn.apply(thing.fn, thing.args || []);
      if (thing.once) {
        delete self._things[i];
      }
    }
  });
};

},{}],6:[function(require,module,exports){
module.exports = function(velocity, rotation, origin) {
  if (typeof velocity === 'object') {
    origin   = velocity.origin;
    rotation = velocity.rotation;
    velocity = velocity.velocity;
  }
  velocity   = velocity || 1;
  rotation   = rotation || [0, 0, 0];
  origin     = origin   || [0, 0, 0];
  if (!Array.isArray(rotation)) rotation = [rotation.x, rotation.y, rotation.z];
  if (!Array.isArray(origin)) origin = [origin.x, origin.y, origin.z];
  return [
    (velocity * Math.sin(rotation[0]) * Math.sin(rotation[1])) + origin[0],
    (velocity * Math.cos(rotation[0])) + origin[1],
    (velocity * Math.sin(rotation[0]) * Math.cos(rotation[1])) + origin[2]
  ];
};

},{}]},{},[1]);
