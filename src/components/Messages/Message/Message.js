/*
*  Пропсы компонента
*  from - имя отправителя
*  fromText - текст "от кого"
*  text - текст сообщения
*  time - время сообщения
*/

import "./Message.css";

export const Message = (props) => {
    let {from, fromText, text, time} = props;

    if (time) {
        const t = new Date(time);
        const m = t.getMinutes() < 10 ? "0" + String(t.getMinutes()) : t.getMinutes();
        time = t.getHours() + ":" + m;
    }

    let isMine = from === "me";

    let classMessage = isMine ? "messages__message_mine" : "messages__message";
    let classMessageText = isMine ? "messages__message-text_mine" : "messages__message-text";
    let classFrom = isMine ? "messages__from_mine" : "messages__from";
    let classTime = isMine ? "messages__time_mine" : "messages__time";

    const div = fromText ? <div className={classFrom}>{fromText}</div> : "";

    return (
            <div className={classMessage}>
                {div}
                <div className={classMessageText}>
                    {text}
                    <div className={classTime}>{time || ""}</div>
                </div>
            </div>
    )
}
