
const express = require('express');
const path = require('path');
const { createServer } = require('http');
const morgan = require('morgan');
const WebSocket = require('ws');

const { port } = require('./config');
const { Game, Player } = require('./game-state');

const app = express();

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '/public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const server = createServer(app);
const wss = new WebSocket.Server({ server });

let game = null;

const processIncomingMessage = (jsonData, ws) => {
  console.log(`Processing incoming message ${jsonData}...`);
  const message = JSON.parse(jsonData);

  switch (message.type) {
    case 'add-new-player':
      addNewPlayer(message.data.playerName, ws);
      break;
    default:
      throw new Error(`Unknown message type: ${message.type}`);
  }
};

const addNewPlayer = (playerName, ws) => {
  const player = new Player(playerName, ws);

  if (game === null) {
    game = new Game(player);
  } else if (game.player2 === null) {
    game.player2 = player;
    startGame();
  } else {
    console.log(`Ignoring player ${playerName}...`);
    ws.close();
  }
};

const broadcastMessage = (type, data, players) => {
  const message = JSON.stringify({
    type,
    data,
  });

  console.log(`Broadcasting message ${message}...`);

  players.forEach((player) => {
    player.ws.send(message, (err) => {
      if (err) console.log(err);
    });
  });
};

const startGame = () => {
  const data = game.getData();
  data.statusMessage = `Select a square ${game.currentPlayer.playerName}!`;
  broadcastMessage('start-game', data, game.getPlayers());
};

wss.on('connection', (ws) => {
  ws.on('message', (jsonData) => {
    processIncomingMessage(jsonData, ws);
  });

  ws.on('close', () => {
    if (game !== null) {
      const { player1, player2 } = game;

      if (player1.ws === ws || (player2 !== null && player2.ws === ws)) {
        if (player1.ws !== ws) {
          player1.ws.close();
        } else if (player2 !== null) {
          player2.ws.close();
        }
        game = null;
      }
    }
  });
});

server.listen(port, () => console.log(`Listening on http://localhost:${port}`));
