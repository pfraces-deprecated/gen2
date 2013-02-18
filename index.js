var extend = require('extend'),
    actor = require('actor'),
    render = require('render');
    

module.exports = function (config) {
  return new Gen(config);
};

var Gen = function (config) {
  this.actors = [];
  this.render = render(config, this.actors);
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
