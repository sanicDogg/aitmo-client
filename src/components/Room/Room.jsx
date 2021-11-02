import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import './Room.css';

import Messages from '../Messages/Messages';
import Input from '../Input/Input';
import Stream from '../Stream/Stream';

import isEnter, { isSpace } from '../../helpers/isEnter';
import setupChannels from './setupChannels';
import Loader from '../Loader/Loader';
import { ChannelsContext } from '../ChannelsContext';

const getUserName = () => {
  let name = localStorage.getItem('username');
  if (!name) {
    while (!name) {
      name = prompt('Enter your name');
    }
  } else return name;
  localStorage.setItem('username', name);
  return name;
};

export default function Room({ location }) {
  const [name, setName] = useState(getUserName());
  const [room, setRoom] = useState(location.pathname.slice(1));
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const [socket, setSocket] = useState('');
  const [peer, setPeer] = useState('');

  useEffect(() => {
    setupChannels().then((channels) => {
      setSocket(channels.socket);
      setPeer(channels.peer);

      setRoom(location.pathname.slice(1));
      setName(getUserName());

      channels.socket.emit('join', { name, room, peerId: channels.peerId }, (error) => {
        if (error) alert(error);
      });

      channels.peer.on('error', (err) => {
        console.log(err);
      });

      channels.socket.on('message', (m) => {
        setMessages((msgs) => [...msgs, m]);
      });

      channels.socket.on('roomData', ({ users: newUsers }) => {
        setUsers(newUsers);
      });
    });
  }, []);

  const sendMessage = () => {
    if (message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  };

  const changeName = (e) => {
    if (!isEnter(e) && !isSpace(e)) return;
    const newName = prompt('If you change your name, your messages will be lost!\nChange name to...');
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
    <ChannelsContext.Provider value={{ socket, peer }}>
      <div className="room">
        <Stream users={users} currUser={name} />
        <div className="room__welcome-block">
          <h1 className="room__greeting">
            Welcome,
            {' '}
            <span
              onClick={changeName}
              onKeyDown={changeName}
              style={{ cursor: 'pointer' }}
              role="button"
              tabIndex={0}
            >
              {name}
            </span>
          </h1>
          <Messages msgs={messages} username={name} />
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
        </div>
        <div>
          <h1 className="room__connected-text">Connected users:</h1>
          {
            users ? (
              <ol className="room__connected-list">
                {users.map((user) => <li key={user.id}>{user.name}</li>)}
              </ol>
            ) : <Loader />
          }
        </div>
      </div>
    </ChannelsContext.Provider>
  );
}

Room.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
};
