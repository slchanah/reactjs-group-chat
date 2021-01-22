import React, { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';

import './style.css';
import MainControls from '../../components/mainControls';
import MainControlsBlock from '../../components/mainControlsBlock';
import MainControlsButton from '../../components/mainControlsButton';
import { useLocation } from 'react-router-dom';
import VideoGrid from '../../components/videoGrid';

const RoomPage = () => {
  const [socket, setSocket] = useState(null);
  const location = useLocation();

  useEffect(() => {
    setSocket(io('http://localhost:3030'));
  }, []);

  return (
    <div className='main'>
      <div className='main__left'>
        <div className='main__video'>
          <VideoGrid />
        </div>

        <MainControls>
          <MainControlsBlock>
            <MainControlsButton faIcon='fas fa-microphone'>
              <span>Mute</span>
            </MainControlsButton>
            <MainControlsButton faIcon='fas fa-video'>
              <span>Stop Video</span>
            </MainControlsButton>
          </MainControlsBlock>

          <MainControlsBlock>
            <MainControlsButton faIcon='fas fa-shield-alt'>
              <span>Security</span>
            </MainControlsButton>
            <MainControlsButton faIcon='fas fa-user-friends'>
              <span>Participants</span>
            </MainControlsButton>
            <MainControlsButton faIcon='fas fa-comment-alt'>
              <span>Chat</span>
            </MainControlsButton>
          </MainControlsBlock>

          <MainControlsBlock>
            <MainControlsButton>
              <span className='leave_meeting'>Leave Meeting</span>
            </MainControlsButton>
          </MainControlsBlock>
        </MainControls>
      </div>

      <div className='main__right'>
        <h6>Chat</h6>
      </div>
    </div>
  );
};

export default RoomPage;
