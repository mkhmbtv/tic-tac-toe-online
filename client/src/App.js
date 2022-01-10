import React, { useState } from 'react';
import Home from './components/Home';
import Game from './components/Game';

const App = () => {
  return (
    <div>
      <h1>Tic-Tac-Toe Online</h1>
      <Home />
      <Game />
    </div>
    
  );
}

export default App;
