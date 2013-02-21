var extend = require('extend'),
    actor = require('actor'),
    render = require('render'),
    matrix = require('matrix'),
    type = require('type');
    

module.exports = function (config) {
  return new Gen(config);
};

var Gen = function (config) {
  var self = this;
  this.actors = [];
  
  this.matrix = matrix({
    width: config.width,
    height: config.height
  });

  this.render = render(extend(config, {
    frame: function () {
      frame(self.actors);
    }
  }));

  this.playPause = this.render.playPause;
};

Gen.prototype.actor = function (x, y, shape) {
  var self = this,
      a = actor(x, y),
      s = matrix(shape);

  a.actions.after(function () {
    collisionDetection(self.matrix, a, self.actors);
  });

  this.actors.push(a);

  s.each(function (x, y, cell) {
    if (cell) {
      a.add({
        tile: self.render.tile(),
        x: x,
        y: y
      });
    }
  });

  collisionDetection(self.matrix, a, self.actors);
  return a;
};

var frame = function (actors) {
  actors.forEach(function (actor) {
    actor.actions.run();
  });

  actors.forEach(function (actor) {
    actor.members.forEach(function (member) {
      member.tile.move(actor.x() + member.x, actor.y() + member.y)
    });
  });
};

var collisionDetection = function (matrix, actor, actors) {
  actor.members.forEach(function (member) {
    var x = actor.x() + member.x,
        y = actor.y() + member.y,
        target = matrix.at(x, y);

    type(target).handle({
      'nil': function () {
        matrix.at(x, y, actor.id);
      },
      'undef': function () {
        collisionHandler(actors[actor.id]);
      },
      'default': function () {
        collisionHandler(actors[actor.id], actors[target]);
      }
    });
  });
}

var collisionHandler = function (last, first) {
  last.move.back();
};
