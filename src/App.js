import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './pages/home';
import RoomPage from './pages/room';

function App() {
  return (
    <Router>
      <Switch>
        <Route path='/room/:roomId'>
          <RoomPage />
        </Route>

        <Route path='/'>
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
