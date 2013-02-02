var jsl = require('jsl'),
    dal = require('dal'),
    matrix = require('matrix'),
    shortcut = require('shortcut');

var gen = module.exports = function (config) {
  return new Gen(config);
};

var private = {
  bg: 'lightblue'
};

var Gen = function (config) {
  this.board = config.board;
  this.canvas = dal(this.board.id);
  this.map = matrix(this.board);
  this.keymap = [];

  private.self = this;
  private.board = config.board;
  private.cell = config.cell;
};

/**
 * Se espera que la instancia tenga un metodo llamado keymap, que contenga
 * el mapa de teclas (tecla -> acción)
 * 
 * Se debería aportar un setter o algo parecido
 * 
 * Se ha implementado así porque para usar metodos del juego, se necesita
 * primero crear el objeto juego:
 *
 * tetris.keymap({
 *   '8': tetris.up,
 *   '5': tetris.down,
 *   '4': tetris.left,
 *   '6': tetris.right
 * });
 */
Gen.prototype.start = function () {
  private.self.draw.board()
  var keymap = private.self.keymap;
  Object.keys(keymap).forEach(function (key) {
    shortcut.on(key, keymap[key]);
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
