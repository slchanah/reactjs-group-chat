import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Home from './pages/home';
import RoomPage from './pages/room';
import UserContext from './context/userContext';

function App() {
  const [username, setUsername] = useState('User');

  const updateUsername = (name) => {
    setUsername(name);
  };

  return (
    <UserContext.Provider value={{ username, updateUsername }}>
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
    </UserContext.Provider>
  );
}

export default App;
