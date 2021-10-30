import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { StreamContext } from './StreamContext';
import isEnter, { isSpace } from '../../helpers/isEnter';

export default function StreamInterface() {
  const [
    streamer, socket, cameraStream, setCameraStream,
    currUser, setSoundMuted, videoRef, calls, isSoundMuted,
  ] = useContext(StreamContext);

  function startBtnClicked(e) {
    if (!isEnter(e) && !isSpace(e)) return;
    if (!window.navigator.mediaDevices) {
      alert('Camera is not available');
      return;
    }
    if (streamer) { alert('Stream started by other user'); return; }
    // Сигнал серверу о начале стрима
    socket.emit('streamRequest');
    window.navigator.mediaDevices.getUserMedia(
      {
        video: { width: 300 },
        audio: true,
      },
    )
      .then((r) => setCameraStream(r))
      .catch((err) => {
        console.error('error:', err);
      });
  }

  function closeBtnClicked(e) {
    if (!isEnter(e) && !isSpace(e)) return;
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => {
        track.stop();
      });
    }

    calls.forEach((call) => call.close());
    socket.emit('streamStop');
  }

  function enableSoundClicked(e) {
    if (!isEnter(e) && !isSpace(e)) return;
    const video = videoRef.current;
    video.muted = !video.muted;
    setSoundMuted(!isSoundMuted);
  }

  const noStreamerJSX = () => (
    <div
      className="streaming__start"
      onClick={startBtnClicked}
      onKeyDown={startBtnClicked}
      role="button"
      tabIndex={0}
    >
      Start stream
    </div>
  );

  const iAmStreamerJSX = () => (
    <div className="streaming__interface">
      <h2>You are streaming right now</h2>
      <span
        className="streaming__stop"
        onClick={closeBtnClicked}
        onKeyDown={closeBtnClicked}
        role="button"
        tabIndex={0}
      >
        Close stream
      </span>
    </div>
  );

  const SoundButton = ({ text }) => (
    <span
      className="streaming__enable-sound"
      onClick={enableSoundClicked}
      onKeyDown={enableSoundClicked}
      role="button"
      tabIndex={0}
    >
      {text}
    </span>
  );
  SoundButton.propTypes = {
    text: PropTypes.string.isRequired,
  };

  const iAmNotStreamerJSX = () => (
    <div className="streaming__interface">
      <h2>
        {streamer.name}
        {' '}
        is streaming now
      </h2>
      {
        isSoundMuted
          ? <SoundButton text="Enable Sound" />
          : <SoundButton text="Disable Sound" />
      }
    </div>
  );

  if (!streamer) {
    return noStreamerJSX();
  } if (streamer.name === currUser) {
    return iAmStreamerJSX();
  }
  return iAmNotStreamerJSX();
}
