import './Stream.css';
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { StreamContext } from './StreamContext';
import StreamInterface from './StreamInterface';

export default function Stream({
  socket, users, peer, currUser,
}) {
  const [cameraStream, setCameraStream] = useState('');
  const [streamer, setStreamer] = useState('');
  const [isSoundMuted, setSoundMuted] = useState(true);

  const videoRef = useRef(null);

  const calls = [];

  // Когда cameraStream обновится, делаем звонки всем участникам
  useEffect(() => {
    if (!cameraStream) {
      return;
    }

    try {
      const video = videoRef.current;
      video.srcObject = cameraStream;
      video.play();
    } catch (e) {
      console.error(e);
    }

    users.forEach((user) => {
      if (currUser !== user.name) {
        const { peerId } = user;
        calls.push(peer.call(peerId, cameraStream));
      }
    });
  }, [cameraStream, peer, currUser, users]);

  useEffect(() => {
    peer.on('call', (call) => {
      call.answer();
      call.on('stream', (remoteStream) => {
        try {
          const video = videoRef.current;
          video.srcObject = remoteStream;
        } catch (e) {
          console.error(e);
        }
      });
    });

    socket.on('streamAccept', (newStreamer) => {
      setStreamer(newStreamer);
    });

    socket.on('streamClose', () => {
      setStreamer('');
      const video = videoRef.current;
      video.srcObject = null;
    });
  }, [peer, socket]);

  return (
    <div className="streaming">
      <h1 className="streaming__text">Streaming</h1>
      <video ref={videoRef} autoPlay="autoplay" muted="muted" />
      <StreamContext.Provider value={
          [streamer, socket, cameraStream, setCameraStream,
            currUser, setSoundMuted, videoRef, calls, isSoundMuted]
        }
      >
        <StreamInterface />
      </StreamContext.Provider>
    </div>
  );
}

Stream.propTypes = {
  socket: PropTypes.shape.isRequired,
  users: PropTypes.arrayOf.isRequired,
  peer: PropTypes.shape.isRequired,
  currUser: PropTypes.string.isRequired,
};
