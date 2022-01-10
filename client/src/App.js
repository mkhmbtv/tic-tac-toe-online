import React, { useState, useEffect, useRef } from 'react';
import Home from './components/Home';
import Game from './components/Game';

const App = () => {
  const [playerName, setPlayerName] = useState('');

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
      console.log(e);
    };

    ws.onerror = (e) => {
      console.error(e);
    };

    ws.onclose = (e) => {
      console.log(e);
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
        <Game playerName={playerName} />
      ) : (
        <Home updatePlayerName={updatePlayerName} />
      )}
    </div>
    
  );
}

export default App;
