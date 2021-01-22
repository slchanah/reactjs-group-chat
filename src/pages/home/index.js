import React from 'react';
import { useHistory } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const Home = () => {
  const history = useHistory();

  const onClick = () => {
    const roomId = uuidv4();
    history.push(`/room/${roomId}`);
  };

  return (
    <div>
      <button onClick={onClick}>Create Room</button>
    </div>
  );
};

export default Home;
