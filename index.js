var jsl = require("jsl"),
    dal = require("dal"),
    matrix = require("matrix");

var gen = module.exports = function (config) {
  return new Gen(config);
};

var private = {
  self: {},
  board: {},
  cell: {},
  bg: 'lightblue'
};

var Gen = function (config) {
  this.board = config.board;
  this.canvas = dal(this.board.id);
  this.map = matrix(this.board);
  this.keymap = config.keymap;

  private.self = this;
  private.board = config.board;
  private.cell = config.cell;

  dal(document.body).on('keypress', function (event) {
    var key = String.fromCharCode(event.keyCode);
    if (key in private.self.keymap) {
      private.self.keymap[key]();
    }
  });
};

Gen.prototype.draw = {
  board: function () {
    var board = private.board,
        cell = private.cell;
    private.self.canvas.size({
      width: (board.width * cell.width).toString() + cell.unit,
      height: (board.height * cell.height).toString() + cell.unit
    }).
      color({ bg: private.bg });

    for (var y = 0; y < board.height; y++) {
      for (var x = 0; x < board.width; x++) {
        this.cell({ x: x, y: y });
      };
    };
  },
  cell: function (args) {
    var cell = dal('cell_' + args.x + '_' + args.y)
      .size({
        width: private.cell.width.toString() + private.cell.unit,
        height: private.cell.height.toString() + private.cell.unit
      });

    /**
     * dal:
     *
     * Sustituir
     *
     *   dal('board').add(cell);
     *
     * por:
     *
     *   cell.goto('board'); 
     *
     * Si ya está dentro de 'board' no se mueve
     *
     * add() debería clonar, si el nodo a añadir forma parte de document
     */
    dal('board').add(cell);
    cell
      .color({ bg: private.self.map.at(args).color })
      .move({
        x: (args.x * private.cell.width).toString() + private.cell.unit,
        y: (args.y * private.cell.height).toString() + private.cell.unit,
        relative: true
      })
  }
};
