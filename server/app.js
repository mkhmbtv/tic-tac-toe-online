
const express = require('express');
const path = require('path');
const { createServer } = require('http');
const morgan = require('morgan');
const WebSocket = require('ws');

const { port } = require('./config');

const app = express();

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '/public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const server = createServer(app);
const wss = new WebSocket.Server({ server });

const processIncomingMessage = (jsonData, ws) => {
  console.log(`Processing incoming message ${jsonData}...`);
  const message = JSON.parse(jsonData);

  switch (message.type) {
    case 'add-new-player':
      addNewPlayer(message.data.player, ws);
      break;
    default:
      throw new Error(`Unknown message type: ${message.type}`);
  }
};

const addNewPlayer = (playerName, ws) => {
  // TODO Handle adding the new player.
};

wss.on('connection', (ws) => {
  ws.on('message', (jsonData) => {
    processIncomingMessage(jsonData, ws);
  });

  ws.on('close', () => {
    // TODO Cleanup the player that's associated with this WS.
  });
});

server.listen(port, () => console.log(`Listening on http://localhost:${port}`));
