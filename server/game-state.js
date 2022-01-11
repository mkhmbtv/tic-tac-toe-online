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

  selectSquare(player, squareIndex) {
    if (this.squareValues[squareIndex] !== '') return;
    
    if (player.playerName === this.player1.playerName) {
      this.squareValues[squareIndex] = this.player1Symbol;
      this.currentPlayer = this.player2;
    } else {
      this.squareValues[squareIndex] = this.player2Symbol;
      this.currentPlayer = this.player1;
    }
    
  }

  getGameStatus() {
    let gameStatus = '';
    // Check rows
    for (let i = 0; i < 9; i += 3) {
      if (this.squareValues[i] !== '' && this.squareValues[i] === this.squareValues[i + 1] && this.squareValues[i] === this.squareValues[i + 2]) {
        gameStatus = this.squareValues[i];
        return gameStatus;
      }
    }

    // Check columns
    for (let i = 0; i < 3; i += 1) {
      if (this.squareValues[i] !== '' && this.squareValues[i] === this.squareValues[i + 3] && this.squareValues[i] === this.squareValues[i + 6]) {
        gameStatus = this.squareValues[i];
        return gameStatus;
      }
    }

    // Check the diagonals
    if (this.squareValues[0] !== '' && this.squareValues[0] === this.squareValues[4] && this.squareValues[0] === this.squareValues[8]) {
      gameStatus = this.squareValues[0];
      return gameStatus
    }

    if (this.squareValues[2] !== '' && this.squareValues[2] === this.squareValues[4] && this.squareValues[2] === this.squareValues[6]) {
      gameStatus = this.squareValues[2];
      return gameStatus;
    }

    return gameStatus;
  }

  checkGameStatus() {
    const gameStatus = this.getGameStatus();
    if (gameStatus === '') {
      let isDraw = true;
      for (let i = 0; i < 9; i++) {
        if (this.squareValues[i] === '') {
          isDraw = false;
          break;
        }
      }

      if (isDraw) {
        this.gameOver = true;
      }
    }

    if (gameStatus !== '') {
      this.gameOver = true;
      this.winner = gameStatus === this.player1Symbol
        ? this.player1
        : this.player2;
    }
    return this.gameOver;
  }

  gameOverMessage() {
    return this.winner 
      ? `Winner: ${this.winner.playerName}`
      : `Winner: Draw!`;
  }
}

module.exports = {
  Player,
  Game,
};