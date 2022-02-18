import Peer from 'peerjs';
import { io } from 'socket.io-client';
import servers from '../../config/servers';
import iceServers from '../../config/ice-servers.json';

const socketSetup = () => new Promise((resolve) => {
  const host = servers.localhost;
  const socket = io(host);
  socket.on('connected', ({ id }) => {
    if (socket.id === id) {
      console.log('SOCKET CONNECTED!');
      console.log(socket.id);
      resolve(socket);
    }
  });
  socket.on('disconnect', () => {
    alert('Disconnected');
  });
});

const peerSetup = () => new Promise((resolve) => {
  const peer = new Peer({
    debug: true,
    config: {
      iceServers,
    },
  });

  peer.on('open', (myPeerId) => {
    const peerId = myPeerId;
    console.log('PEER CONNECTED!');
    console.log(peerId);
    resolve({ peer, peerId });
  });
});

export default async function setupChannels() {
  const socketPromise = socketSetup();
  const peerPromise = peerSetup();

  const values = await Promise.all([socketPromise, peerPromise]);
  return { socket: values[0], peer: values[1].peer, peerId: values[1].peerId };
}
