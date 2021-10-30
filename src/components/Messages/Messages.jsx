import React from 'react';
import PropTypes from 'prop-types';

import './Messages.css';
import ScrollToBottom from 'react-scroll-to-bottom';
import Message from './Message/Message';
import Loader from '../Loader/Loader';

export default function Messages({ msgs, username }) {
  const messages = msgs;
  const name = username;

  const proceedMessages = () => {
    if (messages.length === 0) return [];

    const isFirstMine = messages[0].user === name;
    const f = isFirstMine ? 'me' : messages[0].user;
    const arrayWithMessages = [
      <Message key={0} from={f} fromText={f} text={messages[0].text} time={messages[0].time} />,
    ];

    for (let i = 1; i < messages.length; i += 1) {
      const curr = messages[i];
      const prev = messages[i - 1];

      const isMine = curr.user === name;
      const from = isMine ? 'me' : curr.user;

      // Если два сообщения подряд от одного отправителя,
      // то повторно имя автора сообщения не передаем

      const fromText = curr.user === prev.user ? null : from;
      arrayWithMessages.push(
        <Message key={i} from={from} text={curr.text} fromText={fromText} time={curr.time} />,
      );
    }
    return arrayWithMessages;
  };

  return (
    <ScrollToBottom className="messages" initialScrollBehavior="smooth">
      {messages.length ? (
        <div className="messages__container">
          { proceedMessages().map((m) => m) }
        </div>
      ) : <Loader />}
    </ScrollToBottom>
  );
}
Messages.propTypes = {
  msgs: PropTypes.arrayOf(PropTypes.shape({
    user: PropTypes.string,
    text: PropTypes.string,
    time: PropTypes.number,
  })).isRequired,
  username: PropTypes.string.isRequired,
};
