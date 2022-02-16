import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { StreamContext } from './StreamContext';
import isEnter, { isSpace } from '../../helpers/isEnter';
import { ChannelsContext } from '../ChannelsContext';
import Loader from '../Loader/Loader';

export default function StreamInterface() {
  const {
    streamer, cameraStream, setCameraStream,
    currUser, setSoundMuted, videoRef, calls, isSoundMuted,
  } = useContext(StreamContext);

  const { socket } = useContext(ChannelsContext);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    video.muted = isSoundMuted;
  }, [isSoundMuted]);

  function checkNavigator() {
    if (!window.navigator.mediaDevices) {
      alert('Camera is not available');
      return false;
    }
    return true;
  }

  function checkStreamer() {
    if (streamer) { alert('Stream started by other user'); return false; }
    return true;
  }

  function getUserMedia() {
    return window.navigator.mediaDevices.getUserMedia(
      {
        video: { width: 300 },
        audio: true,
      },
    );
  }

  function getDisplayMedia() {
    return window.navigator.mediaDevices.getDisplayMedia(
      {
        cursor: true,
        video: { width: 900 },
        audio: true,
      },
    );
  }

  function streamBtnClicked(e) {
    if (!isEnter(e) && !isSpace(e)) return;
    if (!checkNavigator()) return;
    if (!checkStreamer()) return;

    // Сигнал серверу о начале стрима
    socket.emit('streamRequest');
    setLoading(true);

    let media;

    switch (e.target.dataset.action) {
      case 'shareScreen':
        media = getDisplayMedia();
        break;
      case 'streamVideo':
        media = getUserMedia();
        break;
      default:
        alert('Unknown button pressed!');
        return;
    }

    media.then((r) => {
      setCameraStream(r);
      setSoundMuted(true);
      setLoading(false);
    })
      .catch((err) => {
        if (err instanceof DOMException) {
          alert('You need to gain access to the camera and mic to start streaming');
        }
        console.error('error:', err);
        socket.emit('streamStop');
        setLoading(false);
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
    setSoundMuted(!isSoundMuted);
  }

  const noStreamerJSX = () => (
    <div>
      <div
        className="streaming__start"
        data-action="streamVideo"
        onClick={streamBtnClicked}
        onKeyDown={streamBtnClicked}
        role="button"
        tabIndex={0}
      >
        Start stream
      </div>
      <div
        className="streaming__share-screen"
        data-action="shareScreen"
        onClick={streamBtnClicked}
        onKeyDown={streamBtnClicked}
        role="button"
        tabIndex={0}
      >
        Share screen
      </div>
    </div>
  );

  const iAmStreamerJSX = () => (
    <div className="streaming__interface">
      { isLoading ? <Loader />
        : (
          <>
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
          </>
        )}
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
