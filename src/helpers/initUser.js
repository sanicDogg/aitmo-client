export default function initUser({ socket, peer, peerId }) {
  const {
    name, room, setMessages, setUsers,
  } = this;

  socket.emit('join', { name, room, peerId }, (error) => {
    if (error) alert(error);
  });

  peer.on('error', (err) => {
    console.log(err);
  });

  socket.on('message', (m) => {
    setMessages((msgs) => [...msgs, m]);
  });

  socket.on('roomData', ({ users: newUsers }) => {
    setUsers(newUsers);
  });
}
