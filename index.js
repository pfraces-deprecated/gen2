var extend = require('extend'),
    actor = require('actor'),
    render = require('render'),
    matrix = require('matrix'),
    type = require('type');
    

module.exports = function (config) {
  return new Gen(config);
};

var Gen = function (config) {
  var gen = this;
  this.actors = [];
  
  this.matrix = matrix({
    width: config.width,
    height: config.height
  });

  this.render = render(extend(config, {
    frame: function () {
      frame(gen.matrix, gen.actors);
    }
  }));

  this.playPause = this.render.playPause;
};

Gen.prototype.actor = function (x, y, shape) {
  var gen = this,
      a = actor({ x: x, y: y }),
      s = matrix(shape);

  this.actors.push(a);

  s.each(function (x, y, cell) {
    if (cell) {
      a.add({
        tile: gen.render.tile(),
        x: x,
        y: y
      });
    }
  });

  collisionDetection(gen.matrix, a, gen.actors);
  return a;
};

var frame = function (matrix, actors) {
  actors.forEach(function (actor) {
    actor.act(function () {
      collisionDetection(matrix, actor, actors);
    });
  });

  actors.forEach(function (actor) {
    actor.members.forEach(function (member) {
      member.tile.move(actor.x + member.x, actor.y + member.y)
    });
  });
};

var collisionDetection = function (matrix, actor, actors) {
  actor.members.forEach(function (member) {
    var x = actor.x + member.x,
        y = actor.y + member.y,
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
