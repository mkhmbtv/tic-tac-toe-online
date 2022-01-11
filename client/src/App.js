import React, { useState, useEffect, useRef } from 'react';
import Home from './components/Home';
import Game from './components/Game';
import styles from './components/Game.module.css';

const App = () => {
  const [playerName, setPlayerName] = useState('');
  const [game, setGame] = useState(null);

  const webSocket = useRef(null);

  useEffect(() => {
    if (!playerName) return;

    const ws = new WebSocket(process.env.REACT_APP_WS_URL);

    ws.onopen = () => {
      sendMessage('add-new-player', { playerName });
    };

    ws.onmessage = (e) => {
      console.log(`Processing incoming message ${e.data}...`);

      const message = JSON.parse(e.data);
      switch (message.type) {
        case 'start-game':
          setGame(message.data);
          break;
        case 'update-game':
          setGame(message.data);
          break;
        case 'end-game':
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

    const sendMessage = (type, data) => {
      const message = JSON.stringify({
        type,
        data,
      });

      console.log('Sending message:', message);

      ws.send(message);
    };

    webSocket.current = { 
      ws,
      sendMessage,
    };

    return function cleanup () {
      if (webSocket.current !== null) {
        webSocket.current.ws.close();
      }
    }
  }, [playerName])

  const updatePlayerName = (playerName) => {
    setPlayerName(playerName);
  };

  const selectGameSquare = (squareIndex) => {
    webSocket.current.sendMessage('select-game-square', { squareIndex });
  };

  const playAgainClick = () => {
    setGame(null);
    webSocket.current.sendMessage('add-new-player', { playerName });
  };

  const quit = () => {
    setPlayerName('');
  };

  return (
    <div>
      <h1>Tic-Tac-Toe Online</h1>
      {playerName ? (
        <>
          <Game 
            playerName={playerName} 
            game={game} 
            selectGameSquare={selectGameSquare} 
            playAgain={playAgainClick}
            quit={quit}
          />
        </>
      ) : (
        <Home updatePlayerName={updatePlayerName} />
      )}
    </div>
    
  );
}

export default App;
