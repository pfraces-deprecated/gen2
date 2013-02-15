var extend = require('extend'),
    shortcut = require('shortcut'),
    actor = require('actor'),
    render = require('render');
    

module.exports = function (config) {
  return new Gen(config);
};

var Gen = function (config) {
  this.actors = [];
  this.render = render(config, this.actors);
};

Gen.prototype.keymap = function (keymap) {
  Object.keys(keymap).forEach(function (key) {
    shortcut.on(key, keymap[key]);
  });
};

Gen.prototype.actor = function (pos) {
  var a = actor(pos, [{
    el: this.render.tile('blue'),
    x: 0,
    y: 0
  }]);
  this.actors.push(a);
  return a;
};
