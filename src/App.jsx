/**
 * Файл config/servers.js хранит IP сервера
 */

import React from 'react';
import { HashRouter, Route } from 'react-router-dom';

import CreateRoom from './components/CreateRoom/CreateRoom';
import Room from './components/Room/Room';

function App() {
  return (
    <HashRouter>
      <Route path="/" exact component={CreateRoom} />
      <Route path="/:roomId" component={Room} />
    </HashRouter>
  );
}

export default App;
