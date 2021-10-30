import React from 'react';
import PropTypes from 'prop-types';
import './Input.css';
import isEnter from '../../helpers/isEnter';

export default function Input({ message, setMessage, sendMessage }) {
  return (
    <div className="input">
      <input
        className="input__element"
        placeholder="Write a message..."
        value={message}
        onChange={
          ((e) => {
            setMessage(e.target.value);
          })
        }
        onKeyDown={
          (e) => {
            if (isEnter(e)) sendMessage();
          }
        }
      />
    </div>
  );
}
Input.propTypes = {
  message: PropTypes.string.isRequired,
  setMessage: PropTypes.func.isRequired,
  sendMessage: PropTypes.func.isRequired,
};
