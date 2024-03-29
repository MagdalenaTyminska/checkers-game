import { Board } from './board.js';
import { Printer } from './printer.js';

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
  // dziedziczenie
  _playersMinimum = 2;
  _playersLimit = 2;

  #board;
  #printer;
  #moves = [];

  #selectedPiece;

  get selectedPiece() {
    return this.#selectedPiece;
  }

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

  selectPiece(coord, playerIndex) {
    const field = this.#board.getField(coord);
    if (
      !field.isEmpty() &&
      field.isPieceOwner(playerIndex) &&
      this.#getActivePlayerIndex() === playerIndex
    ) {
      this.#selectedPiece = coord;
      const coords = this.#board.getAvailableMoves(coord);

      this.#printer.resetFields();
      this.#printer.selectFields(coords);
    } else {
      this.#printer.resetFields();
      this.#resetPiece();
    }
  }

  move(notation) {
    const playerIndex = this.#getActivePlayerIndex();

    this.#board.move(notation, playerIndex, capturesCount =>
      this.#incrementPlayerScore(playerIndex, capturesCount)
    );

    this.#moves.push({ notation });

    this.#renderBoard();
    this.#renderPanel();
  }

  isGameOver() {
    const playerIndex = this.#getLastActivePlayerIndex();
    return this.#board.countPlayerPieces((playerIndex + 1) % 2) === 0;
  }

  restart() {
    const pieces = [
      CheckersGame.getStartingPositionForWhite(),
      CheckersGame.getStartingPositionForBlack(),
    ];

    this.#resetPiece();
    this.#resetMoves();
    this.#board.reset();
    this._players.forEach((player, playerIndex) => {
      player.score = 0;
      this.#insertPiecesOnBoard(pieces[playerIndex], playerIndex);
    });
    this.#board.init();

    this.#renderBoard();
    this.#renderPanel();
  }

  getActivePlayer() {
    // nie mnóżmy zależności!
    return this._players[this.#getActivePlayerIndex()];
  }

  getLastActivePlayer() {
    return this._players[this.#getLastActivePlayerIndex()];
  }

  #resetMoves() {
    this.#moves = [];
  }

  #resetPiece() {
    this.#selectedPiece = null;
  }

  #renderBoard() {
    this.#printer.renderBoard(this.#board.fieldsList);
  }

  #renderPanel() {
    this.#printer.renderPanel({
      activePlayerIndex: this.#getActivePlayerIndex(),
      playersScore: this.#getPlayersScore(),
    });
  }

  #setPlayerScore(playerIndex, score) {
    this._players[playerIndex].score = score;
  }

  #getPlayerScore(playerIndex) {
    return this._players[playerIndex].score;
  }

  #incrementPlayerScore(playerIndex, value) {
    this.#setPlayerScore(
      playerIndex,
      this.#getPlayerScore(playerIndex) + value
    );
  }

  #getPlayersScore() {
    return this._players.map(player => player.score);
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
