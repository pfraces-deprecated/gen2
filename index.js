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
      frame(self.actors);
    }
  }));
};

Gen.prototype.actor = function (pos) {
  var a = actor(pos, [{
    el: this.render.tile(),
    x: 0,
    y: 0
  }]);
  this.actors.push(a);
  return a;
};

var frame = function (actors) {
  actors.forEach(function (actor) {
    actor.act();
  });

  actors.forEach(function (actor) {
    actor.members.forEach(function (member) {
      member.el.pos({
        x: ((actor.x + member.x) * self.cell).toString() + 'px',
        y: ((actor.y + member.y) * self.cell).toString() + 'px'
      })
    });
  });
}
