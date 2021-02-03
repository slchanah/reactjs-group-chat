import React, { useEffect, useRef } from 'react';

const Video = ({ peer }) => {
  const videoRef = useRef();

  useEffect(() => {
    peer.on('stream', (stream) => {
      videoRef.current.srcObject = stream;
    });
  }, [peer]);

  return <video muted={true} ref={videoRef} autoPlay></video>;
};

export default Video;
