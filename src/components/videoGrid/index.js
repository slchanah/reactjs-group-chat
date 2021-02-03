import React from 'react';
import Video from '../video';

import './style.css';

const VideoGrid = ({ children, peers }) => (
  <div className='video-grid'>
    {children}
    {peers.map((peer) => (
      <Video key={peer.socketId} peer={peer.peer} />
    ))}
  </div>
);

export default VideoGrid;
