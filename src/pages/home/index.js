import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useContext,
} from 'react';
import { useHistory } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { TextField, Button } from '@material-ui/core';
import { io } from 'socket.io-client';

import './style.css';
import UserContext from '../../context/userContext';

const Home = () => {
  const history = useHistory();

  const socket = useRef(null);

  const userContext = useContext(UserContext);

  const [username, setUsername] = useState('');
  const [isUsernameInvalid, setIsUsernameInvalid] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [isRoomIdInvalid, setIsRoomIdInvalid] = useState(false);

  useEffect(() => {
    socket.current = io(
      `${process.env.SERVER_HOST}` || 'http://localhost:3030'
    );

    console.log('-------SERVER_HOST', process.env.SERVER_HOST);

    socket.current.on('validated-roomId', (ROOM_ID) => {
      if (ROOM_ID) {
        history.push(`/room/${ROOM_ID}`);
      } else {
        setIsRoomIdInvalid(true);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCreateRoomClick = useCallback(() => {
    userContext.updateUsername(username);
    const roomId = uuidv4();
    history.push(`/room/${roomId}`);
  }, [history, userContext, username]);

  const onJoinRoomClick = useCallback(() => {
    userContext.updateUsername(username);
    setIsRoomIdInvalid(false);
    socket.current.emit('validate-roomId', roomId);
  }, [roomId, userContext, username]);

  const onUserNameChange = useCallback((e) => {
    if (e.target.value.trim() === '') {
      setIsUsernameInvalid(true);
    } else {
      setIsUsernameInvalid(false);
    }
    setUsername(e.target.value);
  }, []);

  const onRoomIdChange = useCallback((e) => {
    setIsRoomIdInvalid(false);
    setRoomId(e.target.value);
  }, []);

  return (
    <div className='container'>
      <div className='container__navbar'>
        <div className='container__navbar__title'>Group Chat</div>
      </div>

      <div className='container__control'>
        <div className='container__control__text_field'>
          <TextField
            error={isUsernameInvalid}
            helperText={isUsernameInvalid ? 'Username cannot be empty' : ''}
            label='Your Name'
            value={username}
            fullWidth
            onChange={(e) => onUserNameChange(e)}
          />
        </div>

        <div className='container__control__text_field'>
          <TextField
            label='Room ID'
            fullWidth
            value={roomId}
            error={isRoomIdInvalid}
            helperText={isRoomIdInvalid ? 'Room ID is invalid' : ''}
            onChange={(e) => onRoomIdChange(e)}
          />
        </div>

        <div className='container__control__button_group'>
          <Button
            className='container__control__button'
            variant='contained'
            disabled={username.length === 0 || isUsernameInvalid}
            classes={{ disabled: 'container__control__button_disabled' }}
            onClick={onCreateRoomClick}
          >
            Create Room
          </Button>
          <Button
            className='container__control__button'
            variant='contained'
            classes={{ disabled: 'container__control__button_disabled' }}
            onClick={onJoinRoomClick}
            disabled={isUsernameInvalid || roomId === '' || isRoomIdInvalid}
          >
            Join Room
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
