import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import './Room.css';

import Messages from '../Messages/Messages';
import Input from '../Input/Input';
import Stream from '../Stream/Stream';

import initUser from '../../helpers/initUser';
import setupChannels from './setupChannels';
import Loader from '../Loader/Loader';
import { ChannelsContext } from '../ChannelsContext';
import isEnter, { isSpace } from '../../helpers/isEnter';
import CodeEditor from '../CodeEditor/CodeEditor';

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

  function changeName(e) {
    if (!isEnter(e) && !isSpace(e)) return;
    const newName = prompt('If you change your name, your messages will be lost!\nChange name to...');
    if (!newName) return;

    let existing;
    if (users) { existing = users.find((user) => user.name === newName); }

    if (existing) {
      alert('Username is taken. Try another username');
      return;
    }
    if (!socket) {
      localStorage.setItem('username', newName);
      window.location.reload();
    }
    socket.emit('changeName', newName, (errObj) => {
      if (errObj) {
        alert(errObj.error);
      } else {
        localStorage.setItem('username', newName);
        window.location.reload();
      }
    });
  }

  const tryToJoin = (channels) => {
    channels.socket.emit('roomData', room, (roomData) => {
      const { users: usersInTheRoom } = roomData;
      const existingUser = usersInTheRoom.find((user) => user.name === name);
      if (existingUser) {
        alert('User already exists. Try another username');
        changeName();
        tryToJoin(channels);
      } else {
        initUser.call({
          name, room, setMessages, setUsers,
        }, channels);
      }
    });
  };

  useEffect(() => {
    setupChannels().then((channels) => {
      setSocket(channels.socket);
      setPeer(channels.peer);

      setRoom(location.pathname.slice(1));
      setName(getUserName());

      tryToJoin(channels);
    });
  }, []);

  const sendMessage = () => {
    if (message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  };

  const channels = { socket, peer };

  return (
    <ChannelsContext.Provider value={channels}>
      <div className="room">
        <Stream users={users} currUser={name} />

        <div className="code-editor">
          <h2 style={{ marginTop: 0 }}>Collaborative editor</h2>
          <CodeEditor />
        </div>

        <div className="room__welcome-block">
          <h2 className="room__greeting">
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

          </h2>

          {
            users ? (
              <ol className="room__connected-list">
                {users.map((user) => <li key={user.id} className="room__connected-li">{user.name}</li>)}
              </ol>
            ) : <Loader />
          }

          <Messages msgs={messages} username={name} />
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
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
