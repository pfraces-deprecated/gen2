var extend = require('extend'),
    actor = require('actor'),
    render = require('render');
    

module.exports = function (config) {
  return new Gen(config);
};

var Gen = function (config) {
  var self = this;
  this.actors = [];
  this.render = render(extend(config, {
    frame: function () {
      frame(config.cell, self.actors);
    }
  }));
};

Gen.prototype.actor = function (pos) {
  var a = actor(pos, [{
    tile: this.render.tile(),
    x: 0,
    y: 0
  }]);
  this.actors.push(a);
  return a;
};

var frame = function (cell, actors) {
  actors.forEach(function (actor) {
    actor.act();
  });

  actors.forEach(function (actor) {
    actor.members.forEach(function (member) {
      member.tile.move(actor.x + member.x, actor.y + member.y)
    });
  });
}
