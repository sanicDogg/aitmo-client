import Peer from 'peerjs';
import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';

import './Room.css';

import { Messages } from '../Messages/Messages';
import { Input } from '../Input/Input';
import { Stream } from '../Stream/Stream';

const host = 'http://109.248.175.54:5000';
const socket = io(host);

const peer = new Peer({
  debug: true,
  config: {
    iceServers: [
      { url: 'stun:stun01.sipphone.com' },
      { url: 'stun:stun.ekiga.net' },
      { url: 'stun:stun.fwdnet.net' },
      { url: 'stun:stun.ideasip.com' },
      { url: 'stun:stun.iptel.org' },
      { url: 'stun:stun.rixtelecom.se' },
      { url: 'stun:stun.schlund.de' },
      { url: 'stun:stun.l.google.com:19302' },
      { url: 'stun:stun1.l.google.com:19302' },
      { url: 'stun:stun2.l.google.com:19302' },
      { url: 'stun:stun3.l.google.com:19302' },
      { url: 'stun:stun4.l.google.com:19302' },
      { url: 'stun:stunserver.org' },
      { url: 'stun:stun.softjoys.com' },
      { url: 'stun:stun.voiparound.com' },
      { url: 'stun:stun.voipbuster.com' },
      { url: 'stun:stun.voipstunt.com' },
      { url: 'stun:stun.voxgratia.org' },
      { url: 'stun:stun.xten.com' },
      {
        url: 'turn:numb.viagenie.ca',
        credential: 'muazkh',
        username: 'webrtc@live.com',
      },
      {
        url: 'turn:192.158.29.39:3478?transport=udp',
        credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
        username: '28224511:1379330808',
      },
      {
        url: 'turn:192.158.29.39:3478?transport=tcp',
        credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
        username: '28224511:1379330808',
      },
    ],
  },
});

const getUserName = () => {
  let name = localStorage.getItem('username');
  if (!name) {
    while (!name) {
      // eslint-disable-next-line no-alert
      name = prompt('Enter your name');
    }
  } else return name;
  localStorage.setItem('username', name);
  return name;
};

export const Room = (props) => {
  const [name, setName] = useState(getUserName());
  const [room, setRoom] = useState(props.location.pathname.slice(1));
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setRoom(props.location.pathname.slice(1));
    setName(getUserName());

    peer.on('open', (peerId) => {
      socket.emit('join', { name, room, peerId }, (error) => {
        if (error) alert(error);
      });
    });

    peer.on('error', (err) => {
      console.log(err);
    });
  }, [room, name, props.location.pathname]);

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((messages) => [...messages, message]);
    });

    socket.on('roomData', ({ users }) => {
      setUsers(users);
    });
  }, []);

  const sendMessage = () => {
    if (message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  };

  const changeName = () => {
    let newName;

    newName = prompt('If you change your name, your messages will be lost!\nChange name to...');
    if (!newName) return;

    let existing;
    if (users) { existing = users.find((user) => user.name === newName); }

    if (existing) {
      alert('Username is taken. Try another username');
      return;
    }

    socket.emit('changeName', newName, (errObj) => {
      if (errObj) {
        alert(errObj.error);
      } else {
        localStorage.setItem('username', newName);
        window.location.reload();
      }
    });
  };

  return (
    <div className="room">
      <Stream socket={socket} peer={peer} users={users} currUser={name} />
      <div className="room__welcome-block">
        <h1 className="room__greeting">
          Welcome,
          {' '}
          <span onClick={changeName} style={{ cursor: 'pointer' }}>{name}</span>
        </h1>
        <Messages msgs={messages} username={name} />
        <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
      <div>
        <h1 className="room__connected-text">Connected users:</h1>
        <ol className="room__connected-list">
          {users ? users.map((user) => <li key={user.id}>{user.name}</li>) : null }
        </ol>
      </div>
    </div>
  );
};
