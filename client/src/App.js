import React, { useState, useEffect, useRef } from 'react';
import Home from './components/Home';
import Game from './components/Game';

const App = () => {
  const [playerName, setPlayerName] = useState('');
  const [game, setGame] = useState(null);

  const webSocket = useRef(null);

  useEffect(() => {
    if (!playerName) return;

    const ws = new WebSocket(process.env.REACT_APP_WS_URL);

    ws.onopen = () => {
      const message = {
        type: 'add-new-player',
        data: {
          playerName,
        },
      };

      ws.send(JSON.stringify(message));
    };

    ws.onmessage = (e) => {
      console.log(`Processing incoming message ${e.data}...`);

      const message = JSON.parse(e.data);
      switch (message.type) {
        case 'start-game':
          setGame(message.data);
          break;
        default:
          throw new Error(`Unknown message type: ${message.type}`);
      }
    };

    ws.onerror = (e) => {
      console.error(e);
    };

    ws.onclose = (e) => {
      console.log(`Connection closed: ${e}`);
      webSocket.current = null;
      setPlayerName('');
      setGame(null);
    };

    webSocket.current = { ws };

    return function cleanup () {
      if (webSocket.current !== null) {
        webSocket.current.ws.close();
      }
    }
  }, [playerName])

  const updatePlayerName = (playerName) => {
    setPlayerName(playerName);
  };

  return (
    <div>
      <h1>Tic-Tac-Toe Online</h1>
      {playerName ? (
        <Game playerName={playerName} game={game} />
      ) : (
        <Home updatePlayerName={updatePlayerName} />
      )}
    </div>
    
  );
}

export default App;
