import React from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

import './CreateRoom.css';

export default function CreateRoom() {
  return (
    <div className="create-room__wrapper">
      <p>This is a powerful tool that helps teaching people</p>
      <Link to={`/${uuid()}`} style={{ textDecoration: 'none' }}>
        <div className="create-room__button">Create Room</div>
      </Link>
    </div>
  );
}
