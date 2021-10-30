import React from 'react';
import './Message.css';
import PropTypes from 'prop-types';

/*
*  Пропсы компонента
*  from - имя отправителя
*  fromText - текст "от кого"
*  text - текст сообщения
*  time - время сообщения
*/

export default function Message({
  from, fromText, text, time,
}) {
  const t = new Date(time);
  const m = t.getMinutes() < 10 ? `0${String(t.getMinutes())}` : t.getMinutes();
  const renderedTime = `${t.getHours()}:${m}`;

  const isMine = from === 'me';

  const classMessage = isMine ? 'messages__message_mine' : 'messages__message';
  const classMessageText = isMine ? 'messages__message-text_mine' : 'messages__message-text';
  const classFrom = isMine ? 'messages__from_mine' : 'messages__from';
  const classTime = isMine ? 'messages__time_mine' : 'messages__time';

  const renderedFromText = fromText ? <div className={classFrom}>{fromText}</div> : '';

  return (
    <div className={classMessage}>
      {renderedFromText}
      <div className={classMessageText}>
        {text}
        <div className={classTime}>{renderedTime || ''}</div>
      </div>
    </div>
  );
}
Message.propTypes = {
  from: PropTypes.string.isRequired,
  fromText: PropTypes.string,
  text: PropTypes.string.isRequired,
  time: PropTypes.number,
};
Message.defaultProps = {
  time: 0,
  fromText: '',
};
