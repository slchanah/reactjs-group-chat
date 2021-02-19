import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useHistory } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import './style.css';
import MainControls from '../../components/mainControls';
import MainControlsBlock from '../../components/mainControlsBlock';
import MainControlsButton from '../../components/mainControlsButton';
import { useLocation } from 'react-router-dom';
import VideoGrid from '../../components/videoGrid';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';
import UserContext from '../../context/userContext';
import ChangeNameModal from '../../components/modal/changeNameModal';
import ChatWindow from '../../components/chatWindow';
import RoomFullModal from '../../components/modal/roomFullModal';

const RoomPage = () => {
  const location = useLocation();
  const history = useHistory();

  const userContext = useContext(UserContext);

  const [peers, setPeers] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isStopVideo, setIsStopVideo] = useState(false);
  const [messages, setMessages] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [username, setUsername] = useState(userContext.username || '');
  const [isUsernameInvalid, setIsUsernameInvalid] = useState(false);
  const [isRoomFull, setIsRoomFull] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const socket = useRef();
  const myVideoStream = useRef();
  const peersRef = useRef([]);
  const chatInput = useRef();

  const ROOM_ID = useMemo(() => location.pathname.split('/').pop(), [
    location.pathname,
  ]);

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
    socket.current = io(
      `${process.env.SERVER_HOST}` || 'http://localhost:3030'
    );
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        myVideoStream.current.srcObject = stream;
        socket.current.emit('join-room', ROOM_ID);

        socket.current.on('room-full', () => {
          setIsRoomFull(true);
        });

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

        socket.current.on('receive-message', (user, content) => {
          setMessages((prevState) => [
            ...prevState,
            {
              self: false,
              user,
              content,
            },
          ]);
        });

        window.onbeforeunload = () => cleanup(ROOM_ID);
      });

    return () => cleanup(ROOM_ID);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onHandleIsMuted = useCallback(() => {
    myVideoStream.current.srcObject.getAudioTracks()[0].enabled = isMuted
      ? true
      : false;
    setIsMuted((prevState) => !prevState);
  }, [isMuted]);

  const onHandleVideoPlay = useCallback(() => {
    myVideoStream.current.srcObject.getVideoTracks()[0].enabled = isStopVideo
      ? true
      : false;
    setIsStopVideo((prevState) => !prevState);
  }, [isStopVideo]);

  const onMessageKeyDown = useCallback(
    (key, content) => {
      if (key === 'Enter') {
        setMessages((prevState) => [
          ...prevState,
          {
            self: true,
            user: 'Me',
            content,
          },
        ]);
        socket.current.emit(
          'send-message',
          userContext.username,
          content,
          ROOM_ID
        );
        chatInput.current.value = '';
      }
    },
    [ROOM_ID, userContext.username]
  );

  const onLeaveRoom = useCallback(() => {
    history.push('/');
  }, [history]);

  const handleModalClose = useCallback(() => {
    if (username.trim() === '') {
      setIsUsernameInvalid(true);
    } else {
      userContext.updateUsername(username);
      setModalOpen(false);
    }
  }, [userContext, username]);

  const onModalUsernameChange = useCallback((e) => {
    if (e.target.value.trim() === '') {
      setIsUsernameInvalid(true);
    } else {
      setIsUsernameInvalid(false);
    }
    setUsername(e.target.value);
  }, []);

  const onhandleRoomFullModalClose = useCallback(() => {
    history.push('/');
  }, [history]);

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
            <MainControlsButton
              faIcon={
                isMuted ? 'unmute fas fa-microphone-slash' : 'fas fa-microphone'
              }
              onClick={onHandleIsMuted}
            >
              <span>{isMuted ? 'Unmute' : 'Mute'}</span>
            </MainControlsButton>
            <MainControlsButton
              faIcon={isStopVideo ? 'stop fas fa-video-slash' : 'fas fa-video'}
              onClick={onHandleVideoPlay}
            >
              <span>{isStopVideo ? 'Play Video' : 'Stop Video'}</span>
            </MainControlsButton>
          </MainControlsBlock>

          <MainControlsBlock>
            <MainControlsButton
              faIcon='fas fa-user-friends'
              onClick={() => setModalOpen(true)}
            >
              <span>Rename</span>
            </MainControlsButton>
            <CopyToClipboard text={ROOM_ID} onCopy={() => setIsCopied(true)}>
              <MainControlsButton faIcon='fas fa-copy'>
                <span>{isCopied ? 'Copied' : 'Copy Room ID'}</span>
              </MainControlsButton>
            </CopyToClipboard>
          </MainControlsBlock>

          <MainControlsBlock>
            <MainControlsButton onClick={onLeaveRoom}>
              <span className='leave_meeting'>Leave Meeting</span>
            </MainControlsButton>
          </MainControlsBlock>
        </MainControls>
      </div>

      <div className='main__right'>
        <div className='main__header'>
          <h5>Chat</h5>
        </div>

        <ChatWindow messages={messages} />

        <div className='main__message_container'>
          <input
            ref={chatInput}
            onKeyDown={(e) => onMessageKeyDown(e.key, e.target.value)}
            type='text'
            placeholder='Type message here...'
          />
        </div>
      </div>

      <ChangeNameModal
        open={modalOpen}
        handleClose={handleModalClose}
        username={username}
        onUsernameChange={onModalUsernameChange}
        isUsernameInvalid={isUsernameInvalid}
      />

      <RoomFullModal
        open={isRoomFull}
        handleClose={onhandleRoomFullModalClose}
      />
    </div>
  );
};

export default RoomPage;
