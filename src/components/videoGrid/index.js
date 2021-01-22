import React, { useCallback, useEffect, useRef, useState } from 'react';

import './style.css';

const VideoGrid = () => {
  const [myVideoStream, setMyVideoStream] = useState(null);
  const videoRef = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        setMyVideoStream(stream);
        videoRef.current.srcObject = stream;
      });
  }, []);

  const playVideo = useCallback(() => {
    videoRef.current.play();
  }, []);

  return (
    <div className='video-grid'>
      {myVideoStream && (
        <video ref={videoRef} muted onLoadedMetadata={playVideo}></video>
      )}
    </div>
  );
};

export default VideoGrid;
