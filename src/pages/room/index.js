import React, { useCallback, useEffect, useRef, useState } from 'react';

import './style.css';
import MainControls from '../../components/mainControls';
import MainControlsBlock from '../../components/mainControlsBlock';
import MainControlsButton from '../../components/mainControlsButton';
import { useLocation } from 'react-router-dom';
import VideoGrid from '../../components/videoGrid';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

const RoomPage = () => {
  const location = useLocation();

  const [peers, setPeers] = useState([]);

  const socket = useRef();
  const myVideoStream = useRef();
  const peersRef = useRef([]);

  const createInitPeer = useCallback((peerId, callerId, stream) => {
    const initPeer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    initPeer.on('signal', (signal) => {
      socket.current.emit('send-signal', peerId, callerId, signal);
    });

    return initPeer;
  }, []);

  const createNewPeer = useCallback((callerId, incomingSignal, stream) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on('signal', (signal) => {
      socket.current.emit('answer-signal', socket.current.id, callerId, signal);
    });

    peer.signal(incomingSignal);

    return peer;
  }, []);

  const cleanup = useCallback((ROOM_ID) => {
    socket.current.emit('user-disconnect', socket.current.id, ROOM_ID);
  }, []);

  useEffect(() => {
    const ROOM_ID = location.pathname.split('/').pop();
    socket.current = io('http://localhost:3030');
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        myVideoStream.current.srcObject = stream;
        socket.current.emit('join-room', ROOM_ID);
        socket.current.on('all-socket-ids', (socketIds) => {
          peersRef.current = socketIds.map((socketId) => ({
            socketId,
            peer: createInitPeer(socketId, socket.current.id, stream),
          }));
          setPeers([...peersRef.current]);
        });

        socket.current.on('user-connected', (callerId, incomingSignal) => {
          const newPeer = {
            socketId: callerId,
            peer: createNewPeer(callerId, incomingSignal, stream),
          };

          peersRef.current.push(newPeer);

          setPeers((prevState) => [...prevState, newPeer]);
        });

        socket.current.on('returning-signal', (socketId, returningSignal) => {
          const item = peersRef.current.find((p) => p.socketId === socketId);
          item.peer.signal(returningSignal);
        });

        socket.current.on('destroy-peer', (socketId) => {
          const item = peersRef.current.find((p) => p.socketId === socketId);
          if (item) {
            item.peer.destroy();
          }

          const peers = peersRef.current.filter((p) => p.socketId !== socketId);
          peersRef.current = peers;
          setPeers([...peers]);
        });

        window.onbeforeunload = () => cleanup(ROOM_ID);
      });

    return () => cleanup(ROOM_ID);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='main'>
      <div className='main__left'>
        <div className='main__video'>
          <VideoGrid peers={peers}>
            <video muted={true} ref={myVideoStream} autoPlay></video>
          </VideoGrid>
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
