import './Stream.css';
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import PropTypes from 'prop-types';
import { StreamContext } from './StreamContext';
import { ChannelsContext } from '../ChannelsContext';
import StreamInterface from './StreamInterface';

export default function Stream({ users, currUser }) {
  const [cameraStream, setCameraStream] = useState('');
  const [streamer, setStreamer] = useState('');
  const [isSoundMuted, setSoundMuted] = useState(true);

  const videoRef = useRef(null);
  const { socket, peer } = useContext(ChannelsContext);
  const calls = [];

  function hasCameraStream() {
    return !(!cameraStream || !cameraStream.active);
  }

  // Когда cameraStream обновится, делаем звонки всем участникам
  useEffect(() => {
    if (!hasCameraStream()) return;
    try {
      const video = videoRef.current;
      video.srcObject = cameraStream;
      video.play();
    } catch (e) {
      console.error(e);
    }
  }, [cameraStream]);

  useEffect(() => {
    if (!hasCameraStream()) return;
    users.forEach((user) => {
      if (currUser !== user.name) {
        const { peerId } = user;
        calls.push(peer.call(peerId, cameraStream));
      }
    });
  }, [cameraStream, currUser, users]);

  useEffect(() => {
    if (!peer || !socket) return;
    peer.on('call', (call) => {
      call.answer();
      call.on('stream', (remoteStream) => {
        try {
          const video = videoRef.current;
          video.srcObject = remoteStream;
          video.setAttribute('controls', '');
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
      video.removeAttribute('controls');
    });
  }, [peer, socket]);

  return (
    <div className="streaming">
      <h2 className="streaming__text">Streaming</h2>
      <video ref={videoRef} autoPlay="autoplay" muted="muted" width="300" />
      <StreamContext.Provider value={
        {
          streamer,
          cameraStream,
          setCameraStream,
          currUser,
          setSoundMuted,
          videoRef,
          calls,
          isSoundMuted,
        }
      }
      >
        <StreamInterface />
      </StreamContext.Provider>
    </div>
  );
}

Stream.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape).isRequired,
  currUser: PropTypes.string.isRequired,
};
