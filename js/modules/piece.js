import { Move } from './move.js';

export class Piece {
  _player;

  constructor(playerIndex) {
    this.player = playerIndex;
  }

  get name() {
    return this.constructor.name.toLowerCase();
  }

  set player(value) {
    this._player = value;
  }

  get player() {
    return this._player;
  }

  set playerIndex(value) {
    this._player = value;
  }

  get playerIndex() {
    return this._player;
  }

  get availableMoves() {
    throw new Error('Implement this method!');
  }

  getMove(from, to, isCapture, inverse) {
    const move = Move.calculateMove(from, to, isCapture, inverse);
    return this.availableMoves.find(avMove => {
      return Move.isMatch(avMove, move);
    });
  }
}
