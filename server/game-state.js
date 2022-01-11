class Player {
  constructor(playerName, ws) {
    this.playerName = playerName;
    this.ws = ws;
  }

  getData() {
    return {
      playerName: this.playerName,
    };
  }
}

class Game {
  constructor(player1) {
    this.player1 = player1;
    this.player2 = null;
    this.player1Symbol = 'X';
    this.player2Symbol = 'O';
    this.currentPlayer = player1;
    this.squareValues = ['', '', '', '', '', '', '', '', ''];
    this.gameOver = false;
    this.winner = null;
    this.statusMessage = null;
  }

  getPlayers() {
    return [this.player1, this.player2];
  }

  getData() {
    return {
      player1: this.player1.getData(),
      player2: this.player2.getData(),
      player1Symbol: this.player1Symbol,
      player2Symbol: this.player2Symbol,
      currentPlayer: this.currentPlayer.getData(),
      squareValues: this.squareValues,
      gameOver: this.gameOver,
      winner: this.winner ? this.winner.getData() : null,
      statusMessage: this.statusMessage,
    };
  }
}

module.exports = {
  Player,
  Game,
};