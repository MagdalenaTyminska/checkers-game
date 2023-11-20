import { CheckersGame } from './modules/game.js';
import { Board } from './modules/board.js';
import { CheckersDOMPrinter } from './modules/printer.js';
import { Player } from './modules/player.js';
import { Field } from './modules/field.js';
import { King } from './modules/king.js';

document.addEventListener('DOMContentLoaded', function () {
  const appContainerRef = document.getElementById('app');

  if (!appContainerRef) {
    throw new Error('App container not found!');
  }

  const board = new Board();
  const printer = new CheckersDOMPrinter({ appContainerRef });
  const game = new CheckersGame({ board, printer });

  const player1 = new Player('Magda');
  const player2 = new Player('Anna');

  const player1Index = game.addPlayer(player1);
  const player2Index = game.addPlayer(player2);

  board.setField('20', Field.factory(new King(player1Index)));
  board.setField('00', Field.factory(new King(player2Index)));

  game.init();
  game.restart();

  // docelowo zamieścic w CheckersDOMPrinter
  appContainerRef.addEventListener('click', e => {
    if (e.target.classList.contains('piece')) {
      // zaznacz pionek
      const { coord } = e.target.parentElement.dataset;
      const { player: playerIndex } = e.target.dataset;

      game.selectPiece(coord, +playerIndex); // znak + oznacza zamień na Number
    } else if (
      e.target.classList.contains('cell') &&
      e.target.classList.contains('selected')
    ) {
      // wykonaj ruch
      const { coord } = e.target.dataset;
      game.move(`${game.selectedPiece}-${coord}`);

      if (game.isGameOver()) {
        const restart = confirm(
          `Wygrywa gracz: ${game.getLastActivePlayer().name}!` +
            '\n\nCzy chcesz zagrać ponownie?' +
            '\n[OK] - TAK, [Anuluj] - NIE'
        );

        if (restart) {
          game.restart();
        }
      }
    }
  });
});
