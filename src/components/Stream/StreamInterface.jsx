import React, { useContext, useEffect, useState } from 'react';
import PropTypes, { exact } from 'prop-types';
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
  const [devices, setDevices] = useState(undefined);
  const [currMic, setCurrMic] = useState('');
  const [currWebcam, setCurrWebcam] = useState('');

  useEffect(() => {
    const video = videoRef.current;
    video.muted = isSoundMuted;
  }, [isSoundMuted]);

  function checkNavigator() {
    if (!window.navigator.mediaDevices) {
      alert('Streaming is not available');
      return false;
    }
    return true;
  }

  function checkUserMedia() {
    if (!window.navigator.mediaDevices.getUserMedia) {
      alert('Camera is not available');
      return false;
    }
    return true;
  }

  function checkDisplayMedia() {
    if (!window.navigator.mediaDevices.getDisplayMedia) {
      alert('Screencast is not available');
      return false;
    }
    return true;
  }

  function checkStreamer() {
    if (streamer) { alert('Stream started by other user'); return false; }
    return true;
  }

  function loadDevices() {
    navigator.mediaDevices.enumerateDevices().then((devs) => {
      const mics = devs.filter((deviceInfo) => deviceInfo.kind === 'audioinput');
      const webcams = devs.filter((deviceInfo) => deviceInfo.kind === 'videoinput');
      console.log('Devices loaded');
      console.log(mics);
      console.log(webcams);
      setDevices({ mics, webcams });
      setCurrWebcam(webcams[0].deviceId);
      setCurrMic(mics[0].deviceId);
    });
  }

  function getUserMedia(webcamDevId, micDevId) {
    return window.navigator.mediaDevices.getUserMedia(
      {
        video: { deviceId: webcamDevId ? { exact: webcamDevId } : undefined, width: 1920 },
        audio: { deviceId: micDevId ? { exact: micDevId } : undefined },
      },
    );
  }

  function getDisplayMedia() {
    return window.navigator.mediaDevices.getDisplayMedia(
      {
        cursor: true,
        video: { width: 3000 },
        audio: true,
      },
    );
  }

  function processMedia(media) {
    if (!media) return undefined;
    return media.then((r) => {
      setCameraStream(r);
      setSoundMuted(true);
      setLoading(false);
    })
      .catch((err) => {
        if (err instanceof DOMException) {
          alert('You need to gain access to the required things to start streaming');
        }
        console.error('error:', err);
        socket.emit('streamStop');
        setLoading(false);
      });
  }

  function stopAllTracks() {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => {
        track.stop();
      });
    }
  }

  useEffect(() => {
    if (!currWebcam || !currMic) return;
    stopAllTracks();
    const media = getUserMedia(currWebcam, currMic);
    processMedia(media);
  }, [currWebcam, currMic]);

  function streamBtnClicked(e) {
    if (!isEnter(e) && !isSpace(e)) return;
    if (!checkNavigator()) return;
    if (e.target.dataset.action === 'shareScreen') {
      if (!checkDisplayMedia()) return;
    }
    if (e.target.dataset.action === 'streamVideo') {
      if (!checkUserMedia()) return;
    }
    if (!checkStreamer()) return;
    if (!socket || socket.disconnected === true) {
      alert('Disconnected');
      return;
    }

    // Сигнал серверу о начале стрима
    socket.emit('streamRequest');
    setLoading(true);

    switch (e.target.dataset.action) {
      case 'shareScreen':
        processMedia(getDisplayMedia());
        break;
      case 'streamVideo':
        getUserMedia().then(() => loadDevices());
        break;
      default:
        alert('Unknown button pressed!');
    }
  }

  function closeBtnClicked(e) {
    if (!isEnter(e) && !isSpace(e)) return;
    stopAllTracks();
    setDevices(null);
    setCurrWebcam('');
    setCurrMic('');
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

  function changeSource(e) {
    switch (e.target.dataset.kind) {
      case 'webcamSelect':
        setCurrWebcam(e.target.value);
        break;
      case 'micSelect':
        setCurrMic(e.target.value);
        break;
      default:
        alert('Unknown source');
        break;
    }
  }

  function renderDevices() {
    return (
      <div className="streaming__sources">
        <label htmlFor="audioSources">
          Microphone
          <select onChange={changeSource} data-kind="micSelect" value={currMic}>
            { devices.mics.map(
              (microphone) => (
                <option
                  key={microphone.deviceId}
                  value={microphone.deviceId}
                >
                  {microphone.label}
                </option>
              ),
            ) }
          </select>
        </label>
        <label htmlFor="videoSources">
          Webcam
          <select onChange={changeSource} data-kind="webcamSelect" value={currWebcam}>
            {
              devices.webcams.map(
                (webcam) => (
                  <option
                    key={webcam.deviceId}
                    value={webcam.deviceId}
                  >
                    {webcam.label}
                  </option>
                ),
              )
            }
          </select>
        </label>
      </div>
    );
  }

  const iAmStreamerJSX = () => (
    <div className="streaming__interface">
      { isLoading ? <Loader />
        : (
          <>
            { devices ? renderDevices() : null }
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

  function SoundButton({ text }) {
    return (
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
  }
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
