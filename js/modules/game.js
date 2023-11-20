import { Board } from './board.js';
import { Printer } from './printer.js';

// klasa ogólna, możliwość tworzenia na jej bazie innych gier
export class Game {
  _modules;
  _players = [];

  _playersMinimum = 0;
  _playersLimit = 0;

  addPlayer(player) {
    if (this._playersLimit <= this._players.length) {
      throw new Error('Too many players!');
    }

    this._players.push(player);
  }

  init() {
    if (
      this._playersMinimum > this._players.length ||
      this._playersLimit < this._players.length
    ) {
      throw new Error('Players number problem!');
    }
  }

  move() {
    throw new Error('Implement this method');
  }
}

export class CheckersGame extends Game {
  // dziedziczenie z Game
  _playersMinimum = 2;
  _playersLimit = 2;

  #board;
  #printer;
  #moves = [];

//odwołanie się w app do static metody, nie obiektu- bez this
  static getStartingPositionForBlack(boardSize = 10, rowsCount = 4) {
    const coords = {};
    for (let i = 0; i < rowsCount; i++) {
      for (let j = 0; j < boardSize; j++) {
        if ((i + j) % 2 === 1) {
          coords[`${i}${j}`] = Board.getDefaultPiece();
        }
      }
    }

    return coords;
  }

  static getStartingPositionForWhite(boardSize = 10, rowsCount = 4) {
    const coords = {};
    for (let i = boardSize - rowsCount; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        if ((i + j) % 2 === 1) {
          coords[`${i}${j}`] = Board.getDefaultPiece();
        }
      }
    }

    return coords;
  }

  constructor({ board, printer }) {
    super(); // zawsze przy dziedziczeniu

    if (!(board instanceof Board)) {
      throw new Error('Invalid argument type!');
    }
    this.#board = board;

    if (!(printer instanceof Printer)) {
      throw new Error('Invalid argument type!');
    }
    this.#printer = printer;
  }

  // dzięki super uruchamia się init z rodzica
  init() {
    super.init(); 
    this.#board.init();

    // this.#board.fieldsList[0][0] = '';
    this.#printer.init({ boardData: this.#board.fieldsList });
  }

  addPlayer(player, pieces = []) {
    super.addPlayer(player);

    const playerIndex = this._players.length - 1;
    this.#insertPiecesOnBoard(pieces, playerIndex);

    return playerIndex;
  }

  getActivePlayer() {
    return this._players[this.#getActivePlayerIndex()];
  }

  getLastActivePlayer() {
    return this._players[this.#getLastActivePlayerIndex()];
  }


  #insertPiecesOnBoard(pieces, playerIndex) {
    this.#board.insertPieces(pieces, playerIndex);
  }

  #getActivePlayerIndex() {
    return this.#moves.length % this._players.length; // ... % 2 => 0, 1 [index]
  }

  #getLastActivePlayerIndex() {
    return (this.#moves.length - 1) % this._players.length;
  }
}
