var shortcut = require('shortcut'),
    actor = require('actor'),
    render = require('render');
    

var gen = module.exports = function (config) {
  return new Gen(config);
};

var Gen = function (config) {
  this.render = render(config);
  this.actors = [];
};

Gen.prototype.keymap = function (keymap) {
  Object.keys(keymap).forEach(function (key) {
    shortcut.on(key, keymap[key]);
  });
};

Gen.prototype.actor = function (pos, members) {
  this.actors.push(actor(pos, members));
};
