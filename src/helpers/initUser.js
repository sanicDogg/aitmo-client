export default function initUser(channels) {
  const {
    name, room, setMessages, setUsers,
  } = this;

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
}
